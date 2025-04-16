import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import Footer from "../Landing/sections/Footer";

import { Logos } from "../../utils/constants";

import "./ResetPassword.css";
import PrimaryButton from "../../utils/PrimaryButton";

import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [sent, setSent] = useState(false);
    const navigate = useNavigate()

    const handleSend = () => {
        setSent(!sent);
    };

    // you can change the route to /newpassword to see the page since
    // the user cannot access it unless a link was provided to him
    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <>
            {sent == false ? (
                <div id="reset-password-container">
                    <RouterLink to="/">
                        <img
                            id="login-logo"
                            src={Logos.CephAliginfySideColored}
                            alt="CephAlignify"
                        />
                    </RouterLink>

                    <h2 id="reset-header">Reset Password</h2>
                    <h4 id="reset-description">
                        Please enter your email address and we will send you
                        instructions on how to reset your password
                    </h4>

                    <div id="reset-password-input">
                        <label htmlFor="loginEmail" id="loginEmailLabel">
                            Email address
                        </label>
                        <input
                            type="email"
                            id="resetEmail"
                            maxLength="254"
                            placeholder="Enter your email"
                            autoComplete="off"
                        />
                    </div>
                    <PrimaryButton
                        text="Send"
                        width="400px"
                        onClick={handleSend}
                    />
                </div>
            ) : (
                <div id="reset-password-container">
                    <RouterLink to="/">
                        <img
                            id="login-logo"
                            src={Logos.CephAliginfySideColored}
                            alt="CephAlignify"
                        />
                    </RouterLink>

                    <h2 id="reset-header">Check Your Email</h2>
                    <h4 id="reset-description">
                        We've sent a password reset link to your email. Please
                        check your inbox (and spam folder) and follow the
                        instructions to reset your password.
                    </h4>

                    <PrimaryButton
                        text="Back to log in"
                        width="400px"
                        onClick={handleLogin}
                    />
                </div>
            )}
            <Footer />
        </>
    );
};

export default ResetPassword;
