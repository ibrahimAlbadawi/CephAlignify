import React, { use, useEffect, useState } from "react";
import "./PatientMedicalProfile.css";
import AppointmentCard from "../../Appointments/AppointmentCard";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { Avatar, Box, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Clock icon
import WhatsAppIcon from "@mui/icons-material/WhatsApp"; //WhatsApp icon
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { getAvatarIcon } from "../../../utils/getAvatarIcon";
import PrimaryButton from "../../../utils/PrimaryButton";
import useGoBack from "../../../utils/handleGoBack";

import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import NotesIcon from "@mui/icons-material/Notes";
import SummarizeIcon from "@mui/icons-material/Summarize";

import { getVisitByAppointmentId } from "../../../api/visits";
import { handleWhatsAppClick } from "../../../utils/handleWhatsAppClick ";
import { useUser } from "../../../context/UserProvider";

import "./ViewPatientVisit.css";
import PatientAnalysisReportVisuals from "../../Analysis/PatientAnalysisResultVisuals";

const ViewPatientVisit = () => {
    const [activeTab, setActiveTab] = useState("Tracing");
    const handleGoBack = useGoBack();
    const navigate = useNavigate();
    const [visitData, setVisitData] = useState({});
    const {user} = useUser()

    const handleEditVisit = () => {
        //to static page for now
        navigate(`../editpatientvisit/${appointment.id}`, {
            state: { callType: "fromVisit", appointment }, // or any string identifier you prefer
            
        });
    };

    useEffect(() => {
        getVisitByAppointmentId(appointment.id)
            .then((res) => {
                // console.log(res.data.data);
                setVisitData(res.data.data);
                // console.log(visitData)
            })
            .catch((err) => {
                console.error(
                    "Failed to fetch patient:",
                    err.response?.data || err
                );
            });
    }, []);

    const location = useLocation();
    const appointment = location.state?.appointment; // the details of the appointment passed to the matching visit
    // console.log(appointment)
    return (
        <div id="patient-visit-container">
            <h1 id="patient-profile-header">
                {visitData?.patient_name} Visit On{" "}
                {visitData?.appointment_datetime
                    ? new Date(
                          visitData.appointment_datetime
                      ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                      })
                    : ""}
            </h1>
            <div id="visit-top-buttons">
                <PrimaryButton
                    text="Go back"
                    width="120px"
                    height="30px"
                    fontSize="14px"
                    icon={<ArrowBackIosIcon />}
                    onClick={handleGoBack}
                />
                <div
                    style={{
                        display: "flex",
                        width: "466px",
                        justifyContent: "space-between",
                    }}
                >
                    <PrimaryButton
                        text="Send to patient via WhatsApp"
                        width="261px"
                        height="30px"
                        fontSize="14px"
                        icon={<WhatsAppIcon />}
                        onClick={() => handleWhatsAppClick(appointment.patient_phone, user.full_name)}
                    />
                    <PrimaryButton
                        text="Edit visit"
                        width="101px"
                        height="30px"
                        fontSize="14px"
                        onClick={handleEditVisit}
                    />
                </div>
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
                                visitData.patient_age,
                                visitData.patient_gender
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
                            {visitData.patient_name}
                        </Typography>
                        <Typography sx={{ fontSize: "13px", color: "#444" }}>
                            {visitData.patient_age} &nbsp;•&nbsp;{" "}
                            {visitData.patient_gender}
                        </Typography>
                    </Box>
                </Box>

                <div
                    style={{
                        display: "flex",
                        width: "466px",
                        justifyContent: "space-between",
                    }}
                >
                    {["Tracing", "Report", "PDF"].map((tab) => (
                        <PrimaryButton
                            key={tab}
                            text={tab}
                            width="101px"
                            height="30px"
                            fontSize="14px"
                            onClick={() => setActiveTab(tab)}
                            // custom override just for this case
                            sx={{
                                backgroundColor:
                                    activeTab === tab
                                        ? "#284b63"
                                        : "transparent",
                                boxShadow: "none",
                                color: activeTab === tab ? "#fff" : "#284b63",
                                fontWeight: 600,
                                "&:hover": {
                                    backgroundColor:
                                        activeTab === tab
                                            ? "#284b63"
                                            : "rgba(40, 75, 99, 0.08)",
                                    boxShadow: "none",
                                },
                            }}
                        />
                    ))}
                </div>
            </Box>
            <div id="patient-visit-details-container">
                <div id="patient-visit-split-container">
                    <div id="patient-visit-details">
                        {/* Visit summery */}
                        <div
                            style={{
                                marginBottom: "24px",
                                paddingLeft: "209px",
                                paddingBottom: "30px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "6px",
                                }}
                            >
                                {<AssignmentIcon fontSize="small" />}
                                <span
                                    style={{
                                        fontWeight: "bold",
                                        marginLeft: "8px",
                                    }}
                                >
                                    Visit Summary:
                                </span>
                            </div>
                            <div
                                className="scrollable-with-shadow"
                                style={{
                                    maxHeight: "80px",
                                    maxWidth: "374px",
                                    overflowY: "scroll",
                                    padding: "8px",
                                    fontSize: "14px",
                                    lineHeight: "1.5",
                                    position: "relative",
                                    scrollbarWidth: "none", // Firefox
                                    msOverflowStyle: "none", // IE & Edge
                                }}
                            >
                                {visitData?.Visit_summary || "none"}
                            </div>
                            <span style={{ fontSize: "10px" }}>
                                AI tools are experimental. Always double check
                                the enhanced version.
                            </span>
                        </div>

                        {/* Prescreptions */}
                        <div
                            style={{
                                marginBottom: "24px",
                                paddingLeft: "209px",
                                paddingBottom: "30px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "6px",
                                }}
                            >
                                {<LocalPharmacyIcon fontSize="small" />}
                                <span
                                    style={{
                                        fontWeight: "bold",
                                        marginLeft: "8px",
                                    }}
                                >
                                    Prescriptions:
                                </span>
                            </div>
                            <div
                                className="scrollable-with-shadow"
                                style={{
                                    maxHeight: "80px",
                                    maxWidth: "374px",
                                    overflowY: "scroll",
                                    padding: "8px",
                                    fontSize: "14px",
                                    lineHeight: "1.5",
                                    position: "relative",
                                    scrollbarWidth: "none", // Firefox
                                    msOverflowStyle: "none", // IE & Edge
                                }}
                            >
                                {visitData?.Prescriptions || "none"}
                            </div>
                            <span style={{ fontSize: "10px" }}>
                                AI tools are experimental. Always double check
                                the enhanced version.
                            </span>
                        </div>
                        {/* Additional Notes */}
                        <div
                            style={{
                                marginBottom: "24px",
                                paddingLeft: "209px",
                                paddingBottom: "30px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "6px",
                                }}
                            >
                                {<NotesIcon fontSize="small" />}
                                <span
                                    style={{
                                        fontWeight: "bold",
                                        marginLeft: "8px",
                                    }}
                                >
                                    Additional Notes:
                                </span>
                            </div>
                            <div
                                className="scrollable-with-shadow"
                                style={{
                                    maxHeight: "80px",
                                    maxWidth: "374px",
                                    overflowY: "scroll",
                                    padding: "8px",
                                    fontSize: "14px",
                                    lineHeight: "1.5",
                                    position: "relative",
                                    scrollbarWidth: "none", // Firefox
                                    msOverflowStyle: "none", // IE & Edge
                                }}
                            >
                                {visitData?.Additional_notes || "none"}
                            </div>
                            <span style={{ fontSize: "10px" }}>
                                AI tools are experimental. Always double check
                                the enhanced version.
                            </span>
                        </div>
                    </div>
                    <div id="patient-analysis-report-visuals">
                        <PatientAnalysisReportVisuals type={activeTab} />
                    </div>
                </div>
                <div id="patient-visit-diagnosis">
                    {/* Analysis diagnosis */}
                    <div
                        style={{
                            marginBottom: "24px",
                            paddingLeft: "209px",
                            paddingBottom: "30px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "6px",
                            }}
                        >
                            {<SummarizeIcon fontSize="small" />}
                            <span
                                style={{
                                    fontWeight: "bold",
                                    marginLeft: "8px",
                                }}
                            >
                                Cephalometric analysis diagnosis (using AI):
                            </span>
                        </div>
                        <div
                            className="scrollable-with-shadow"
                            style={{
                                maxHeight: "80px",
                                maxWidth: "1015px",
                                overflowY: "scroll",
                                padding: "8px",
                                fontSize: "14px",
                                lineHeight: "1.5",
                                position: "relative",
                                scrollbarWidth: "none", // Firefox
                                msOverflowStyle: "none", // IE & Edge
                            }}
                        >
                            {visitData?.Analysis_diagnosis || "Analysis diagnosis hasn't been made for this visit."}
                        </div>
                        <span style={{ fontSize: "10px" }}>
                            AI tools are experimental. Always double check the
                            enhanced version.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewPatientVisit;
