import React, { useState, useEffect } from "react";

import "./Profile.css";

import PrimaryButton from "../../../utils/PrimaryButton";
import CustomInput from "../../../utils/CustomInput";

import { generateTimeOptions } from "../../../utils/GenerateTimes";
import { useUser } from "../../../context/UserProvider";
const Profile = () => {
    const [headerText, setHeaderText] = useState("");
    const [fadeClass, setFadeClass] = useState("fade-in");

    const {user} = useUser();

    const doctorName = user?.full_name || "Doctor";

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
            setHeaderText(`Profile Settings`);
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
                        <h2>Main information</h2>
                        <div className="input-group-container">
                            <label
                                htmlFor="profile-username"
                                className="profile-labels"
                            >
                                Username:
                            </label>
                            {/*change the placeholder later to be dynamic*/}
                            <CustomInput
                                id="profile-username"
                                type="text"
                                placeholder="Username"
                                disabled={true}
                            />
                            <div className="input-row">
                                <div className="input-group">
                                    <label
                                        htmlFor="profile-first-name"
                                        className="profile-labels"
                                    >
                                        First name:
                                    </label>

                                    <CustomInput
                                        id="profile-first-name"
                                        type="text"
                                        placeholder="Change first name"
                                        width="131px"
                                    />
                                </div>
                                <div className="input-group">
                                    <label
                                        htmlFor="profile-last-name"
                                        className="profile-labels"
                                    >
                                        Last name:
                                    </label>

                                    <CustomInput
                                        id="profile-last-name"
                                        type="text"
                                        placeholder="Change last name"
                                        width="131px"
                                        options={generateTimeOptions()}
                                    />
                                </div>
                            </div>
                            <label
                                htmlFor="profile-email"
                                className="profile-labels"
                            >
                                Email:
                            </label>
                            <CustomInput
                                id="profile-email"
                                type="text"
                                placeholder="Email"
                                disabled={true}
                            />
                            <label
                                htmlFor="profile-clinic-hours"
                                className="profile-labels"
                            >
                                Clinic work hours:
                            </label>
                            <div className="input-row">
                                <CustomInput
                                    id="profile-clinic-hours"
                                    type="select"
                                    placeholder="From"
                                    options={generateTimeOptions()}
                                />

                                <CustomInput
                                    id="profile-clinic-hours"
                                    type="select"
                                    placeholder="To"
                                    options={generateTimeOptions()}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="profile-section">
                        <h2>Additional information</h2>
                        <div className="input-group-container">
                            <label
                                htmlFor="profile-address"
                                className="profile-labels"
                            >
                                Address:
                            </label>
                            <CustomInput
                                id="profile-address"
                                type="text"
                                placeholder="Add address"
                            />
                            <div className="input-row">
                                <div className="input-group">
                                    <label
                                        htmlFor="profile-city"
                                        className="profile-labels"
                                    >
                                        City:
                                    </label>
                                    <CustomInput
                                        id="profile-city"
                                        type="text"
                                        placeholder="Add city"
                                        width="131px"
                                    />
                                </div>
                                <div className="input-group">
                                    <label
                                        htmlFor="profile-country"
                                        className="profile-labels"
                                    >
                                        Country:
                                    </label>

                                    <CustomInput
                                        id="profile-country"
                                        type="text"
                                        placeholder="Add country"
                                        width="131px"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secretary Settings */}
                    <div className="profile-section">
                        <h2>Secretary settings</h2>
                        <div className="input-group-container">
                            <label
                                htmlFor="profile-secretary-username"
                                className="profile-labels"
                            >
                                Secretary username:
                            </label>
                            <CustomInput
                                id="profile-secretary-username"
                                type="text"
                                placeholder="Change username"
                            />
                            <label
                                htmlFor="profile-secretary-email"
                                className="profile-labels"
                            >
                                Secretary email:
                            </label>
                            <CustomInput
                                id="profile-secretary-email"
                                type="text"
                                placeholder="Change email"
                            />
                            <label
                                htmlFor="profile-secretary-password"
                                className="profile-labels"
                            >
                                Secretary password:
                            </label>
                            <CustomInput
                                id="profile-secretary-password"
                                type="password"
                                placeholder="Change password"
                            />
                            <label
                                htmlFor="profile-secretary-password-confirmation"
                                className="profile-labels"
                            >
                                Confirm secretary password:
                            </label>
                            <CustomInput
                                id="profile-secretary-password-confirmation"
                                type="password"
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>
                </div>
            </div>
                <div className="save-button-wrapper">
                    <PrimaryButton text="Save changes" width="470px" />
                </div>{" "}
        </div>
    );
};

export default Profile;
