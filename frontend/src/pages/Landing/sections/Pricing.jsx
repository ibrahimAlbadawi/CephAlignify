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
            <iframe
                src="https://my.spline.design/aibrainblack-21471de7088afd69521445ef42054c1c/"
                frameborder="0"
                width="100%"
                height="100%"
            ></iframe>
            <div>
                <h1>Fair Pricing,
                Exceptional Value</h1>
                <p>
                    Pay once and unlock lifetime access to all of CephAlignify’s
                    powerful features. Our pricing is designed to be affordable
                    while providing you with tools that will serve your practice
                    for years to come.
                </p>
                    <PrimaryButton
                        text="Contact Us"
                        width="187px"
                        height="66px"
                        fontSize="20px"
                        onClick={handleContact}
                    />
            </div>
        </div>
    );
};

export default Pricing;
