import axios from "./axios";

// User login
export const loginUser = async ({ identifier, password }) => {
    const res = await axios.post("login/", {
        id: identifier,
        password,
    });
    return res;
};
