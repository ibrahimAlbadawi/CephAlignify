import axios from "./axios";

// User login
export const loginUser = async (credentials) => {
    const res = await axios.post("/user/login/", credentials);
    return res;
};