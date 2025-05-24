import React, { useState, useEffect } from "react";

import "./ManagePatientPages.css";

import PrimaryButton from "../../utils/PrimaryButton";
import CustomInput from "../../utils/CustomInput";
import useGoBack from "../../utils/handleGoBack";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const Profile = () => {
    const handleGoBack = useGoBack("/managevisits/");
    const handleCreateProfile = () => {
        // add a more interactive method of confirming that the task is done
        console.log("created new visit!");
        handleGoBack();
    };
    return (
        <div id="create-patient-profile-container">
            <h1 id="create-patient-profile-header">Create A New Visit</h1>
            <div className="go-back-button">
                <PrimaryButton
                    text="Go back"
                    width="120px"
                    height="30px"
                    fontSize="14px"
                    icon={<ArrowBackIosIcon />}
                    onClick={handleGoBack}
                />
            </div>
            <div id="create-patient-profile-inputs">
                <div className="create-patient-profile-sections">
                    {/* Main Information */}
                    <div className="profile-section">
                        <div className="input-group-container">
                            <label
                                htmlFor="patient-name"
                                className="profile-labels"
                            >
                                Patient name / Phone number:
                            </label>
                            {/*change the placeholder later to be dynamic*/}
                            <CustomInput
                                id="patient-name"
                                type="text"
                                placeholder="Patient Full Name"
                            />
                            <div className="input-group">
                                <label
                                    htmlFor="profile-clinic-hours"
                                    className="profile-labels"
                                >
                                    Date:
                                </label>
                                <CustomInput
                                    id="profile-clinic-hours"
                                    type="date"
                                    placeholder="From"
                                />
                                <label
                                    htmlFor="profile-clinic-hours"
                                    className="profile-labels"
                                >
                                    Time:
                                </label>
                                <CustomInput
                                    id="profile-clinic-hours"
                                    type="time"
                                    placeholder="To"
                                />
                            </div>
                            <label
                                htmlFor="patient-case"
                                className="profile-labels"
                            >
                                Patient case:
                            </label>
                            <div className="input-row">
                                <CustomInput
                                    id="patient-case"
                                    type="select"
                                    placeholder="Choose patient case"
                                    options={[
                                        "Dental cleaning",
                                        "Cavities (tooth decay)",
                                        "Tooth pain",
                                        "Gum disease",
                                        "Braces and orthodontics",
                                        "Tooth extraction",
                                        "Whitening (cosmetic)",
                                        "Dental implants",
                                        "Root canal treatment",
                                        "Retainer check or adjustment",
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="profile-section">
                        <p id="new-visit-note">
                            *Note: you can type the patient name or phone number
                            for faster process.
                        </p>
                    </div>
                    <div className="create-patient-profile-button-wrapper">
                        <PrimaryButton
                            text="Book Visit"
                            width="675px"
                            height="54px"
                            onClick={handleCreateProfile}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
