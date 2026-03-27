import api from "./api";

export async function createCheckoutSession(plan) {
    const response = await api.post("/api/v1/subscriptions/create-checkout-session", { plan });
    return response.data;
}

export async function getMySubscription() {
    const response = await api.get("/api/v1/subscriptions/minha-assinatura");
    return response.data;
}

export async function cancelSubscription() {
    const response = await api.post("/api/v1/subscriptions/cancelar");
    return response.data;
}
