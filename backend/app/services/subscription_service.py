import decimal
import uuid
from datetime import datetime

import stripe
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.email_service import (
    send_cancellation_email,
    send_payment_failed_email,
    send_payment_success_email,
    send_plan_changed_email,
)
from app.models.user import Subscription, User

stripe.api_key = settings.STRIPE_SECRET_KEY

_PRICE_MAP = {
    "pro": settings.STRIPE_PRICE_PRO,
    "business": settings.STRIPE_PRICE_BUSINESS,
}


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

async def _get_subscription(db: AsyncSession, user_id) -> Subscription | None:
    result = await db.execute(select(Subscription).where(Subscription.user_id == user_id))
    return result.scalar_one_or_none()


async def _get_or_create_stripe_customer(user: User, subscription: Subscription | None) -> str:
    if subscription and subscription.stripe_customer_id:
        return subscription.stripe_customer_id

    customer = stripe.Customer.create(
        email=user.email,
        name=user.full_name,
        metadata={"user_id": str(user.id)},
    )
    return customer.id


def _to_dict(obj):
    """Recursively convert a Stripe SDK object to a plain Python dict.

    Newer Stripe SDK versions (v5+) store data in ._data and do NOT expose
    .keys() / .get() as native methods — those go through __getattr__ which
    raises AttributeError if the key isn't in the payload.  We therefore
    access ._data directly instead of relying on the dict-like interface.

    Also handles Decimal values that the Stripe SDK may embed for monetary
    amounts, which are not JSON-serializable by default.
    """
    if isinstance(obj, decimal.Decimal):
        int_val = int(obj)
        return int_val if decimal.Decimal(int_val) == obj else float(obj)
    if isinstance(obj, list):
        return [_to_dict(v) for v in obj]
    if isinstance(obj, dict):
        return {k: _to_dict(v) for k, v in obj.items()}
    # StripeObject keeps its payload in a private ._data dict
    _data = getattr(obj, "_data", None)
    if isinstance(_data, dict):
        return {k: _to_dict(v) for k, v in _data.items()}
    return obj


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

async def create_checkout_session(db: AsyncSession, user: User, plan: str) -> str:
    """Create a Stripe Checkout session and return the redirect URL."""
    price_id = _PRICE_MAP.get(plan)
    if not price_id:
        raise ValueError(f"Plano inválido: {plan}")

    subscription = await _get_subscription(db, user.id)
    customer_id = await _get_or_create_stripe_customer(user, subscription)

    if not subscription:
        subscription = Subscription(user_id=user.id, stripe_customer_id=customer_id)
        db.add(subscription)
    else:
        subscription.stripe_customer_id = customer_id

    await db.commit()

    session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        line_items=[{"price": price_id, "quantity": 1}],
        mode="subscription",
        success_url=(
            f"{settings.FRONTEND_URL}/subscribe/sucesso?session_id={{CHECKOUT_SESSION_ID}}"
        ),
        cancel_url=f"{settings.FRONTEND_URL}/subscribe",
        metadata={"user_id": str(user.id), "plan": plan},
    )

    return session.url


async def create_portal_session(db: AsyncSession, user: User) -> str:
    """Create a Stripe Billing Portal session and return the redirect URL."""
    subscription = await _get_subscription(db, user.id)

    if not subscription or not subscription.stripe_customer_id:
        raise ValueError("Nenhuma assinatura encontrada para gerenciar")

    session = stripe.billing_portal.Session.create(
        customer=subscription.stripe_customer_id,
        return_url=f"{settings.FRONTEND_URL}/account/subscription",
    )
    return session.url


async def change_plan(db: AsyncSession, user: User, new_plan: str) -> Subscription:
    """Upgrade or downgrade an active paid subscription to another paid plan."""
    subscription = await _get_subscription(db, user.id)

    if not subscription or not subscription.stripe_subscription_id:
        raise ValueError("Nenhuma assinatura ativa encontrada")

    if subscription.plan == new_plan:
        raise ValueError("Você já está neste plano")

    if subscription.status not in ("active", "trialing"):
        raise ValueError("Assinatura não está ativa")

    new_price_id = _PRICE_MAP.get(new_plan)
    if not new_price_id:
        raise ValueError(f"Plano inválido: {new_plan}")

    stripe_sub = _to_dict(stripe.Subscription.retrieve(subscription.stripe_subscription_id))
    item_id = stripe_sub["items"]["data"][0]["id"]
    old_plan = subscription.plan

    updated_stripe_sub = _to_dict(
        stripe.Subscription.modify(
            subscription.stripe_subscription_id,
            items=[{"id": item_id, "price": new_price_id}],
            proration_behavior="create_prorations",
        )
    )

    subscription.plan = new_plan
    if updated_stripe_sub.get("current_period_end"):
        subscription.current_period_end = datetime.fromtimestamp(
            updated_stripe_sub["current_period_end"]
        )
    await db.commit()
    await db.refresh(subscription)

    try:
        await send_plan_changed_email(user.email, user.full_name, old_plan, new_plan)
    except Exception:
        pass  # Email failure must not roll back a successful plan change

    return subscription


