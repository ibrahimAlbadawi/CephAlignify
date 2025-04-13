import React from "react";

import "./AboutAndFuture.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

import PrimaryButton from "../../../utils/PrimaryButton";

import { Others } from "../../../utils/constants";

import { useNavigate } from "react-router-dom";

const AboutAndFuture = () => {
    const navigate = useNavigate();

    const handleGoingBack = () => {
        navigate("/");
    };

    return (
        <div id="about-and-future-container">
            <Navbar />
            <div id="about-container">
                <div>
                    <h1>About</h1>
                    <p>
                        We’re a team of three young engineers on a mission to
                        simplify dental workflows. With CephAlignify, we aim to
                        bring smart, accessible tools to the dentistry field
                        blending AI precision with practical clinic management.
                    </p>
                    <div id="header-buttons">
                        <PrimaryButton
                            text="Back to the main page"
                            width="267px"
                            height="66px"
                            fontSize="20px"
                            onClick={handleGoingBack}
                        />
                    </div>
                </div>
                <img id="about-image" src={Others.AboutSVG} alt="about" />
            </div>

            <div id="future-container">
                <img
                    id="future-image"
                    src={Others.FuturePlansSVG}
                    alt="future"
                />

                <div>
                    <h1>Future plans</h1>
                    <p>
                        We’re working on adding AI-driven features to enhance
                        diagnostics and workflow even further. Soon, patients
                        will also play an active role—managing their
                        appointments, viewing their profiles, and staying
                        connected with their care.
                    </p>
                    <PrimaryButton
                        text="Back to the main page"
                        width="267px"
                        height="66px"
                        fontSize="20px"
                        onClick={handleGoingBack}
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AboutAndFuture;
