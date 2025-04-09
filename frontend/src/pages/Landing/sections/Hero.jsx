import React from "react";

import PrimaryButton from "../../../utils/PrimaryButton";
import "./Hero.css";

const Hero = () => {
    return (
        <div id="hero-container">
            <div>
                <h1>Modern Tools for Modern Clinics</h1>
                <p>
                    A seamless platform combining AI-driven cephalometric
                    analysis with powerful tools to manage patients,
                    appointments, and records, all in one place.
                </p>
                <div id="header-buttons">
                    <PrimaryButton
                        text="Create Account"
                        width="187px"
                        height="66px"
                        fontSize="20px"
                        onClick
                    />
                    <PrimaryButton
                        text="Learn more"
                        width="187px"
                        height="66px"
                        fontSize="20px"
                        onClick
                    />
                </div>
            </div>
            <iframe
                src="https://my.spline.design/aiassistanthoverandclickinteraction-19631ae2545dfae8895116bb7bec0059/"
                frameborder="0"
                width="100%"
                height="100%"
            ></iframe>
        </div>
    );
};

export default Hero;
