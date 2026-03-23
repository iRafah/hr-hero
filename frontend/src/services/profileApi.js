import api from "./api";

export async function updateMyUser(userData) {
    const response = await api.patch("/api/v1/users/me", userData);
    return response.data;
}

// Legacy generic profile (kept for experiences/education endpoints)
export async function getMyProfile() {
    const response = await api.get("/api/v1/users/me/profile");
    return response.data;
}

export async function updateMyProfile(profileData) {
    const response = await api.put("/api/v1/users/me/profile", profileData);
    return response.data;
}

// Candidate profile (role: user)
export async function getCandidateProfile() {
    const response = await api.get("/api/v1/candidate-profiles/me");
    return response.data;
}

export async function updateCandidateProfile(profileData) {
    const response = await api.put("/api/v1/candidate-profiles/me", profileData);
    return response.data;
}

// Recruiter profile (role: recruiter)
export async function getRecruiterProfile() {
    const response = await api.get("/api/v1/recruiter-profiles/me");
    return response.data;
}

export async function updateRecruiterProfile(profileData) {
    const response = await api.put("/api/v1/recruiter-profiles/me", profileData);
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
