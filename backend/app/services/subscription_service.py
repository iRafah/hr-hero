import uuid
from datetime import datetime

import stripe
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
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

    # Persist the Stripe customer ID immediately so we can look it up on webhook
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


async def handle_webhook(db: AsyncSession, payload: bytes, stripe_signature: str) -> dict:
    """Verify and process a Stripe webhook event."""
    import json

    if not settings.STRIPE_WEBHOOK_SECRET:
        # Dev-only fallback: no secret configured, parse without verification
        event = json.loads(payload)
    else:
        try:
            event = stripe.Webhook.construct_event(
                payload, stripe_signature, settings.STRIPE_WEBHOOK_SECRET
            )
        except stripe.error.SignatureVerificationError:
            raise ValueError("Assinatura do webhook inválida")

    event_type = event["type"]

    # Stripe SDK returns StripeObject (not a plain dict) when construct_event is used.
    # str() on a StripeObject serialises to JSON, giving us a consistent plain dict
    # that all handlers can safely use .get() on.
    raw = event["data"]["object"]
    data = json.loads(str(raw)) if not isinstance(raw, dict) else raw

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

    This is a reliable fallback for when the Stripe webhook hasn't fired yet
    (e.g. local dev without the Stripe CLI running).
    """
    import json

    stripe_session = stripe.checkout.Session.retrieve(session_id)
    # Normalise to plain dict so all downstream code can safely use .get()
    session = json.loads(str(stripe_session))

    # Verify ownership — never trust a session_id from the frontend blindly
    meta_user_id = session.get("metadata", {}).get("user_id")
    if meta_user_id != str(user.id):
        raise ValueError("Sessão inválida para este usuário")

    if session.get("payment_status") != "paid":
        raise ValueError("Pagamento ainda não confirmado")

    # Re-use the same logic the webhook calls
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

    # Cancel at period end so user keeps access until billing cycle ends
    stripe.Subscription.modify(
        subscription.stripe_subscription_id,
        cancel_at_period_end=True,
    )

    subscription.status = "canceled"
    await db.commit()
    await db.refresh(subscription)

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
        import json as _json
        stripe_sub = _json.loads(str(stripe.Subscription.retrieve(stripe_subscription_id)))
        period_end = datetime.fromtimestamp(stripe_sub["current_period_end"])
    except Exception:
        # Non-fatal: subscription is still activated; period_end will be filled
        # by the subsequent customer.subscription.updated webhook.
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


async def _handle_subscription_updated(db: AsyncSession, stripe_sub: dict) -> None:
    subscription_id = stripe_sub.get("id")

    result = await db.execute(
        select(Subscription).where(Subscription.stripe_subscription_id == subscription_id)
    )
    subscription = result.scalar_one_or_none()
    if not subscription:
        return

    stripe_status = stripe_sub.get("status", "inactive")
    status_map = {
        "active": "active",
        "past_due": "past_due",
        "canceled": "canceled",
        "trialing": "trialing",
    }
    subscription.status = status_map.get(stripe_status, "inactive")

    if stripe_sub.get("current_period_end"):
        subscription.current_period_end = datetime.fromtimestamp(stripe_sub["current_period_end"])

    if stripe_status == "canceled":
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
    if subscription:
        subscription.status = "past_due"
        await db.commit()
