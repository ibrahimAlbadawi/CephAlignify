import React from "react";

import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import "./Navbar.css";

import { Logos } from "../../../utils/constants.jsx";
import PrimaryButton from "../../../utils/PrimaryButton.jsx";

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
        <div id="container">
            <RouterLink
                to="/"
                style={{ display: "flex", alignItems: "center" }}
            >
                <img src={Logos.CephAliginfySideColored} alt="CephAlignify" />
            </RouterLink>
            <div id="inner-container">
                <a href="">About</a>
                <a href="">How to use</a>
                <a href="">Pricing</a>
            </div>
            <PrimaryButton
                text="Login"
                width="132px"
                height="40px"
                fontSize="20px"
            />
        </div>
    );
};

export default Navbar;
