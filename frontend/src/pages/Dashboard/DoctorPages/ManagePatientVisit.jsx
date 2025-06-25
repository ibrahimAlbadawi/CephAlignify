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

import { createVisit } from "../../../api/visits";
import { useNotification } from "../../../hooks/useNotification";


const ManagePatientVisit = () => {
    const handleGoBack = useGoBack();
    const navigate = useNavigate();
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
    });

    const location = useLocation();
    const callType = location.state?.callType || "default"; // fallback to default if not provided
    const appointment = location.state?.appointment; // the details of the appointment passed to the matching visit

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

    const handleStartAnalysis = () => {};

    useEffect(() => {}, []);

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
        const formData = new FormData();
        formData.append("file", file);

        // 🔁 Send to backend
        fetch("http://your-backend.com/api/upload", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Upload success:", data);
            })
            .catch((err) => {
                console.error("Upload failed:", err);
            });
    };

    //
    //---------------------------------------------------
    //
    return (
        <>
            {callType === "fromAgenda" ? ( // add a new visit
                <div id="patient-visit-container">
                    <h1 id="patient-profile-header">Add a new visit for {appointment.patient_name}</h1>
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
                                    {appointment.patient_age} &nbsp;•&nbsp; {appointment.patient_gender}
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
                                        <AutoAwesomeIcon />
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
                                        <AutoAwesomeIcon />
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
                                        <AutoAwesomeIcon />
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
            ) : (
                // edit an existing visit
                <div id="patient-visit-container">
                    <h1 id="patient-profile-header">Edit ${appointment.patient_name} visit</h1>
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
                                    {appointment.patient_mame}
                                </Typography>
                                <Typography
                                    sx={{ fontSize: "13px", color: "#444" }}
                                >
                                    {appointment.patient_age} &nbsp;•&nbsp; {appointment.patient_gender}
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
                                        <AutoAwesomeIcon />
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
                                        <AutoAwesomeIcon />
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
                                        <AutoAwesomeIcon />
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
