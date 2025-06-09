import React, { useState, useEffect } from "react";

import "./ManagePatientPages.css";

import PrimaryButton from "../../../utils/PrimaryButton";
import CustomInput from "../../../utils/CustomInput";
import useGoBack from "../../../utils/handleGoBack";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { createPatient } from "../../../api/patients";

import { useNotification } from "../../../hooks/useNotification";

const CreatePatientProfile = () => {
    const [formData, setFormData] = useState({
        //form data is the json object that will be sent to backend
        Full_name: "",
        Birthdate: "",
        Gender: "",
        Phone_number: "",
        Email: "",
        Address: "",
        clinic: 1,
    });

    const [createdPatient, setCreatedPatient] = useState(null);

    const showNotification = useNotification();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Sending formData:", formData); //check on formData before sending it
        createPatient(formData)
            .then((res) => {
                console.log("Response:", res.data); // backend response
                setCreatedPatient(res.data);
                setFormData({
                    Full_name: "",
                    Birthdate: "",
                    Gender: "",
                    Phone_number: "",
                    Email: "",
                    Address: "",
                    clinic: 1,
                });
                showNotification({
                    text: "A new profile was created successfully",
                    type: "success",
                });
            })
            .catch((err) => {
                console.error("Error creating patient:", err);
                showNotification({
                    text: "Profile couldn't be created",
                    type: "error",
                });
            });
        handleGoBack();
    };

    const handleGoBack = useGoBack("/manageprofiles/");

    return (
        <div id="create-patient-profile-container">
            <h1 id="create-patient-profile-header">Create A New Profile</h1>
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
                                name="Full_name"
                                type="text"
                                placeholder="Patient Full Name"
                                value={formData.Full_name}
                                onChange={handleChange}
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
                                    name="Phone_number"
                                    type="text"
                                    placeholder="Enter Phone Number"
                                    note="Make sure it has WhatsApp on it."
                                    value={formData.Phone_number}
                                    onChange={handleChange}
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
                                    name="Gender"
                                    type="select"
                                    placeholder="Choose gender"
                                    options={["Male", "Female"]} // fix this later
                                    value={formData.Gender}
                                    onChange={handleChange}
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
                            <CustomInput
                                id="patient-birthdate"
                                name="Birthdate"
                                type="date"
                                value={formData.Birthdate}
                                onChange={handleChange}
                            />
                            <label
                                htmlFor="patient-email"
                                className="profile-labels"
                            >
                                Email:
                            </label>
                            <CustomInput
                                id="patient-email"
                                name="Email"
                                type="text"
                                placeholder="Enter email"
                                value={formData.Email}
                                onChange={handleChange}
                            />
                            <label
                                htmlFor="patient-address"
                                className="profile-labels"
                            >
                                Address:
                            </label>
                            <CustomInput
                                id="patient-address"
                                name="Address"
                                type="text"
                                placeholder="Enter address"
                                value={formData.Address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="create-patient-profile-button-wrapper">
                        <PrimaryButton
                            text="Create New Profile"
                            width="675px"
                            height="54px"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePatientProfile;
