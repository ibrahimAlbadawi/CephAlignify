import axios from "./axios";

// User login
export const login = (credentials) => {
    return axios.post("/auth/login/", credentials);
};
