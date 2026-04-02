import api from "./api";

export async function registerUser({ email, password, full_name, role = "candidate" }) {
    const response = await api.post("/api/v1/auth/register", { email, password, full_name, role });
    return response.data;
}

export async function loginUser({ email, password }) {
    const response = await api.post("/api/v1/auth/login", { email, password });
    return response.data;
}

export async function getCurrentUser() {
    const response = await api.get("/api/v1/users/me");
    return response.data;
}

export async function verifyEmail(token) {
    const response = await api.get(`/api/v1/auth/verificar-email?token=${token}`);
    return response.data;
}
