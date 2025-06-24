import React from "react";
import { Link as RouterLink } from "react-router-dom";

import "./Footer.css";

import { Logos } from "../../../utils/constants.jsx";
const Footer = () => {
    return (
        <div id="footer-main-container">
           <div id="footer-container">
            <RouterLink to="/" style={{ display: "flex" }}>
                <img
                    id="footer-logo"
                    src={Logos.CephAliginfyMainColored}
                    alt="CephAlignify"
                />
            </RouterLink>
            <div className="footer-sublinks">
                <h2 className="footer-sublinks-title">Navigation</h2>
                <a href="./">Home</a>
                <RouterLink to="/about">About</RouterLink>
                <RouterLink to="/why-us">Why Us</RouterLink>
                <RouterLink to="/steps">How To Use</RouterLink>
                <RouterLink to="/pricing">Pricing</RouterLink>
                <RouterLink to="/login">Login</RouterLink>
            </div>
            <div className="footer-sublinks">
                <h2 className="footer-sublinks-title">Contact</h2>
                <RouterLink to="/address">Address</RouterLink>
                <RouterLink to="/phone">Phone Number</RouterLink>
                <RouterLink to="/email">Email</RouterLink>
            </div>
            <div className="footer-sublinks">
                <h2 className="footer-sublinks-title">Social Media Links</h2>
                <RouterLink to="/facebook">Facebook</RouterLink>
                <RouterLink to="/instagram">Instagram</RouterLink>
                <RouterLink to="/x">X</RouterLink>
            </div>

        </div> 
            <p id="footer-copyright">CephAlignify 2025 All Rights Reserved</p>
        </div>
    );
};

export default Footer;
