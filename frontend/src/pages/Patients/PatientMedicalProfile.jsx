import React, { useEffect, useState } from "react";
import "./PatientMedicalProfile.css";
import AppointmentCard from "../Appointments/AppointmentCard";

import { Avatar, Box, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Clock icon
import { getAvatarIcon } from "../../utils/getAvatarIcon";
import PrimaryButton from "../../utils/PrimaryButton";
import useGoBack from "../../utils/handleGoBack";

// import { getTodaysVisits } from "../../../api/visits";

// for testing only
import patients from "../Appointments/dummyPatients.json";

const PatientMedicalProfile = () => {
    const handleGoBack = useGoBack();

    const patient = patients[3]; //this is temporary static info
    useEffect(() => {
        // getTodaysVisits()
        //     .then((res) => {
        //         // Expecting an array of visit objects
        //         setVisits(res.data);
        //     })
        //     .catch((err) => {
        //         console.error("Failed to fetch today's visits:", err);
        //     });
    }, []);

    return (
        <div id="patient-profile-container">
            <h1 id="patient-profile-header">
                {patient.patientName} Medical Profile
            </h1>
            <div className="go-back-button">
                <PrimaryButton
                    text="Go back"
                    width="101px"
                    height="30px"
                    fontSize="14px"
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
                <Box sx={{ display: "flex", alignItems: "center"}}>
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
                            src={getAvatarIcon(patient.age, patient.gender)}
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
                            {patient.patientName}
                        </Typography>
                        <Typography sx={{ fontSize: "13px", color: "#444" }}>
                            {patient.age} &nbsp;•&nbsp; {patient.gender}
                        </Typography>
                    </Box>
                </Box>

                {/* Right: Last Visit */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: "20px", color: "#000" }} />
                    <Typography sx={{ fontSize: "14px", color: "#000", fontWeight:800 }}>
                        Last visit:{" "}
                        {new Date(patient.date).toLocaleDateString("en-GB")}
                    </Typography>
                </Box>
            </Box>
            <div id="patient-appointments-cards">
                {patients.map((patient) => (
                    <AppointmentCard
                        key={patient.id}
                        caseSummary={patient.caseSummary}
                        timeSlot={patient.timeSlot}
                        calledFrom="patient"
                        date={patient.date}
                        visitSummary={patient.visitSummary}
                        // onCheckClick={() =>
                        //     handleCheckClick(patient.patientName)
                        // }
                    />
                ))}
            </div>
        </div>
    );
};

export default PatientMedicalProfile;
