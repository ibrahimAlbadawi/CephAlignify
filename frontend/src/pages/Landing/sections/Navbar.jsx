import React from "react";

import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import "./Navbar.css";

import { Logos } from "../../../utils/constants.jsx";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                document
                    .getElementById(id)
                    ?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <AppBar position="sticky" color="transparent" elevation={0}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <RouterLink
                    to="/"
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <img
                        src={Logos.CephAliginfySideColored}
                        alt="CephAlignify"
                        style={{ height: 40 }}
                    />
                </RouterLink>

                <Box sx={{ display: "flex", gap: 3 }}>
                    <Button
                        color="inherit"
                        onClick={() => scrollToSection("about")}
                    >
                        About
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => scrollToSection("how-to-use")}
                    >
                        How to Use
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => scrollToSection("pricing")}
                    >
                        Pricing
                    </Button>
                </Box>
                <Button
                    component={RouterLink}
                    to="/login"
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 2 }}
                >
                    Login
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
