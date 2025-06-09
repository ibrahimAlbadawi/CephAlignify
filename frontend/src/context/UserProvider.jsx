import React, { createContext, useContext, useEffect, useState } from "react";

// 1. Create context
const UserContext = createContext();

// 2. Context provider
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Load user from localStorage on mount
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// 3. Custom hook for consuming context
export const useUser = () => useContext(UserContext);
