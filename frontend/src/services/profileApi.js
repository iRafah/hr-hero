import api from "./api";

export async function updateMyUser(userData) {
    const response = await api.patch("/api/v1/users/me", userData);
    return response.data;
}

export async function getMyProfile() {
    const response = await api.get("/api/v1/users/me/profile");
    return response.data;
}

export async function updateMyProfile(profileData) {
    const response = await api.put("/api/v1/users/me/profile", profileData);
    return response.data;
}

export async function addExperience(experienceData) {
    const response = await api.post("/api/v1/users/me/experiences", experienceData);
    return response.data;
}

export async function deleteExperience(experienceId) {
    await api.delete(`/api/v1/users/me/experiences/${experienceId}`);
}

export async function addEducation(educationData) {
    const response = await api.post("/api/v1/users/me/education", educationData);
    return response.data;
}

export async function deleteEducation(educationId) {
    await api.delete(`/api/v1/users/me/education/${educationId}`);
}
