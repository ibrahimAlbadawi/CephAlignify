import React, { useState } from "react";

import { useUser } from "../../../context/UserProvider";

import { useNavigate, useLocation } from "react-router-dom";

import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    Typography,
} from "@mui/material";

import { Icons } from "../../../utils/constants";

const drawerWidth = 102;

const mainColor = "#284B63";

const buttonStyle = {
    width: 68,
    height: 68,
    borderRadius: "50%",
    bgcolor: "white",
    color: { mainColor },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 13,
    fontWeight: 800,
    "&:hover": {
        bgcolor: "#EAEAEA",
    },
};

const labelToPath = {
    "Today’s Agenda": "/doctordashboard/todaysagenda",
    "All Patients": "/doctordashboard/allpatients",
    "3D Skull": "/doctordashboard/skull",
    "Profile": "/doctordashboard/profile",
};

const DoctorSidebar = () => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const location = useLocation();

    const { user } = useUser();

    // Dynamic data
    const doctorName = user?.full_name || "Doctor";
    const clinicName = user?.clinic_name || "Clinic";
    const now = new Date();
    const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // ✅ This forces 24-hour format
    });
    const date = now.toLocaleDateString();

    {
        /* since the profile button is seperated from other buttons in the sidebar, it needs its own setup*/
    }
    const isProfileActive = location.pathname === "/doctordashboard/profile";

    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        navigate("/login")
    }
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                overflow: "visible",
                "& .MuiDrawer-paper": {
                    position: "fixed",
                    width: drawerWidth,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    py: 2,
                    overflow: "visible",
                    zIndex: 1100,
                    backgroundColor: mainColor,
                    height: "100vh",
                },
            }}
        >
            {/* Top + Centered Buttons */}
            <List
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 2,
                            position: "relative",
                        }}
                    >
                        {/* Logo */}
                        <Box
                            component="img"
                            src={Icons.FaviconBlackTheme}
                            alt="Logo"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            sx={{
                                width: 60,
                                height: 60,
                                transition: "transform 0.6s ease",
                                transform: isHovered
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                                cursor: "pointer",
                            }}
                        />

                        {/* Info Box with Arrow */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "100%", // push to the right of the logo
                                ml: 2, // small space between logo and box
                                transform: "translateY(-50%)",
                                backgroundColor: "#ffffff",
                                color: "#284b63",
                                p: 2,
                                borderRadius: 2,
                                boxShadow: 3,
                                minWidth: 160,
                                zIndex: 1300,
                                opacity: isHovered ? 1 : 0,
                                transition: "opacity 0.3s ease",
                                pointerEvents: "none",
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: "50%",
                                    right: "100%",
                                    transform: "translateY(-50%)",
                                    border: "6px solid transparent",
                                    borderRightColor: "#f5f5f5",
                                },
                            }}
                        >
                            <Typography variant="body2">
                                <strong>Name:</strong> {doctorName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Clinic:</strong> {clinicName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Time:</strong> {time}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Date:</strong> {date}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    {[
                        "Today’s Agenda",
                        "All Patients",
                        "3D Skull",
                        "Profile",
                    ].map((label, index) => {
                        const path = labelToPath[label];
                        const isActive = location.pathname === path;

                        return (
                            <ListItem key={index}>
                                <ListItemButton
                                    sx={{
                                        ...buttonStyle,
                                        bgcolor: isActive ? "#5985A3" : "white",
                                        color: isActive ? "white" : mainColor,
                                    }}
                                    onClick={() => navigate(path)}
                                >
                                    {label}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </Box>
            </List>

            {/* Bottom Button */}
            <List sx={{ alignItems: "center" }}>
            <ListItem>
                    <ListItemButton
                        sx={{
                            ...buttonStyle,
                            bgcolor: "white",
                            color: mainColor,
                        }}
                        onClick={logout}
                    >
                        Logout
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
};

export default DoctorSidebar;
