import axios from "./axios";

// User login
export const loginUser = async ({ identifier, password, role }) => {
    const res = await axios.post("login/", {
        id: identifier,
        password,
        role
    });
    return res;
};
