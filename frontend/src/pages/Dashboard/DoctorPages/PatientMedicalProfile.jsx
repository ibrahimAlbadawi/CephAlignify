import React, { useEffect, useState } from "react";
import "./PatientMedicalProfile.css";
import AppointmentCard from "../../Appointments/AppointmentCard";
import { useNavigate, useParams } from "react-router-dom";

import { Avatar, Box, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Clock icon
import { getAvatarIcon } from "../../../utils/getAvatarIcon";
import PrimaryButton from "../../../utils/PrimaryButton";
import useGoBack from "../../../utils/handleGoBack";

import { getPatientById } from "../../../api/patients";
import { getVisitByAppointmentId } from "../../../api/visits";

const PatientMedicalProfile = () => {
    const handleGoBack = useGoBack();
    const navigate = useNavigate();
    const { id } = useParams();
    const [appointments, setAppointments] = useState([]);
    const [patient, setPatient] = useState();
    const [visitSummaries, setVisitSummaries] = useState({});

    const handleCardClick = (appointment) => {
        navigate(`../viewpatientvisit/${appointment.id}`, {
            state: {
                appointment, // passing the whole object
            },
        });
    };

    useEffect(() => {
        getPatientById(id)
            .then((res) => {
                const allAppointments = res.data.appointments;
                const completedAppointments = allAppointments.filter(
                    (appt) => appt.is_completed === true
                );
                setAppointments(completedAppointments);
                setPatient(res.data);

                // Fetch visit summaries for each completed appointment
                completedAppointments.forEach((appt) => {
                    getVisitByAppointmentId(appt.id)
                        .then((res) => {
                            const summary = res.data?.data?.Visit_summary || "";
                            setVisitSummaries((prev) => ({
                                ...prev,
                                [appt.id]: summary,
                            }));
                        })
                        .catch((err) => {
                            console.error(
                                `Failed to fetch visit for appointment ${appt.id}:`,
                                err.response?.data || err
                            );
                        });
                });
            })
            .catch((err) => {
                console.error(
                    "Failed to fetch patient:",
                    err.response?.data || err
                );
            });
    }, [id]);

    return (
        <div id="patient-profile-container">
            <h1 id="patient-profile-header">
                {patient?.Full_name || "Patient"} Medical Profile
            </h1>
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
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "1015px",
                    margin: "0 auto",
                    mt: 7,
                    mb: 2,
                }}
            >
                {/* Left: Avatar + Info */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                        sx={{
                            bgcolor: "white",
                            width: 56,
                            height: 56,
                            color: "#123454",
                            overflow: "hidden",
                            border: "1px solid #ccc",
                        }}
                    >
                        <img
                            src={getAvatarIcon(
                                patient?.age || null,
                                patient?.Gender || null
                            )}
                            alt="avatar"
                            style={{
                                width: "90%",
                                height: "90%",
                                objectFit: "contain",
                            }}
                        />
                    </Avatar>

                    <Box sx={{ ml: 2 }}>
                        <Typography sx={{ fontSize: "20px", fontWeight: 500 }}>
                            {patient?.Full_name || "Patient"}
                        </Typography>
                        <Typography sx={{ fontSize: "13px", color: "#444" }}>
                            {patient?.age || null} &nbsp;•&nbsp;{" "}
                            {patient?.Gender || null}
                        </Typography>
                    </Box>
                </Box>

                {/* Right: Last Visit */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: "20px", color: "#000" }} />
                    <Typography
                        sx={{
                            fontSize: "14px",
                            color: "#000",
                            fontWeight: 800,
                        }}
                    >
                        Last visit:{" "}
                        {patient?.last_visit
                            ? new Date(patient.last_visit).toLocaleDateString(
                                  "en-GB"
                              )
                            : "No visits yet"}
                    </Typography>
                </Box>
            </Box>
            <div id="patient-appointments-cards">
                {appointments && appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                        <div
                            key={index}
                            // use id to navigate to specific patient medical profile
                            onClick={() => handleCardClick(appointment)}
                            style={{ cursor: "pointer" }}
                        >
                            <AppointmentCard
                                key={appointment.id}
                                caseSummary={appointment.Patient_case}
                                calledFrom="patient"
                                date={appointment.DateAndTime}
                                visitSummary={visitSummaries[appointment.id]}
                                // onCheckClick={() =>
                                //     handleCheckClick(patient.patientName)
                                // }
                            />
                        </div>
                    ))
                ) : (
                    <p
                        style={{
                            textAlign: "center",
                            marginTop: "20px",
                            color: "#888",
                        }}
                    >
                        No appointments are available for this patient.
                    </p>
                )}
            </div>
        </div>
    );
};

export default PatientMedicalProfile;
