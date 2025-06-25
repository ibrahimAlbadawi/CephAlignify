import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import PrimaryButton from "../../../utils/PrimaryButton";
import CustomInput from "../../../utils/CustomInput";
import useGoBack from "../../../utils/handleGoBack";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { getPatientById } from "../../../api/patients";
import { editAppointment, cancelAppointment } from "../../../api/appointments";

import { useNotification } from "../../../hooks/useNotification";
import "./ManagePatientPages.css";

const EditAppointment = () => {
    const appointmentId = parseInt(useParams().appointment, 10);
    const navigate = useNavigate();
    const location = useLocation();
    const handleGoBack = useGoBack("/manageappointments/");
    const showNotification = useNotification();

    const appointment = location.state?.appointment;
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

    // Fetch appointment details from route state
    useEffect(() => {
        if (appointment) {
            setFormData({
                date: appointment.DateAndTime?.split("T")[0] || "",
                time: appointment.DateAndTime?.split("T")[1]?.slice(0, 5) || "",
                case_summary: appointment.Patient_case || "",
            });

            // Fetch patient name using appointment.patient ID
            getPatientById(appointment.patient)
                .then((res) => {
                    setPatientName(res.data.Full_name);
                })
                .catch((err) => {
                    console.error(
                        "Error fetching patient:",
                        err.response?.data || err
                    );
                    setPatientName("Unknown Patient");
                });
        }
    }, [appointment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditAppointment = () => {
        if (!formData.date || !formData.time || !formData.case_summary) {
            return showNotification({
                text: "Please fill out all fields.",
                type: "warning",
            });
        }

        const updatedData = {
            patient: appointment.patient,
            DateAndTime: `${formData.date}T${formData.time}`,
            Patient_case: formData.case_summary,
        };

        editAppointment(appointmentId, updatedData)
            .then(() => {
                showNotification({
                    text: `${patientName} Appointment has been updated successfully`,
                    type: "success",
                });
                handleGoBack();
            })
            .catch((err) => {
                console.error("Edit error:", err.response?.data || err);
                const errorData = err.response?.data;
                let message = "Failed to update appointment.";

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

    const handleCancelAppointment = () => {
        if (
            window.confirm("Are you sure you want to cancel this appointment?")
        ) {
            cancelAppointment(appointmentId)
                .then(() => {
                    showNotification({
                        text: `${patientName} appointment has been cancelled`,
                        type: "success",
                    });
                    handleGoBack();
                })
                .catch((err) => {
                    console.error("Cancel error:", err.response?.data || err);
                    showNotification({
                        text:
                            err.response?.data?.detail ||
                            "❌ Failed to cancel.",
                        type: "error",
                    });
                });
        }
    };

    return (
        <div id="create-patient-profile-container">
            <h1 id="create-patient-profile-header">Edit Appointment</h1>

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
                            <label className="profile-labels">
                                Patient name:
                            </label>
                            <input
                                className="custom-input"
                                type="text"
                                value={patientName}
                                disabled
                            />

                            <div className="input-group">
                                <label className="profile-labels">Date:</label>
                                <CustomInput
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                                <label className="profile-labels">Time:</label>
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

                            <label className="profile-labels">
                                Patient case:
                            </label>
                            <div className="input-row">
                                <CustomInput
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

                    {/* Actions */}
                    <div className="profile-section">
                        <p id="new-visit-note">
                            *Note: editing an appointment only changes the date,
                            time, and case. To change the patient, cancel and
                            create a new appointment.
                        </p>
                    </div>

                    <div className="create-patient-profile-button-wrapper">
                        <PrimaryButton
                            text="Update Appointment"
                            width="274px"
                            height="54px"
                            onClick={handleEditAppointment}
                        />
                        <PrimaryButton
                            text="Cancel Appointment"
                            width="274px"
                            height="54px"
                            backgroundColor="#AFAFAF"
                            onClick={handleCancelAppointment}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAppointment;
