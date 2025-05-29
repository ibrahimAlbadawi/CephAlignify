import React, { useState } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import { Box } from "@mui/material";

import ManageProfiles from "./SecretaryPages/ManageProfiles";

import SecretarySidebar from "./Sidebars/SecretarySidebar";

import ManageAppointments from "./SecretaryPages/ManageAppointments";
import AddPatientAppointment from './SecretaryPages/AddPatientAppointment';
import EditPatientAppointment from './SecretaryPages/EditPatientAppointment';

import CreatePatientProfile from './SecretaryPages/CreatePatientProfile'
import EditPatientProfile from './SecretaryPages/EditPatientProfile'

import NotFound from "../../utils/NotFound";

function SecretaryDashboard() {
    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar */}
            <SecretarySidebar />

            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="manageprofiles" replace />}
                />
                <Route path="/manageprofiles" element={<ManageProfiles />} />
                <Route
                    path="/manageappointments"
                    element={<ManageAppointments />}
                />
                <Route
                    path="/manageprofiles/createpatientprofile"
                    element={<CreatePatientProfile />}
                />
                <Route
                    path="/manageprofiles/editpatientprofile"
                    element={<EditPatientProfile />}
                />
                <Route
                    path="/manageappointments/addpatientappointment"
                    element={<AddPatientAppointment />}
                />
                <Route
                    path="/manageappointments/editpatientappointment"
                    element={<EditPatientAppointment />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Box>
    );
}

export default SecretaryDashboard;
