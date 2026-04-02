import { useState, useEffect } from "react";
import {
    createCheckoutSession,
    getMySubscription,
    cancelSubscription,
    changePlan as changePlanApi,
    createPortalSession,
} from "../../../services/subscriptionApi";

export function useSubscription() {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSubscription();
    }, []);

    async function fetchSubscription() {
        setLoading(true);
        setError(null);
        try {
            const data = await getMySubscription();
            setSubscription(data);
        } catch (err) {
            setError(err?.response?.data?.detail || "Erro ao carregar assinatura");
        } finally {
            setLoading(false);
        }
    }

    async function startCheckout(plan) {
        const { checkout_url } = await createCheckoutSession(plan);
        window.location.href = checkout_url;
    }

    async function cancel() {
        const updated = await cancelSubscription();
        setSubscription(updated);
        return updated;
    }

    async function changePlan(newPlan) {
        const updated = await changePlanApi(newPlan);
        setSubscription(updated);
        return updated;
    }

    async function openPortal() {
        const { portal_url } = await createPortalSession();
        window.location.href = portal_url;
    }

    return {
        subscription,
        loading,
        error,
        startCheckout,
        cancel,
        changePlan,
        openPortal,
        refetch: fetchSubscription,
    };
}
