import api from "./api";

export async function analyseSingleCV(formData) {
    const response = await api.post("/api/v1/analyse-single-cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

export async function analyseMultipleCVs(formData) {
    const response = await api.post("/api/v1/analyse-multiple-cvs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}
