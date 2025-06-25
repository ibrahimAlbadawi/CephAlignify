import axios from "./axios";

// View visit details for a specific appointment (doctor-only)
export const getVisitByAppointmentId = (appointmentId) => {
    return axios.get(`/appointments/${appointmentId}/visit/`);
};

// Create a new visit for an appointment (doctor-only)
export const createVisit = (appointmentId, visitData) => {
    return axios.post(`/appointments/${appointmentId}/visit/`, visitData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// Edit (overwrite) an existing visit (doctor-only)
export const editVisit = (appointmentId, updatedData) => {
    return axios.put(`/appointments/${appointmentId}/visit/`, updatedData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
