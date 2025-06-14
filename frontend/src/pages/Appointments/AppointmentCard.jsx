import React, { useState } from "react";
import {
    Card,
    Avatar,
    Typography,
    Box,
    IconButton,
    Stack,
    Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Import the 3-dots icon

import { Avatars } from "../../utils/constants";

import { useNavigate } from "react-router-dom";

import { getAvatarIcon } from "../../utils/getAvatarIcon";

const AppointmentCard = ({
    appointment, // full object
    patientName,
    age,
    gender,
    caseSummary,
    visitSummary,
    timeSlot,
    onCheckClick, // optional: still supports external callback
    date,
    calledFrom,
}) => {
    const [checked, setChecked] = useState(false);

    const navigate = useNavigate();

    const handleEditPatientAppointment = () => {
        navigate(`editpatientappointment/${appointment.id}`, {
            state: { appointment },
        });
    };

    const handleClick = () => {
        const newChecked = !checked;
        setChecked(newChecked);

        // You can call the parent handler or trigger an API here
        if (onCheckClick) {
            onCheckClick(patientName, newChecked); // pass state up
        }

        // TODO: call your backend update API here if needed
        // e.g. axios.post('/api/update-status', { patientId, checked: newChecked })
    };

    const avatarIcon = getAvatarIcon(age, gender);

    return (
        <>
            {calledFrom === "doctor" && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                        justifyContent: "center",
                    }}
                >
                    {/* Time Label for doctor and date from secretary*/}
                    <Typography
                        sx={{
                            width: "100px",
                            textAlign: "right",
                            fontSize: "15px",
                            fontWeight: 800,
                            color: "#000",
                        }}
                    >
                        {timeSlot}
                    </Typography>

                    {/* Appointment Card */}
                    <Card
                        sx={{
                            borderRadius: 5,
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            width: "832px",
                            height: "50px",
                            backgroundColor: "#CDDAE3",
                            boxShadow: 0,
                            transition: "background-color 0.3s ease",
                            ...(calledFrom !== "secretary" && {
                                //if not called from secretary side then apply effect
                                "&:hover": {
                                    backgroundColor: "#B5C7D8",
                                    cursor: "pointer",
                                },
                            }),
                        }}
                    >
                        {/* Patient Icon */}
                        <Avatar
                            sx={{
                                bgcolor: "white",
                                width: 56,
                                height: 56,
                                color: "#123454",
                                overflow: "hidden",
                            }}
                        >
                            {avatarIcon ? (
                                <img
                                    src={avatarIcon}
                                    alt="Patient avatar"
                                    style={{
                                        width: "90%",
                                        height: "90%",
                                        objectFit: "contain",
                                    }}
                                />
                            ) : (
                                patientName?.charAt(0) || "P"
                            )}
                        </Avatar>

                        {/* Patient Info */}
                        <Box sx={{ flex: 1, ml: 2 }}>
                            <Stack spacing={0.1}>
                                <Typography
                                    sx={{ fontSize: "20px", fontWeight: 500 }}
                                >
                                    {patientName}
                                </Typography>
                                <Typography
                                    sx={{ fontSize: "12px" }}
                                    color="#000"
                                >
                                    {age} • {gender}
                                </Typography>
                            </Stack>
                        </Box>

                        {/* Case Summary */}
                        <Typography
                            sx={{
                                flex: 1,
                                fontSize: "15px",
                                color: "#000",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                mr: 20,
                            }}
                        >
                            {caseSummary}
                        </Typography>

                        {/* Checkmark Toggle */}
                        <Tooltip
                            title={
                                checked
                                    ? "Uncheck if not done"
                                    : "Check if done"
                            }
                            arrow
                        >
                            <IconButton onClick={handleClick} color="success">
                                {checked ? (
                                    <CheckCircleIcon fontSize="large" />
                                ) : (
                                    <RadioButtonUncheckedIcon fontSize="large" />
                                )}
                            </IconButton>
                        </Tooltip>
                    </Card>
                </Box>
            )}
            {calledFrom === "secretary" && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                        justifyContent: "center",
                    }}
                >
                    {/* Time Label */}
                    <Typography
                        sx={{
                            width: "100px",
                            textAlign: "right",
                            fontSize: "15px",
                            fontWeight: 800,
                            color: "#000",
                        }}
                    >
                        {date}
                    </Typography>

                    {/* Appointment Card */}
                    <Card
                        sx={{
                            borderRadius: 5,
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            width: "970px",
                            height: "50px",
                            backgroundColor: "#CDDAE3",
                            boxShadow: 0,
                        }}
                    >
                        {/* Patient Icon */}
                        <Avatar
                            sx={{
                                bgcolor: "white",
                                width: 56,
                                height: 56,
                                color: "#123454",
                                overflow: "hidden",
                            }}
                        >
                            {avatarIcon ? (
                                <img
                                    src={avatarIcon}
                                    alt="Patient avatar"
                                    style={{
                                        width: "90%",
                                        height: "90%",
                                        objectFit: "contain",
                                    }}
                                />
                            ) : (
                                patientName?.charAt(0) || "P"
                            )}
                        </Avatar>

                        {/* Patient Info */}
                        <Box sx={{ flex: 1, ml: 2 }}>
                            <Stack spacing={0.1}>
                                <Typography
                                    sx={{ fontSize: "20px", fontWeight: 500 }}
                                >
                                    {patientName}
                                </Typography>
                                <Typography
                                    sx={{ fontSize: "12px" }}
                                    color="#000"
                                >
                                    {age} • {gender}
                                </Typography>
                            </Stack>
                        </Box>

                        {/* Case Summary */}
                        <Typography
                            sx={{
                                flex: 1,
                                fontSize: "15px",
                                color: "#000",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                mr: 20,
                            }}
                        >
                            {caseSummary}
                        </Typography>

                        {/* Checkmark Toggle: here we have to figure out how to connect it with the doctors
                        so when the doctor has checked it, it will show a check mark here and if not, it will give the
                        secretary the ability to edit the visit */}

                        {/* <IconButton color="success">
                            {checked ? (
                                <CheckCircleIcon fontSize="large" />
                            ) : (
                                <RadioButtonUncheckedIcon fontSize="large" />
                            )}
                        </IconButton> */}
                        <Tooltip title="Edit" arrow>
                            <IconButton
                                size="small"
                                sx={{
                                    // position: "absolute",
                                    // top: 20,
                                    right: 10,
                                }}
                                onClick={handleEditPatientAppointment}
                            >
                                <MoreVertIcon />
                            </IconButton>
                        </Tooltip>
                    </Card>
                </Box>
            )}
            {calledFrom === "patient" && ( // the appointment card here represents a visit but whatever
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                        justifyContent: "center",
                    }}
                >
                    {/* Appointment Card */}
                    <Card
                        sx={{
                            borderRadius: 5,
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            px: 4, // horizontal padding (left & right)
                            width: "970px",
                            height: "50px",
                            backgroundColor: "#CDDAE3",
                            boxShadow: 0,
                            transition: "background-color 0.3s ease",
                            ...(calledFrom !== "secretary" && {
                                //if not called from secretary side then apply effect
                                "&:hover": {
                                    backgroundColor: "#B5C7D8",
                                    cursor: "pointer",
                                },
                            }),
                        }}
                    >
                        {/* Date */}
                        <Typography
                            sx={{
                                fontSize: "15px",
                                fontWeight: 600,
                                color: "#000",
                                width: "150px",
                                textAlign: "center",
                            }}
                        >
                            {new Date(date).toLocaleDateString("en-GB")}{" "}
                            {/* formatted as DD/MM/YYYY */}
                        </Typography>

                        {/* Case Summary */}
                        <Typography
                            sx={{
                                fontSize: "15px",
                                color: "#000",
                                flex: 1,
                                textAlign: "center",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {caseSummary}
                        </Typography>

                        {/* Visit Summary */}
                        <Typography
                            sx={{
                                paddingRight: "20px",
                                fontSize: "15px",
                                color: "#000",
                                width: "250px",
                                textAlign: "left",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {visitSummary}
                        </Typography>
                    </Card>
                </Box>
            )}
        </>
    );
};

export default AppointmentCard;
