import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

import "./Navbar.css";

import { Logos } from "../../../utils/constants.jsx";
import PrimaryButton from "../../../utils/PrimaryButton.jsx";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <div id="container">
            {/* Logo */}
            <RouterLink
                to="/"
                style={{ display: "flex", alignItems: "center" }}
            >
                <img src={Logos.CephAliginfySideColored} alt="CephAlignify" />
            </RouterLink>

            {/* Navigation Links */}
            <div id="inner-container">
                <RouterLink id="link" to="/about">
                    About
                </RouterLink>

                {/* Smooth Scroll Links */}
                <HashLink smooth to="/#steps-container">
                    How to use
                </HashLink>
                <HashLink smooth to="/#pricing-container">
                    Pricing
                </HashLink>
            </div>

            {/* Login Button */}
            <div id="login-button">
                <PrimaryButton
                    text="Login"
                    width="132px"
                    height="40px"
                    fontSize="20px"
                    onClick={handleLogin}
                />
            </div>
        </div>
    );
};

export default Navbar;
