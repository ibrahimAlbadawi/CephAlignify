import React, { useState, useEffect } from "react";

import "./ManagePatientPages.css";

import PrimaryButton from "../../../utils/PrimaryButton";
import CustomInput from "../../../utils/CustomInput";
import useGoBack from "../../../utils/handleGoBack";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { editPatient } from "../../../api/patients";
import { getPatientById } from "../../../api/patients";
import { useNotification } from "../../../hooks/useNotification";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useUser } from "../../../context/UserProvider";

const EditPatientProfile = () => {
    const handleGoBack = useGoBack("/manageprofiles/");
    const [patient, setPatient] = useState(null);
    // const {user} = useUser

    const location = useLocation();
    const navigate = useNavigate();
    const showNotification = useNotification();

    const { id } = useParams();

    const [formData, setFormData] = useState({
        Full_name: "",
        Phone_number: "",
        Gender: "",
        Birthdate: "",
        Email: "",
        Address: "",
    });

    useEffect(() => {
        getPatientById(id)
            .then((res) => {
                // console.log(res.data); // to make sure appropriate res is being returned
                setPatient(res.data);
            })
            .catch((err) => {
                console.error(
                    "Failed to fetch patient:",
                    err.response?.data || err
                );
            });
    }, [id]);

    useEffect(() => { //populate formData to render the values
        if (patient) {
            setFormData({
                Full_name: patient.Full_name,
                Phone_number: patient.Phone_number,
                Gender: patient.Gender === "M" ? "Male" : "Female",
                Birthdate: patient.Birthdate,
                Email: patient.Email || "",
                Address: patient.Address || "",
                clinic: patient.clinic
            });
        }
    }, [patient]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = () => {
        const genderMap = {
            Male: "M",
            Female: "F",
        };

        const payload = {
            ...formData,
            Gender: genderMap[formData.Gender],
        };
        // console.log("payload", payload)
        editPatient(patient.id, payload)
            .then(() => {
                showNotification({
                    text: `${patient.Full_name} profile has been updated successfully.`,
                    type: "success",
                });
                handleGoBack();
            })
            .catch((err) => {
                let errorMessage = "An error occurred.";
                if (
                    err.response?.data &&
                    typeof err.response.data === "object"
                ) {
                    const errorData = err.response.data;
                    errorMessage = Object.entries(errorData)
                        .map(
                            ([field, msgs]) =>
                                `${field}: ${
                                    Array.isArray(msgs) ? msgs.join(", ") : msgs
                                }`
                        )
                        .join(" | ");
                }
                showNotification({
                    text: errorMessage,
                    type: "error",
                });
            });
    };

    return (
        <div id="create-patient-profile-container">
            <h1 id="create-patient-profile-header">Edit Profile</h1>
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
                                value={formData.Full_name}
                                type="text"
                                placeholder="Patient Full Name"
                                disabled={true}
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
                                    value={formData.Phone_number}
                                    type="text"
                                    placeholder="Enter Phone Number"
                                    note="Make sure it has WhatsApp on it."
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
                                    value={formData.Gender}
                                    type="select"
                                    placeholder="Choose gender"
                                    options={["Male", "Female"]}
                                    disabled={true}
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
                                value={formData.Birthdate}
                                type="date"
                                disabled={true}
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
                                value={formData.Email}
                                type="text"
                                placeholder="Enter email"
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
                                value={formData.Address}
                                type="text"
                                placeholder="Enter address"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="create-patient-profile-button-wrapper">
                        <PrimaryButton
                            text="Save Changes"
                            width="675px"
                            height="54px"
                            onClick={handleSaveChanges}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPatientProfile;