async def handle_webhook(db: AsyncSession, payload: bytes, stripe_signature: str) -> dict:
    """Verify and process a Stripe webhook event."""
    import json as _json

    if settings.STRIPE_WEBHOOK_SECRET:
        # Use construct_event only for signature verification; the returned
        # StripeObject is discarded in favour of re-parsing the raw payload as
        # plain JSON to avoid all SDK object serialisation issues.
        try:
            stripe.Webhook.construct_event(
                payload, stripe_signature, settings.STRIPE_WEBHOOK_SECRET
            )
        except stripe.error.SignatureVerificationError:
            raise ValueError("Assinatura do webhook inválida")

    event = _json.loads(payload)
    event_type = event["type"]
    data = event["data"]["object"]

    if event_type == "checkout.session.completed":
        await _handle_checkout_completed(db, data)
    elif event_type in (
        "customer.subscription.created",
        "customer.subscription.updated",
        "customer.subscription.deleted",
    ):
        await _handle_subscription_updated(db, data)
    elif event_type == "invoice.payment_failed":
        await _handle_payment_failed(db, data)

    return {"status": "ok"}


async def verify_checkout_session(db: AsyncSession, session_id: str, user: User) -> Subscription:
    """Called from the success page to activate the subscription immediately.

    Reliable fallback for when the Stripe webhook hasn't fired yet in local dev.
    """
    stripe_session = stripe.checkout.Session.retrieve(session_id)
    session = _to_dict(stripe_session)

    meta_user_id = session.get("metadata", {}).get("user_id")
    if meta_user_id != str(user.id):
        raise ValueError("Sessão inválida para este usuário")

    if session.get("payment_status") != "paid":
        raise ValueError("Pagamento ainda não confirmado")

    await _handle_checkout_completed(db, session)

    subscription = await _get_subscription(db, user.id)
    if not subscription:
        raise ValueError("Assinatura não encontrada após ativação")

    return subscription


async def get_user_subscription(db: AsyncSession, user_id) -> Subscription | None:
    return await _get_subscription(db, user_id)


async def cancel_subscription(db: AsyncSession, user: User) -> Subscription:
    subscription = await _get_subscription(db, user.id)

    if not subscription or not subscription.stripe_subscription_id:
        raise ValueError("Nenhuma assinatura ativa encontrada")

    if subscription.status not in ("active", "trialing", "past_due"):
        raise ValueError("Assinatura já está cancelada ou inativa")

    stripe.Subscription.modify(
        subscription.stripe_subscription_id,
        cancel_at_period_end=True,
    )

    subscription.status = "canceled"
    await db.commit()
    await db.refresh(subscription)

    period_end_str = (
        subscription.current_period_end.strftime("%d/%m/%Y")
        if subscription.current_period_end
        else "em breve"
    )
    try:
        await send_cancellation_email(user.email, user.full_name, period_end_str)
    except Exception:
        pass

    return subscription


# ---------------------------------------------------------------------------
# Webhook handlers (private)
# ---------------------------------------------------------------------------

async def _handle_checkout_completed(db: AsyncSession, session: dict) -> None:
    user_id = session.get("metadata", {}).get("user_id")
    plan = session.get("metadata", {}).get("plan")
    stripe_subscription_id = session.get("subscription")

    if not (user_id and plan and stripe_subscription_id):
        return

    period_end = None
    try:
        stripe_sub = _to_dict(stripe.Subscription.retrieve(stripe_subscription_id))
        period_end = datetime.fromtimestamp(stripe_sub["current_period_end"])
    except Exception:
        pass

    user_uuid = uuid.UUID(user_id)
    result = await db.execute(select(Subscription).where(Subscription.user_id == user_uuid))
    subscription = result.scalar_one_or_none()

    if not subscription:
        subscription = Subscription(user_id=user_uuid)
        db.add(subscription)

    subscription.stripe_subscription_id = stripe_subscription_id
    subscription.plan = plan
    subscription.status = "active"
    if period_end:
        subscription.current_period_end = period_end

    await db.commit()

    # Send payment success email (best-effort)
    try:
        user = await db.get(User, user_uuid)
        if user:
            await send_payment_success_email(user.email, user.full_name, plan)
    except Exception:
        pass


async def _handle_subscription_updated(db: AsyncSession, stripe_sub: dict) -> None:
    subscription_id = stripe_sub.get("id")

    result = await db.execute(
        select(Subscription).where(Subscription.stripe_subscription_id == subscription_id)
    )
    subscription = result.scalar_one_or_none()
    if not subscription:
        return

    stripe_status = stripe_sub.get("status", "inactive")
    cancel_at_period_end = stripe_sub.get("cancel_at_period_end", False)

    # When Stripe confirms cancellation at period end, keep our "canceled" status.
    # Without this guard, Stripe's "active" event would overwrite our local canceled state.
    if cancel_at_period_end and stripe_status == "active":
        db_status = "canceled"
    else:
        status_map = {
            "active": "active",
            "past_due": "past_due",
            "canceled": "canceled",
            "trialing": "trialing",
        }
        db_status = status_map.get(stripe_status, "inactive")

    subscription.status = db_status

    if stripe_sub.get("current_period_end"):
        subscription.current_period_end = datetime.fromtimestamp(stripe_sub["current_period_end"])

    # Subscription fully expired — drop back to free
    if stripe_status == "canceled" and not cancel_at_period_end:
        subscription.plan = "free"

    await db.commit()


async def _handle_payment_failed(db: AsyncSession, invoice: dict) -> None:
    subscription_id = invoice.get("subscription")
    if not subscription_id:
        return

    result = await db.execute(
        select(Subscription).where(Subscription.stripe_subscription_id == subscription_id)
    )
    subscription = result.scalar_one_or_none()
    if not subscription:
        return

    subscription.status = "past_due"
    await db.commit()

    # Send payment failed email (best-effort)
    try:
        user = await db.get(User, subscription.user_id)
        if user:
            await send_payment_failed_email(user.email, user.full_name)
    except Exception:
        pass
