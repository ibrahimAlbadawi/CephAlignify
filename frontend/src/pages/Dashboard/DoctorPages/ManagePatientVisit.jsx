import React, { useEffect, useState, useRef } from "react";
import "./PatientMedicalProfile.css";
import AppointmentCard from "../../Appointments/AppointmentCard";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { Avatar, Box, Stack, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { getAvatarIcon } from "../../../utils/getAvatarIcon";
import PrimaryButton from "../../../utils/PrimaryButton";
import useGoBack from "../../../utils/handleGoBack";
import CustomInput from "../../../utils/CustomInput";

import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import NotesIcon from "@mui/icons-material/Notes";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { createVisit, editVisit } from "../../../api/visits";
import { getVisitByAppointmentId } from "../../../api/visits";
import { useNotification } from "../../../hooks/useNotification";

import { callDeepSeekRefinement } from "../../../api/deepseekrefinerapi";
import {
    startAnalysis,
    triggerDeepSeekDiagnosis,
    updateAnalysis,
} from "../../../api/analysis";

const ManagePatientVisit = () => {
    const handleGoBack = useGoBack();
    const navigate = useNavigate();
    // const hasRunRef = useRef(false);
    const { appointmentId } = useParams();
    const showNotification = useNotification();
    const [diagnosisCheck, setDiagnosisCheck] = useState(false);
    const [isHovered, setIsHovered] = useState(false); //just to add a hover effect to the drag and drop box hahaha
    const [fileName, setFileName] = useState(null); // to hold file name
    const [visitData, setVisitData] = useState({
        Visit_summary: "",
        Prescriptions: "",
        Additional_notes: "",
        Analysis_type: "",
        image: null,
        diagnosisCheck: null,
    });
    const [existingVisitData, setExistingVisitData] = useState({
        Visit_summary: "",
        Prescriptions: "",
        Additional_notes: "",
        Analysis_type: "",
        image: null,
        diagnosisCheck: null,
    });
    const [visitId, setVisitId] = useState(null);

    const location = useLocation();
    const callType = location.state?.callType || "default"; // fallback to default if not provided
    const appointment = location.state?.appointment; // the details of the appointment passed to the matching visit
    // console.log(appointment)
    const handleSaveVisit = async () => {
        try {
            const formData = new FormData();
            formData.append("Visit_summary", visitData.Visit_summary);
            formData.append("Prescriptions", visitData.Prescriptions);
            formData.append("Additional_notes", visitData.Additional_notes);
            formData.append("enable_ai_diagnosis", diagnosisCheck);
            formData.append("analysis_type", visitData.Analysis_type); // optional, if your backend supports it

            if (visitData.image) {
                formData.append("image", visitData.image);
            }

            const res = await createVisit(appointmentId, formData);
            const patientId =
                res.data?.data?.appointment?.patient ||
                res.data?.data?.patient_id;

            showNotification({
                text: "Visit saved successfully",
                type: "success",
            });

            if (patientId) {
                navigate(`/doctordashboard/patientprofile/${patientId}`);
            } else {
                navigate("/doctordashboard/allpatients");
            }
        } catch (err) {
            let errorMessage = "Failed to save visit.";
            if (
                err.response?.data?.errors &&
                typeof err.response.data.errors === "object"
            ) {
                const errorData = err.response.data.errors;
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
        }
    };

    const handleDeepSeekRefiner = async (text, type) => {
        try {
            const result = await callDeepSeekRefinement(text, type);

            // Update the correct field based on `type`
            let fieldKey = null;

            switch (type) {
                case "Visit Summary":
                    fieldKey = "Visit_summary";
                    break;
                case "Prescriptions":
                    fieldKey = "Prescriptions";
                    break;
                case "Additional Notes":
                    fieldKey = "Additional_notes";
                    break;
                default:
                    console.warn("Unknown refinement type:", type);
                    return;
            }

            setVisitData((prev) => ({
                ...prev,
                [fieldKey]: result,
            }));
            setExistingVisitData((prev) => ({
                ...prev,
                [fieldKey]: result,
            }));

            showNotification({
                text: `${type} refined successfully`,
                type: "success",
            });
        } catch (error) {
            console.error("DeepSeek refinement failed:", error);
            showNotification({
                text: `Failed to refine ${type}`,
                type: "error",
            });
        }
    };

    // useEffect(() => {
    //     if (hasRunRef.current) return;
    //     hasRunRef.current = true;

    //     const testDeepSeek = async () => {
    //         const result = await callDeepSeekRefinement(
    //             "patient says they’ve had a throbbing pain in the upper right molars for the past 3 days. especially bad at night. took paracetamol but didn’t help. no visible swelling. I think it might be pulpitis.",
    //             "Visit Summary"
    //         );
    //         // console.log(result);
    //     };

    //     testDeepSeek();
    // }, []);

    const handleSaveEditedVisit = async () => {
        try {
            const formData = new FormData();
            formData.append("Visit_summary", existingVisitData.Visit_summary);
            formData.append("Prescriptions", existingVisitData.Prescriptions);
            formData.append(
                "Additional_notes",
                existingVisitData.Additional_notes
            );
            formData.append(
                "enable_ai_diagnosis",
                existingVisitData.diagnosisCheck
            );
            formData.append("analysis_type", existingVisitData.Analysis_type);

            if (visitData.image) {
                formData.append("image", visitData.image);
            }

            const res = await editVisit(appointmentId, formData); // ✅ call the edit API
            const patientId =
                res.data?.data?.appointment?.patient ||
                res.data?.data?.patient_id;

            showNotification({
                text: "Visit updated successfully",
                type: "success",
            });

            if (patientId) {
                navigate(`/doctordashboard/patientprofile/${patientId}`);
            } else {
                navigate("/doctordashboard/allpatients");
            }
        } catch (err) {
            let errorMessage = "Failed to update visit.";
            if (
                err.response?.data?.errors &&
                typeof err.response.data.errors === "object"
            ) {
                const errorData = err.response.data.errors;
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
        }
    };

    //this ueseffect displays the patient visit in the edit visit page
    useEffect(() => {
        getVisitByAppointmentId(appointment.id)
            .then((res) => {
                // console.log(res.data.data);
                setExistingVisitData(res.data.data);
                setVisitId(res.data.data.id); // store visit id
            })
            .catch((err) => {
                console.error(
                    "Failed to fetch patient:",
                    err.response?.data || err
                );
            });
    }, []);

    const handleAnalysisTypeChange = (e) => {
        setVisitData((prev) => ({
            ...prev,
            Analysis_type: e.target.value,
        }));
    };

    const handleStartAnalysis = async () => {
        try {
            console.log("handleStartAnalysis called");

            console.log("visitData.image:", visitData.image);
            console.log("existingVisitData.image:", existingVisitData.image);

            if (!visitData.image && !existingVisitData.image) {
                console.log(
                    "No image found in either visitData or existingVisitData"
                );
                showNotification({
                    text: "Please upload an X-ray image before starting the analysis.",
                    type: "error",
                });
                return;
            }

            const analysisType =
                visitData.Analysis_type || existingVisitData.Analysis_type;
            console.log("analysisType:", analysisType);

            if (!analysisType) {
                console.log("No analysis type found");
                showNotification({
                    text: "Please select an analysis type.",
                    type: "error",
                });
                return;
            }

            console.log("visitId:", visitId);

            if (!visitId) {
                console.log("No visit ID found");
                showNotification({
                    text: "Visit ID not found. Please save and reload the visit.",
                    type: "error",
                });
                return;
            }

            showNotification({
                text: "Analysis in progress...",
                type: "info",
            });

            console.log("sending to startAnalysis with:", {
                visitId,
                image: visitData.image || existingVisitData.image,
                analysisType,
                diagnosisCheck,
            });

            const response = await startAnalysis(
                visitId,
                visitData.image || existingVisitData.image,
                analysisType,
                diagnosisCheck
            );

            console.log("Analysis response received:", response.data);

            showNotification({
                text: "Analysis completed successfully!",
                type: "success",
            });

            navigate(
                `/doctordashboard/patientprofile/${appointment.patient}`
            );
        } catch (error) {
            console.error("handleStartAnalysis error:", error);
            showNotification({
                text: "Analysis failed. Please try again.",
                type: "error",
            });
        }
    };

    //useEffect(() => {}, []);

    //
    //---------------------------------------------
    // this is the part where it will handle the drag and drop | select a ceph image and send it to backend
    //---------------------------------------------
    //
    const fileInputRef = useRef();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && isImage(file)) {
            setFileName(file.name);
            uploadFile(file);
        } else {
            alert("Please upload a valid image (jpg, jpeg, png).");
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && isImage(file)) {
            setFileName(file.name);
            uploadFile(file);
        } else {
            alert("Please upload a valid image (jpg, jpeg, png).");
        }
    };

    const isImage = (file) => {
        const validTypes = ["image/jpeg", "image/jpg", "image/png"];
        return validTypes.includes(file.type);
    };

    const handleDragOver = (event) => {
        event.preventDefault(); // necessary to allow dropping
    };

    const handleClickUpload = () => {
        fileInputRef.current.click();
    };

    const uploadFile = (file) => {
        setVisitData((prev) => ({
            ...prev,
            image: file,
        }));
        showNotification({
            text: "X-ray image selected",
            type: "info",
        });
    };
    //
    //---------------------------------------------------
    //

    const handleStartAnalysisNewVisit = () => {
        showNotification({
            text: "Please save the visit first, then you can run the cephalometric analysis in edit mode.",
            type: "info",
        });
    };

    return (
        <>
            {callType === "fromAgenda" ? ( // add a new visit
                <div id="patient-visit-container">
                    <h1 id="patient-profile-header">
                        Add a new visit for {appointment.patient_name}
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

                        <PrimaryButton
                            text="Save"
                            width="101px"
                            height="30px"
                            fontSize="14px"
                            onClick={handleSaveVisit}
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
                                        appointment.patient_age,
                                        appointment.patient_gender
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
                                <Typography
                                    sx={{ fontSize: "20px", fontWeight: 500 }}
                                >
                                    {appointment.patient_name}
                                </Typography>
                                <Typography
                                    sx={{ fontSize: "13px", color: "#444" }}
                                >
                                    {appointment.patient_age} &nbsp;•&nbsp;{" "}
                                    {appointment.patient_gender}
                                </Typography>
                            </Box>
                        </Box>

                        <div
                            style={{
                                width: "466px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <h1
                                style={{
                                    marginBottom: "0px",
                                    marginTop: "0px",
                                    color: "var(--primary-color)",
                                }}
                            >
                                Cephalometric Analysis
                            </h1>
                            <h4 style={{ margin: "0px", fontWeight: 400 }}>
                                Click to upload or drag & drop a right-facing
                                lateral
                            </h4>
                        </div>
                    </Box>
                    <div id="patient-visit-details-container">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "1260px",
                            }}
                        >
                            <div id="patient-visit-details">
                                {/* Visit summary */}
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
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "6px",
                                            }}
                                        >
                                            {
                                                <AssignmentIcon fontSize="small" />
                                            }
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    marginLeft: "8px",
                                                }}
                                            >
                                                Write Visit Summary:
                                            </span>
                                        </div>
                                        <div
                                            onClick={() =>
                                                handleDeepSeekRefiner(
                                                    visitData.Visit_summary,
                                                    "Visit Summary"
                                                )
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            <AutoAwesomeIcon />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            maxHeight: "100px",
                                            maxWidth: "374px",
                                            fontSize: "14px",
                                            lineHeight: "1.5",
                                            position: "relative",
                                        }}
                                    >
                                        <CustomInput
                                            type="textarea"
                                            width="350px"
                                            height="77px"
                                            name="Visit_summary"
                                            value={visitData.Visit_summary}
                                            onChange={(e) =>
                                                setVisitData((prev) => ({
                                                    ...prev,
                                                    Visit_summary:
                                                        e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <span style={{ fontSize: "10px" }}>
                                        AI tools are experimental. Always double
                                        check the enhanced version.
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
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "6px",
                                            }}
                                        >
                                            {
                                                <LocalPharmacyIcon fontSize="small" />
                                            }

                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    marginLeft: "8px",
                                                }}
                                            >
                                                Add Prescriptions:
                                            </span>
                                        </div>
                                        <div
                                            onClick={() =>
                                                handleDeepSeekRefiner(
                                                    visitData.Prescriptions,
                                                    "Prescriptions"
                                                )
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            <AutoAwesomeIcon />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            maxHeight: "100px",
                                            maxWidth: "374px",
                                            fontSize: "14px",
                                            lineHeight: "1.5",
                                            position: "relative",
                                        }}
                                    >
                                        <CustomInput
                                            type="textarea"
                                            width="350px"
                                            height="77px"
                                            name="prescriptions"
                                            value={visitData.Prescriptions}
                                            onChange={(e) =>
                                                setVisitData((prev) => ({
                                                    ...prev,
                                                    Prescriptions:
                                                        e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <span style={{ fontSize: "10px" }}>
                                        AI tools are experimental. Always double
                                        check the enhanced version.
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
                                            justifyContent: "space-between",
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
                                                Add Additional Notes:
                                            </span>
                                        </div>
                                        <div
                                            onClick={() =>
                                                handleDeepSeekRefiner(
                                                    visitData.Additional_notes,
                                                    "Additional Notes"
                                                )
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            <AutoAwesomeIcon />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            maxHeight: "100px",
                                            maxWidth: "374px",
                                            fontSize: "14px",
                                            lineHeight: "1.5",
                                            position: "relative",
                                        }}
                                    >
                                        <CustomInput
                                            type="textarea"
                                            width="350px"
                                            height="77px"
                                            name="prescriptions"
                                            value={visitData.Additional_notes}
                                            onChange={(e) =>
                                                setVisitData((prev) => ({
                                                    ...prev,
                                                    Additional_notes:
                                                        e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <span style={{ fontSize: "10px" }}>
                                        AI tools are experimental. Always double
                                        check the enhanced version.
                                    </span>
                                </div>
                            </div>
                            <div
                                style={{
                                    borderRadius: "10px",
                                    // backgroundColor: "#CDDAE3",
                                    width: "345px",
                                    height: "202px",
                                    marginRight: "100px",
                                    // marginTop: '30px',
                                }}
                            >
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={handleClickUpload}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "202px",
                                        backgroundColor: isHovered
                                            ? "#b7c9d6"
                                            : "#CDDAE3",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        marginBottom: "50px",
                                        transition:
                                            "background-color 0.3s ease",
                                    }}
                                >
                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: "15px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        Drag & Drop
                                    </h3>
                                    <h5
                                        style={{
                                            margin: 0,
                                            fontSize: "10px",
                                            fontWeight: "400",
                                        }}
                                    >
                                        or click to upload
                                    </h5>
                                    {fileName && (
                                        <p
                                            style={{
                                                fontSize: "12px",
                                                marginTop: "10px",
                                                color: "#333",
                                            }}
                                        >
                                            Selected:{" "}
                                            <strong>{fileName}</strong>
                                        </p>
                                    )}

                                    {/* Hidden file input */}
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <CustomInput
                                    type="select"
                                    options={[
                                        "Steiner",
                                        "Wits",
                                        "Downs",
                                        "Bjork",
                                        "Tweed",
                                    ]}
                                    placeholder="Analysis type"
                                    name="Analysis_type"
                                    value={visitData.Analysis_type}
                                    onChange={handleAnalysisTypeChange}
                                />
                                <div
                                    style={{
                                        paddingTop: "20px",
                                        paddingBottom: "50px",
                                    }}
                                >
                                    <CustomInput
                                        id="agree"
                                        type="checkbox"
                                        label="Add a cephalometric analysis diagnosis (using AI)"
                                        checked={diagnosisCheck}
                                        onChange={(e) =>
                                            setDiagnosisCheck(e.target.checked)
                                        }
                                    />
                                </div>
                                <PrimaryButton
                                    width="142px"
                                    height="30px"
                                    text="Start analysis"
                                    fontSize="14px"
                                    onClick={handleStartAnalysisNewVisit}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // edit an existing visit
                <div id="patient-visit-container">
                    <h1 id="patient-profile-header">
                        Edit {appointment?.patient_name} visit
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

                        <PrimaryButton
                            text="Save"
                            width="101px"
                            height="30px"
                            fontSize="14px"
                            onClick={handleSaveEditedVisit}
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
                                        appointment?.patient_age,
                                        appointment?.patient_gender
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
                                <Typography
                                    sx={{ fontSize: "20px", fontWeight: 500 }}
                                >
                                    {appointment?.patient_name}
                                </Typography>
                                <Typography
                                    sx={{ fontSize: "13px", color: "#444" }}
                                >
                                    {appointment?.patient_age} &nbsp;•&nbsp;{" "}
                                    {appointment?.patient_gender}
                                </Typography>
                            </Box>
                        </Box>

                        <div
                            style={{
                                width: "466px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <h1
                                style={{
                                    marginBottom: "0px",
                                    marginTop: "0px",
                                    color: "var(--primary-color)",
                                }}
                            >
                                Cephalometric Analysis
                            </h1>
                            <h4 style={{ margin: "0px", fontWeight: 400 }}>
                                Click to upload or drag & drop a right-facing
                                lateral
                            </h4>
                        </div>
                    </Box>
                    <div id="patient-visit-details-container">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "1260px",
                            }}
                        >
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
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "6px",
                                            }}
                                        >
                                            {
                                                <AssignmentIcon fontSize="small" />
                                            }
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    marginLeft: "8px",
                                                }}
                                            >
                                                Write Visit Summary:
                                            </span>
                                        </div>
                                        <div
                                            onClick={() =>
                                                handleDeepSeekRefiner(
                                                    existingVisitData.Visit_summary,
                                                    "Visit Summary"
                                                )
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            <AutoAwesomeIcon />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            maxHeight: "100px",
                                            maxWidth: "374px",
                                            fontSize: "14px",
                                            lineHeight: "1.5",
                                            position: "relative",
                                        }}
                                    >
                                        <CustomInput
                                            type="textarea"
                                            width="350px"
                                            height="77px"
                                            name="Visit_summary"
                                            value={
                                                existingVisitData.Visit_summary
                                            }
                                            onChange={(e) =>
                                                setExistingVisitData(
                                                    (prev) => ({
                                                        ...prev,
                                                        Visit_summary:
                                                            e.target.value,
                                                    })
                                                )
                                            }
                                        />
                                    </div>
                                    <span style={{ fontSize: "10px" }}>
                                        AI tools are experimental. Always double
                                        check the enhanced version.
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
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "6px",
                                            }}
                                        >
                                            {
                                                <LocalPharmacyIcon fontSize="small" />
                                            }

                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    marginLeft: "8px",
                                                }}
                                            >
                                                Add Prescreptions:
                                            </span>
                                        </div>
                                        <div
                                            onClick={() =>
                                                handleDeepSeekRefiner(
                                                    existingVisitData.Prescriptions,
                                                    "Prescriptions"
                                                )
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            <AutoAwesomeIcon />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            maxHeight: "100px",
                                            maxWidth: "374px",
                                            fontSize: "14px",
                                            lineHeight: "1.5",
                                            position: "relative",
                                        }}
                                    >
                                        <CustomInput
                                            type="textarea"
                                            width="350px"
                                            height="77px"
                                            name="Prescriptions"
                                            value={
                                                existingVisitData.Prescriptions
                                            }
                                            onChange={(e) =>
                                                setExistingVisitData(
                                                    (prev) => ({
                                                        ...prev,
                                                        Prescriptions:
                                                            e.target.value,
                                                    })
                                                )
                                            }
                                        />
                                    </div>
                                    <span style={{ fontSize: "10px" }}>
                                        AI tools are experimental. Always double
                                        check the enhanced version.
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
                                            justifyContent: "space-between",
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
                                                Add Additional Notes:
                                            </span>
                                        </div>
                                        <div
                                            onClick={() =>
                                                handleDeepSeekRefiner(
                                                    existingVisitData.Additional_notes,
                                                    "Additional Notes"
                                                )
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            <AutoAwesomeIcon />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            maxHeight: "100px",
                                            maxWidth: "374px",
                                            fontSize: "14px",
                                            lineHeight: "1.5",
                                            position: "relative",
                                        }}
                                    >
                                        <CustomInput
                                            type="textarea"
                                            width="350px"
                                            height="77px"
                                            name="Additional_notes"
                                            value={
                                                existingVisitData.Additional_notes
                                            }
                                            onChange={(e) =>
                                                setExistingVisitData(
                                                    (prev) => ({
                                                        ...prev,
                                                        Additional_notes:
                                                            e.target.value,
                                                    })
                                                )
                                            }
                                        />
                                    </div>
                                    <span style={{ fontSize: "10px" }}>
                                        AI tools are experimental. Always double
                                        check the enhanced version.
                                    </span>
                                </div>
                            </div>
                            <div
                                style={{
                                    borderRadius: "10px",
                                    backgroundColor: "#CDDAE3",
                                    width: "345px",
                                    height: "202px",
                                    marginRight: "100px",
                                    // marginTop: '30px',
                                }}
                            >
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={handleClickUpload}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "202px",
                                        backgroundColor: isHovered
                                            ? "#b7c9d6"
                                            : "#CDDAE3",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        marginBottom: "50px",
                                        transition:
                                            "background-color 0.3s ease",
                                    }}
                                >
                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: "15px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        Drag & Drop
                                    </h3>
                                    <h5
                                        style={{
                                            margin: 0,
                                            fontSize: "10px",
                                            fontWeight: "400",
                                        }}
                                    >
                                        or click to upload
                                    </h5>
                                    {fileName && (
                                        <p
                                            style={{
                                                fontSize: "12px",
                                                marginTop: "10px",
                                                color: "#333",
                                            }}
                                        >
                                            Selected:{" "}
                                            <strong>{fileName}</strong>
                                        </p>
                                    )}

                                    {/* Hidden file input */}
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <CustomInput
                                    type="select"
                                    options={[
                                        "Steiner",
                                        "Wits",
                                        "Downs",
                                        "Bjork",
                                        "Tweed",
                                    ]}
                                    placeholder="Analysis type"
                                    name="Analysis_type"
                                    value={existingVisitData.Analysis_type}
                                    onChange={(e) =>
                                        setExistingVisitData((prev) => ({
                                            ...prev,
                                            Analysis_type: e.target.value,
                                        }))
                                    }
                                />
                                <div
                                    style={{
                                        paddingTop: "20px",
                                        paddingBottom: "50px",
                                    }}
                                >
                                    <CustomInput
                                        id="agree"
                                        type="checkbox"
                                        label="Add a cephalometric analysis diagnosis (using AI)"
                                        checked={diagnosisCheck}
                                        onChange={(e) =>
                                            setDiagnosisCheck(e.target.checked)
                                        }
                                    />
                                </div>
                                <PrimaryButton
                                    width="142px"
                                    height="30px"
                                    text="Start analysis"
                                    fontSize="14px"
                                    onClick={handleStartAnalysis}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManagePatientVisit;
