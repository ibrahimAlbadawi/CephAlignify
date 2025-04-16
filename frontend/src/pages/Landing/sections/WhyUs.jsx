import React from "react";

import "./WhyUs.css";

import { Card, CardContent, Typography, CardMedia } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import PrimaryButton from "../../../utils/PrimaryButton.jsx";

import { Others } from "../../../utils/constants.jsx";

import { useNavigate } from "react-router-dom";

const features = [
    {
        title: "Smart & Simple",
        description:
            "Manage records, schedule visits, and run AI-based analysis—all in one place.",
        image: Others.LightBulbPNG, //I don' know why SVG version doesn't work
    },
    {
        title: "User Friendly",
        description: "Designed with dentists and assistants in mind.",
        image: Others.UserFriendlySVG,
    },
    {
        title: "Secure & Private",
        description: "All patient data stays encrypted and secure.",
        image: Others.SecureSVG,
    },
];
const WhyUs = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <div id="whyus-container">
            <h2 id="whyus-header">Why us?</h2>
            <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
                spaceBetween={20}
                slidesPerView={1}
            >
                {features.map((item, index) => (
                    <SwiperSlide key={index}>
                        <Card
                            id="why-us-card"
                            sx={{
                                maxWidth: 671,
                                height: 238,
                                mx: "auto",
                                my: 2,
                                p: 2,
                                color: "text.primary",
                                backgroundColor: "transparent",
                                boxShadow: "none",
                            }}
                        >
                            <div id="card-text">
                                <CardContent>
                                    <Typography id="card-title" gutterBottom>
                                        {item.title}
                                    </Typography>
                                    <Typography id="card-description">
                                        {item.description}
                                    </Typography>
                                </CardContent>
                            </div>

                            <CardMedia
                                component="img"
                                height="150"
                                image={item.image}
                                alt={item.title}
                                sx={{
                                    borderRadius: 2,
                                    height: 238, // Smaller height
                                    width: 238, // Optional: set width too
                                    objectFit: "contain", // Keeps image aspect ratio without cropping
                                }}
                            />
                        </Card>
                    </SwiperSlide>
                ))}
            </Swiper>
            <PrimaryButton
                text="Create Account"
                width="187px"
                height="66px"
                onClick={handleLogin}
            />
        </div>
    );
};

export default WhyUs;
