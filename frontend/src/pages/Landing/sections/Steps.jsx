import React from "react";

import { Card, CardContent, Typography, CardMedia } from "@mui/material";

import PrimaryButton from "../../../utils/PrimaryButton.jsx";

import { Others } from "../../../utils/constants.jsx";

import "./Steps.css";

import { useNavigate } from "react-router-dom";

const steps = [
    {
        description:
            "Drag and drop your cephalometric X-ray and enter basic patient details.",
        image: Others.DragAndDropSVG, //I don' know why SVG version doesn't work
    },
    {
        description:
            "Our AI instantly detects anatomical landmarks and generates accurate measurements.",
        image: Others.AiStarsSVG,
    },
    {
        description:
            "View analysis results, schedule follow-ups, and manage patient records all in one place.",
        image: Others.ManageSVG,
    },
];

const Steps = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <div id="steps-container">
            <h2>As easy as 1, 2, 3 !</h2>

            <div id="steps">
                {steps.map((item) => (
                    <Card
                        id="steps-card"
                        sx={{
                            maxWidth: 229,
                            height: 283,
                            mx: "auto",
                            my: 2,
                            p: 2,
                            color: "text.primary",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                        }}
                    >
                        <CardMedia
                            component="img"
                            image={item.image}
                            sx={{
                                borderRadius: 2,
                                height: 126, // Smaller height
                                width: 126, // Optional: set width too
                                objectFit: "contain", // Keeps image aspect ratio without cropping
                            }}
                        />
                        <div id="steps-text">
                            <CardContent>
                                <Typography id="steps-description">
                                    {item.description}
                                </Typography>
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>
            <PrimaryButton text="Give it a try!" onClick={handleLogin} />
        </div>
    );
};

export default Steps;
