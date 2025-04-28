import React, { useState, useEffect } from "react";

import "./ManagePatientProfile.css";

import PrimaryButton from "../../utils/PrimaryButton";
import CustomInput from "../../utils/CustomInput";
import useGoBack from "../../utils/handleGoBack";

const Profile = () => {

    const handleGoBack = useGoBack('/manageprofiles/')
    const handleCreateProfile = () => {
        // add a more interactive method of confirming that the task is done
        console.log('created new profile!') 
        handleGoBack()
    }
    return (
        <div id="create-patient-profile-container">
            <h1 id="create-patient-profile-header">Create A New Profile</h1>
                <div className="go-back-button">
                    <PrimaryButton
                        text="Go back"
                        width="101px"
                        height="30px"
                        fontSize="14px"
                        onClick={handleGoBack}
                    />
                </div>
            <div id="create-patient-profile-inputs">
                <div className="create-patient-profile-sections">
                    {/* Main Information */}
                    <div className="profile-section">
                        <h2>Main information</h2>
                        <div className="input-group-container">
                            <label
                                htmlFor="patient-name"
                                className="profile-labels"
                            >
                                Patient Full Name:
                            </label>
                            {/*change the placeholder later to be dynamic*/}
                            <CustomInput
                                id="patient-name"
                                type="text"
                                placeholder="Patient Full Name"
                            />
                            <div className="input-group">
                                <label
                                    htmlFor="patient-phone-number"
                                    className="profile-labels"
                                >
                                    Phone Number:
                                </label>
                                <CustomInput
                                    id="patient-phone-number"
                                    type="text"
                                    placeholder="Enter Phone Number"
                                    note="Make sure it has WhatsApp on it."
                                />
                            </div>
                            <label
                                htmlFor="patient-gender"
                                className="profile-labels"
                            >
                                Gender:
                            </label>
                            <div className="input-row">
                                <CustomInput
                                    id="patient-gender"
                                    type="select"
                                    placeholder="Choose gender"
                                    options={["Male", "Female"]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="profile-section">
                        <h2>Additional information</h2>
                        <div className="input-group-container">
                            <label
                                htmlFor="patient-birthdate"
                                className="profile-labels"
                            >
                                Birthdate:
                            </label>
                            <CustomInput id="patient-birthdate" type="date" />
                            <label
                                htmlFor="patient-email"
                                className="profile-labels"
                            >
                                Email:
                            </label>
                            <CustomInput
                                id="patient-email"
                                type="text"
                                placeholder="Enter email"
                            />
                            <label
                                htmlFor="patient-address"
                                className="profile-labels"
                            >
                                Address:
                            </label>
                            <CustomInput
                                id="patient-address"
                                type="text"
                                placeholder="Enter address"
                            />
                        </div>
                    </div>
                    <div className="create-patient-profile-button-wrapper">
                        <PrimaryButton
                            text="Create New Profile"
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
