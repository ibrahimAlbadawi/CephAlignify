import React, { useState } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import {
    Box,
} from "@mui/material";

import ManageProfiles from './SecretaryPages/ManageProfiles'
import ManageVisits from './SecretaryPages/ManageVisits'
import SecretarySidebar from "./Sidebars/SecretarySidebar";

import NotFound from "../../utils/NotFound";

function DoctorDashboard() {
    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar */}
            <SecretarySidebar />

            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="manageprofiles" replace />}
                />
                <Route path="manageprofiles" element={<ManageProfiles />} />
                <Route path="managevisits" element={<ManageVisits />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Box>
    );
}

export default DoctorDashboard;
