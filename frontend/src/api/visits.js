import axios from "./axios";

// Update appointment status (doctor-only)
export const updateAppointmentStatus = (appointmentId, checked) => {
    return axios.put(`/appointments/${appointmentId}/status/`, {
        checked,
    });
};

// List all appointments (doctor + secretary)
export const getAllVisits = () => {
    return axios.get("/appointments/");
};

// Create a new visit (secretary)
export const createVisit = (visitData) => {
    return axios.post("/secretary/visits/", visitData);
};

// Edit an existing visit (secretary)
export const editVisit = (visitId, updatedData) => {
    return axios.put(`/secretary/visits/${visitId}/`, updatedData);
};

// Cancel (delete) a visit (secretary)
export const cancelVisit = (visitId) => {
    return axios.delete(`/secretary/visits/${visitId}/`);
};
