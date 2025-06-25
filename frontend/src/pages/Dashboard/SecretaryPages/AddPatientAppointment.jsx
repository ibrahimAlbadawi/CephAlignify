import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ManagePatientPages.css";

import PrimaryButton from "../../../utils/PrimaryButton";
import CustomInput from "../../../utils/CustomInput";
import useGoBack from "../../../utils/handleGoBack";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { getPatientById } from "../../../api/patients"; // Adjust import paths
import { createAppointment } from "../../../api/appointments"; // Adjust import paths

import { useNotification } from "../../../hooks/useNotification";

const CreateAppointment = () => {
    const { id } = useParams();
    const handleGoBack = useGoBack("/manageappointments/");
    const [patientName, setPatientName] = useState("");
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        case_summary: "",
    });

    const timeOptions = Array.from({ length: 48 }, (_, i) => {
        const hour = String(Math.floor(i / 2)).padStart(2, "0");
        const minute = i % 2 === 0 ? "00" : "30";
        return `${hour}:${minute}`;
    });

    const showNotification = useNotification();

    // Fetch patient info by ID
    useEffect(() => {
        getPatientById(id)
            .then((res) => {
                setPatientName(res.data.Full_name);
            })
            .catch((err) => {
                console.error(
                    "Error fetching patient:",
                    err.response?.data || err
                );
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateAppointment = () => {
        if (!formData.date || !formData.time || !formData.case_summary) {
            showNotification({
                text: "Please fill out all fields before booking.",
                type: "warning",
            });
            return;
        }

        const patientId = parseInt(id);
        if (!patientId) {
            showNotification({
                text: "Patient ID is missing or invalid.",
                type: "error",
            });
            return;
        }

        const appointmentData = {
            patient: patientId,
            DateAndTime: `${formData.date}T${formData.time}`,
            Patient_case: formData.case_summary,
        };

        console.log("Sending to backend:", appointmentData); // ✅ verify here

        createAppointment(appointmentData)
            .then((res) => {
                showNotification({
                    text: `New appointment for ${patientName} has been created`,
                    type: "success",
                });
                handleGoBack();
            })
            .catch((err) => {
                console.error(
                    "Failed to create appointment:",
                    err.response?.data || err
                );

                const errorData = err.response?.data;

                let message = "Failed to create appointment.";

                if (
                    typeof errorData === "object" &&
                    !Array.isArray(errorData)
                ) {
                    const allMessages = Object.values(errorData)
                        .flat()
                        .join(" | ");
                    message = allMessages || message;
                } else if (errorData?.detail) {
                    message = errorData.detail;
                }

                showNotification({
                    text: message,
                    type: "error",
                });
            });
    };

    return (
        <div id="create-patient-profile-container">
            <h1 id="create-patient-profile-header">Create A New Appointment</h1>

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
                    {/* Main Info */}
                    <div className="profile-section">
                        <div className="input-group-container">
                            <label
                                htmlFor="patient-name"
                                className="profile-labels"
                            >
                                Patient name:
                            </label>
                            <input
                                className="custom-input"
                                type="text"
                                value={patientName}
                                disabled
                            />

                            <div className="input-group">
                                <label
                                    htmlFor="appointment-date"
                                    className="profile-labels"
                                >
                                    Date:
                                </label>
                                <CustomInput
                                    id="appointment-date"
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                />

                                <label
                                    htmlFor="appointment-time"
                                    className="profile-labels"
                                >
                                    Time:
                                </label>
                                <CustomInput
                                    id="appointment-time"
                                    type="select"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    placeholder="Select time"
                                    options={timeOptions}
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
                                    name="case_summary"
                                    value={formData.case_summary}
                                    onChange={handleChange}
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

                    {/* Notes + Submit */}
                    <div className="profile-section">
                        <p id="new-visit-note">
                            *Note: the patient is auto-linked by ID. You cannot
                            change the name.
                        </p>
                    </div>

                    <div className="create-patient-profile-button-wrapper">
                        <PrimaryButton
                            text="Book Visit"
                            width="675px"
                            height="54px"
                            onClick={handleCreateAppointment}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAppointment;
