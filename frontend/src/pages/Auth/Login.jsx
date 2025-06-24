import React, { useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import "./Login.css";
import { Logos } from "../../utils/constants.jsx";

import LoginForm from "./LoginForm.jsx";
import Footer from '../../pages/Landing/sections/Footer.jsx';

const Login = () => {
    const navigate = useNavigate();

    // Function to check if screen is mobile
    const isMobile = () => window.innerWidth <= 768;

    useEffect(() => {
        if (isMobile()) {
            navigate("/mobilemessage");
        }
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
            {/* login form which contains the gorilla animation */}
            <LoginForm />
            <Footer />
        </div>
    );
};

export default Login;
