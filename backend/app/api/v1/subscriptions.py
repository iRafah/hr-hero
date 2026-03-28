import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status

logger = logging.getLogger(__name__)
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_verified_user
from app.core.database import get_db
from app.models.schemas import (
    ChangePlanRequest,
    CheckoutSessionRequest,
    CheckoutSessionResponse,
    PortalSessionResponse,
    SubscriptionResponse,
)
from app.models.user import User
from app.services import subscription_service

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])


@router.post("/create-checkout-session", response_model=CheckoutSessionResponse)
async def create_checkout_session(
    body: CheckoutSessionRequest,
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        url = await subscription_service.create_checkout_session(db, current_user, body.plan.value)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))

    return CheckoutSessionResponse(checkout_url=url)


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Stripe calls this endpoint after payment events. No user auth — verified via signature."""
    payload = await request.body()
    stripe_signature = request.headers.get("stripe-signature", "")

    try:
        result = await subscription_service.handle_webhook(db, payload, stripe_signature)
    except ValueError as error:
        # Invalid signature — tell Stripe not to retry
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))
    except Exception as error:
        # Unexpected error — log it but still return 200 so Stripe doesn't retry endlessly
        logger.exception("Unhandled error processing Stripe webhook: %s", error)
        return {"status": "error", "detail": str(error)}

    return result


@router.get("/verify-checkout", response_model=SubscriptionResponse)
async def verify_checkout(
    session_id: str,
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
):
    """Verify a completed Stripe Checkout session and activate the subscription.
    Called by the success page — works even without webhooks configured.
    """
    try:
        subscription = await subscription_service.verify_checkout_session(
            db, session_id, current_user
        )
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))

    return subscription


@router.post("/portal", response_model=PortalSessionResponse)
async def create_billing_portal(
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
):
    """Return a Stripe Billing Portal URL for the current user."""
    try:
        url = await subscription_service.create_portal_session(db, current_user)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))

    return PortalSessionResponse(portal_url=url)


@router.post("/change-plan", response_model=SubscriptionResponse)
async def change_plan(
    body: ChangePlanRequest,
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
):
    """Upgrade or downgrade between paid plans without a new Checkout session."""
    try:
        subscription = await subscription_service.change_plan(db, current_user, body.plan.value)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))

    return subscription


@router.get("/minha-assinatura", response_model=SubscriptionResponse | None)
async def get_my_subscription(
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
):
    return await subscription_service.get_user_subscription(db, current_user.id)


@router.post("/cancelar", response_model=SubscriptionResponse)
async def cancel_my_subscription(
    current_user: User = Depends(get_current_verified_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        subscription = await subscription_service.cancel_subscription(db, current_user)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))

    return subscription
