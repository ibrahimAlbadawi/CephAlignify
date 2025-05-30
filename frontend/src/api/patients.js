import axios from "./axios";

// View all patients (Doctor + Secretary)
export const getAllPatients = () => {
    return axios.get("/patients/");
};

// Create a new patient (Secretary only)
export const createPatient = (patientData) => {
    return axios.post("/patients/", patientData);
};

// Edit an existing patient profile (Secretary only)
export const editPatient = (patientId, updatedData) => {
    return axios.put(`/secretary/patients/${patientId}/`, updatedData);
};

// View a specific patient profile by ID (Secretary only)
export const getPatientById = (patientId) => {
    return axios.get(`/secretary/patients/${patientId}/`);
};
