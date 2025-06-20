import axios from "./axios";

// Get doctor profile
export const getDoctorProfile = () => {
    return axios.get("/doctor/profile/");
};

// Update doctor profile
export const updateDoctorProfile = (profileData) => {
    return axios.patch("/doctor/profile/", profileData);
};
