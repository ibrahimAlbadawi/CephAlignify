import React from "react";

import PrimaryButton from "../../../utils/PrimaryButton";
import "./Hero.css";

import { useNavigate } from "react-router-dom";

import { useNotification } from "../../../hooks/useNotification";

const Hero = () => {
    const navigate = useNavigate();

    const handleContact = () => {
            navigate("/contact");
    };

    const handleAbout = () => {
        navigate("/about");
    };
    return (
        <div id="hero-container">
            <div id="hero-mobile-screen-render">
                <iframe
                    src="https://my.spline.design/aivoiceassistant80smobileversion-i5k6CqQEnJTCZy0eTslc35iI/"
                    frameborder="0"
                    width="100%"
                    height="300%"
                ></iframe>
            </div>
            <div id="hero-content">
                <h1>Modern Tools for Modern Clinics</h1>
                <p>
                    A seamless platform combining AI-driven cephalometric
                    analysis with powerful tools to manage patients,
                    appointments, and records, all in one place.
                </p>
                <div id="header-buttons">
                    <PrimaryButton
                        text="Contact us"
                        width="187px"
                        height="66px"
                        fontSize="20px"
                        onClick={handleContact}
                    />
                    <PrimaryButton
                        text="Learn more"
                        width="187px"
                        height="66px"
                        fontSize="20px"
                        onClick={handleAbout}
                    />
                </div>
            </div>
            <div id="hero-desktop-screen-render">
                <iframe
                    src="https://my.spline.design/aivoiceassistant80s-YkCDdZI67Kq4i7wjHbK2qgHD/"
                    frameborder="0"
                    width="100%"
                    height="100%"
                ></iframe>
            </div>
        </div>
    );
};

export default Hero;
