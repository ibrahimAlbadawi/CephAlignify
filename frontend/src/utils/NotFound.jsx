import React from "react";
import { useNavigate } from "react-router-dom";

import { Logos } from "./constants.jsx";
import PrimaryButton from "./PrimaryButton.jsx";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <img
                src={Logos.CephAliginfyMainColored}
                alt="CephAlignify Logo"
                style={styles.logo}
            />
            <h1 style={styles.title}>Whoa there, Partner!</h1>
            <p style={styles.subtitle}>
                You’ve either roamed into uncharted territory or stumbled onto a
                page still under construction. Hit that "Go Back" button and get
                back on track!
            </p>
            <PrimaryButton
                text="Go Back"
                width="160px"
                height="44px"
                fontSize="18px"
                onClick={() => navigate(-1)}
            />
        </div>
    );
};

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        textAlign: "center",
        padding: "2rem",
    },
    logo: {
        width: "154px",
        height: "230px",
        marginBottom: "24px",
    },
    title: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "12px",
    },
    subtitle: {
        fontSize: "18px",
        color: "#666",
        marginBottom: "32px",
        width: '350px'
    },
};

export default NotFound;
