import React from "react";

import "./Pricing.css";

import PrimaryButton from "../../../utils/PrimaryButton";

import { useNavigate } from "react-router-dom";

const Pricing = () => {
    const navigate = useNavigate();

    const handleContact = () => {
        navigate("/contact");
    };
    return (
        <div id="pricing-container">
            <div id="pricing-render">
                <iframe
                    src="https://my.spline.design/aibrainblack-21471de7088afd69521445ef42054c1c/"
                    frameborder="0"
                    width="100%"
                    height="100%"
                ></iframe>
            </div>
            <div>
                <h1>Fair Pricing, Exceptional Value</h1>
                <p>
                    Unlock the full power of CephAlignify with a simple
                    subscription. Enjoy affordable, flexible pricing while
                    gaining access to advanced tools that elevate your
                    practice—now and into the future.
                </p>
                <div id="pricing-button">
                    <PrimaryButton
                        text="Contact Us"
                        width="187px"
                        height="66px"
                        fontSize="20px"
                        onClick={handleContact}
                    />
                </div>
            </div>
        </div>
    );
};

export default Pricing;
