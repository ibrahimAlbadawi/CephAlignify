import React, { useState, useEffect } from "react";

import "./Profile.css";

import PrimaryButton from '../../../utils/PrimaryButton'

const Profile = () => {
    const [headerText, setHeaderText] = useState("");
    const [fadeClass, setFadeClass] = useState("fade-in");

    const doctorName = "Dr. John Doe"; //change this later to be dynamic

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        else if (hour < 18) return "Good afternoon";
        else return "Good evening";
    };
    useEffect(() => {
        // Step 1: Show greeting
        setHeaderText(`${getGreeting()}, ${doctorName}`);

        // Step 2: After 2.5s, fade out
        const fadeOutTimeout = setTimeout(() => {
            setFadeClass("fade-out");
        }, 2500);

        // Step 3: After 3.2s, change to Agenda title and fade in
        const changeTextTimeout = setTimeout(() => {
            setHeaderText(`${doctorName} Profile Settings`);
            setFadeClass("fade-in");
        }, 3200);

        return () => {
            clearTimeout(fadeOutTimeout);
            clearTimeout(changeTextTimeout);
        };
    }, []);
    return (
        <div id="doctor-profile-container">
            <h1 id="doctor-profile-header" className={fadeClass}>
                {headerText}
            </h1>
            <div id="doctor-profile-settings">
                <div className="profile-sections">
                    {/* Main Information */}
                    <div className="profile-section">
                        <h2 className="section-title">Main information</h2>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Username"
                                className="input"
                            />
                            <div className="input-row">
                                <input
                                    type="text"
                                    placeholder="Change first name"
                                    className="input"
                                />
                                <input
                                    type="text"
                                    placeholder="Change last name"
                                    className="input"
                                />
                            </div>
                            <input
                                type="email"
                                placeholder="Email"
                                className="input"
                            />
                            <div className="input-row">
                                <input
                                    type="text"
                                    placeholder="From"
                                    className="input"
                                />
                                <input
                                    type="text"
                                    placeholder="To"
                                    className="input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="profile-section">
                        <h2 className="section-title">
                            Additional information
                        </h2>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Add address"
                                className="input"
                            />
                            <div className="input-row">
                                <input
                                    type="text"
                                    placeholder="Add city"
                                    className="input"
                                />
                                <input
                                    type="text"
                                    placeholder="Add country"
                                    className="input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Secretary Settings */}
                    <div className="profile-section">
                        <h2 className="section-title">Secretary settings</h2>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Change username"
                                className="input"
                            />
                            <input
                                type="email"
                                placeholder="Change email"
                                className="input"
                            />
                            <input
                                type="password"
                                placeholder="Change password"
                                className="input"
                            />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                className="input"
                            />
                        </div>
                    </div>
                    <PrimaryButton text='Save changes' width="470px"/>
                </div>
            </div>
        </div>
    );
};

export default Profile;
