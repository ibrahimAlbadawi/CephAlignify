import React, { useState } from "react";
import {
    Card,
    Avatar,
    Typography,
    Box,
    IconButton,
    Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import { Avatars } from "../../utils/constants";

const AppointmentCard = ({
    patientName,
    age,
    gender,
    caseSummary,
    timeSlot,
    onCheckClick, // optional: still supports external callback
}) => {
    const [checked, setChecked] = useState(false);

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

    const getAvatarIcon = (age, gender) => {
        let group = "";

        if (age <= 10) group = "0to10";
        else if (age <= 20) group = "11to20";
        else if (age <= 30) group = "21to30";
        else if (age <= 60) group = "31to60";
        else group = "60";

        const key = `${gender}${group}SVG`; // e.g. Male21to30SVG
        return Avatars[key] || null;
    };

    const avatarIcon = getAvatarIcon(age, gender);

    return (
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
                        <Typography sx={{ fontSize: "20px" }}>
                            {patientName}
                        </Typography>
                        <Typography sx={{ fontSize: "12px" }} color="#000">
                            Age: {age} • Gender: {gender}
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
                <IconButton onClick={handleClick} color="success">
                    {checked ? (
                        <CheckCircleIcon fontSize="large" />
                    ) : (
                        <RadioButtonUncheckedIcon fontSize="large" />
                    )}
                </IconButton>
            </Card>
        </Box>
    );
};

export default AppointmentCard;
