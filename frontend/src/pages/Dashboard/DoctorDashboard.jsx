import React, { useState } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import {
    Box,
} from "@mui/material";


import DoctorSidebar from "./DoctorSidebar";
import TodaysAgenda from "./DoctorPages/TodaysAgenda";
import AllPatients from "./DoctorPages/AllPatients";
import ThreeDSkull from "./DoctorPages/ThreeDSkull";
import Profile from "./DoctorPages/Profile";

import NotFound from "../../utils/NotFound";

function DoctorDashboard() {
    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar */}
            <DoctorSidebar />

            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="todaysagenda" replace />}
                />
                <Route path="todaysagenda" element={<TodaysAgenda />} />
                <Route path="patients" element={<AllPatients />} />
                <Route path="skull" element={<ThreeDSkull />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Box>
    );
}

export default DoctorDashboard;
