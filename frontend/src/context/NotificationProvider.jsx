import React, { createContext, useContext, useState, forwardRef } from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState({
        open: false,
        text: "",
        type: "info",
    });

    const showNotification = ({ text, type = "info" }) => {
        setNotification({ open: true, text, type });
    };

    const handleClose = () => {
        setNotification((prev) => ({ ...prev, open: false }));
    };

    const SlideDownTransition = forwardRef(function Transition(props, ref) {
        return <Slide direction="down" ref={ref} {...props} />;
    });

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}

            <Snackbar
                open={notification.open}
                onClose={handleClose}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                slots={{
                    transition: SlideDownTransition,
                }}
                slotProps={{
                    transition: {
                        timeout: {
                            enter: 400,
                            exit: 300,
                        },
                    },
                }}
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: (theme) => theme.zIndex.snackbar + 10,
                    width: "100%",
                    margin: 0,
                }}
            >
                <Alert
                    onClose={handleClose}
                    severity={notification.type}
                    variant="filled"
                    sx={{
                        width: "100%",
                        borderRadius: 0,
                    }}
                >
                    {notification.text}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
}
