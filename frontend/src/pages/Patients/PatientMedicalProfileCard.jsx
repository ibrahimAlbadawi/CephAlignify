import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    Box,
    IconButton,
    Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Import the 3-dots icon

import { getAvatarIcon } from "../../utils/getAvatarIcon";

const PatientMedicalProfileCard = ({
    patientName,
    age,
    gender,
    lastVisit,
    calledFrom,
}) => {
    const fullGender = gender === "M" ? "Male" : "Female";
    const avatarIcon = getAvatarIcon(age, fullGender);
    return (
        <Card
            sx={{
                width: 180,
                height: 200,
                backgroundColor: "#CDDAE3",
                borderRadius: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
                position: "relative", // Add this so that absolute children are relative to the card
                boxShadow: "none",
                transition: "background-color 0.3s ease",
                "&:hover": {
                    backgroundColor: "#B5C7D8",
                    cursor: "pointer",
                },
            }}
        >
            <Avatar
                src={avatarIcon}
                alt={patientName}
                sx={{
                    width: 56,
                    height: 56,
                    backgroundColor: "#fff",
                    color: "#000",
                    marginTop: 1,
                }}
            />

            <CardContent sx={{ padding: 0, textAlign: "center" }}>
                <Typography sx={{ fontWeight: 500, fontSize: "20px" }}>
                    {patientName}
                </Typography>
                <Typography sx={{ fontSize: "12px" }}>
                    {age} • {fullGender}
                </Typography>
            </CardContent>

            <Typography sx={{ fontSize: 12, textAlign: "center" }}>
                Last visit:{" "}
                {lastVisit == null
                    ? "No visits yet"
                    : new Date(lastVisit).toLocaleDateString("en-GB")}
            </Typography>
        </Card>
    );
};

export default PatientMedicalProfileCard;
