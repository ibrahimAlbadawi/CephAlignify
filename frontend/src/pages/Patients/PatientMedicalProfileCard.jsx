import React from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";

import { getAvatarIcon } from "../../utils/getAvatarIcon";

const PatientMedicalProfileCard = ({ patientName, age, gender, lastVisit }) => {
    const avatarIcon = getAvatarIcon(age, gender);

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
                <Typography sx={{ fontSize: '12px' }}>
                    {age} • {gender}
                </Typography>
            </CardContent>

            <Typography
                sx={{ fontSize: 12, textAlign: "center" }}
            >
                Last visit: {lastVisit}
            </Typography>
        </Card>
    );
};

export default PatientMedicalProfileCard;
