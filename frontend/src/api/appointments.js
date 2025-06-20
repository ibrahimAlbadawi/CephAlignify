import axios from "./axios";

// Update appointment status (doctor-only)
// export const updateAppointmentStatus = (appointmentId, checked) => {
//     return axios.put(`/appointments/${appointmentId}/status/`, {
//         checked,
//     });
// };

// List all appointments (doctor + secretary)
export const getAllAppointments = () => {
    return axios.get("/appointments/");
};

// Create a new appointment (secretary)
export const createAppointment = (appointmentData) => {
    return axios.post("/appointments/", appointmentData);
};

// Edit an existing appointment (secretary)
export const editAppointment = (appointmentId, updatedData) => {
    return axios.put(`/appointments/${appointmentId}/`, updatedData);
};

// Cancel (delete) a appointment (secretary)
export const cancelAppointment = (appointmentId) => {
    return axios.delete(`/appointments/${appointmentId}/`);
};
