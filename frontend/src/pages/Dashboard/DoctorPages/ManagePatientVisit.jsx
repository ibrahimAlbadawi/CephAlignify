import React, { act, useEffect, useState } from "react";
import "./PatientMedicalProfile.css";
import AppointmentCard from "../../Appointments/AppointmentCard";
import { useNavigate } from "react-router-dom";

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

// import { getTodaysVisits } from "../../../api/visits";

// for testing only
import patients from "../../Appointments/dummyPatients.json";

import "./ViewPatientVisit.css";
import PatientAnalysisReportVisuals from '../../Analysis/PatientAnalysisResultVisuals';

const ManagePatientVisit = () => {
    const [activeTab, setActiveTab] = useState("Tracing");
    const handleGoBack = useGoBack();
    const navigate = useNavigate();

    const handleEditAppointment = (id) => {
        //to static page for now
        navigate(`/doctordashboard/editappointment`);
    };

    const patient = patients[3]; //this is temporary static info
    useEffect(() => {}, []);



    //
    //
    //
    //
    //THIS PAGE WILL BE RENDERED ACCORDING TO WHERE IT IS CALLED FROM
    //EDIT A VISIT (WHEN "Edit visit" BUTTON IS CLICKED) OR ADD A NEW VISIT (WHEN AN APPOINTMENT CARD IS CLICKED FROM "Today's Agenda")
    //
    //
    //


    return (
        <div id="patient-visit-container">
            <h1 id="patient-profile-header">
                Add A New Visit
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
                        // onClick={}  redirect to WhatsApp api with the specific patient phone number
                    />
                    <PrimaryButton
                        text="Edit visit"
                        width="101px"
                        height="30px"
                        fontSize="14px"
                        onClick={handleEditAppointment}
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
                                Lorem ipsum dolor sit amet consectetur
                                adipiscing elit Ut et massa mi. Aliquam in
                                hendrerit urna. Pellentesque sit amet sapien
                                fringilla, mattis ligula Lorem ipsum dolor sit
                                amet consectetur adipiscing elit Ut et massa mi.
                                Aliquam in hendrerit urna. Pellentesque sit amet
                                sapien fringilla, mattis ligula Lorem ipsum
                                dolor sit amet consectetur adipiscing elit Ut et
                                massa mi. Aliquam in hendrerit urna.
                                Pellentesque sit amet sapien fringilla, mattis
                                ligula Lorem ipsum dolor sit amet consectetur
                                adipiscing elit Ut et massa mi. Aliquam in
                                hendrerit urna. Pellentesque sit amet sapien
                                fringilla, mattis ligula
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
                                    Prescreptions:
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
                                Lorem ipsum dolor sit amet consectetur
                                adipiscing elit Ut et massa mi. Aliquam in
                                hendrerit urna. Pellentesque sit amet sapien
                                fringilla, mattis ligula Lorem ipsum dolor sit
                                amet consectetur adipiscing elit Ut et massa mi.
                                Aliquam in hendrerit urna. Pellentesque sit amet
                                sapien fringilla, mattis ligula Lorem ipsum
                                dolor sit amet consectetur adipiscing elit Ut et
                                massa mi. Aliquam in hendrerit urna.
                                Pellentesque sit amet sapien fringilla, mattis
                                ligula Lorem ipsum dolor sit amet consectetur
                                adipiscing elit Ut et massa mi. Aliquam in
                                hendrerit urna. Pellentesque sit amet sapien
                                fringilla, mattis ligula
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
                                Lorem ipsum dolor sit amet consectetur
                                adipiscing elit Ut et massa mi. Aliquam in
                                hendrerit urna. Pellentesque sit amet sapien
                                fringilla, mattis ligula Lorem ipsum dolor sit
                                amet consectetur adipiscing elit Ut et massa mi.
                                Aliquam in hendrerit urna. Pellentesque sit amet
                                sapien fringilla, mattis ligula Lorem ipsum
                                dolor sit amet consectetur adipiscing elit Ut et
                                massa mi. Aliquam in hendrerit urna.
                                Pellentesque sit amet sapien fringilla, mattis
                                ligula Lorem ipsum dolor sit amet consectetur
                                adipiscing elit Ut et massa mi. Aliquam in
                                hendrerit urna. Pellentesque sit amet sapien
                                fringilla, mattis ligula
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
                            Lorem ipsum dolor sit amet consectetur adipiscing
                            elit Ut et massa mi. Aliquam in hendrerit urna.
                            Pellentesque sit amet sapien fringilla, mattis
                            ligula Lorem ipsum dolor sit amet consectetur
                            adipiscing elit Ut et massa mi. Aliquam in hendrerit
                            urna. Pellentesque sit amet sapien fringilla, mattis
                            ligula Lorem ipsum dolor sit amet consectetur
                            adipiscing elit Ut et massa mi. Aliquam in hendrerit
                            urna. Pellentesque sit amet sapien fringilla, mattis
                            ligula Lorem ipsum dolor sit amet consectetur
                            adipiscing elit Ut et massa mi. Aliquam in hendrerit
                            urna. Pellentesque sit amet sapien fringilla, mattis
                            ligula
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

export default ManagePatientVisit;
