import React, { useEffect } from "react";
import "./Login.css";

import { Link as RouterLink } from "react-router-dom";

import { Logos } from "../../utils/constants.jsx";

import PrimaryButton from "../../utils/PrimaryButton.jsx";
import LoginForm from "./LoginForm.jsx";
import Footer from '../../pages/Landing/sections/Footer.jsx'

const Login = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "./script.js"; // relative to index.html
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);
    return (
        <div id="login-container">
            <RouterLink to="/">
                <img
                    id="login-logo"
                    src={Logos.CephAliginfySideColored}
                    alt="CephAlignify"
                />
            </RouterLink>

            <h2 id="login-header">Log in</h2>

            <LoginForm />
            <Footer/>
        </div>
    );
};

export default Login;
