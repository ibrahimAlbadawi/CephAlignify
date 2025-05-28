import React, { useState } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import { Box } from "@mui/material";

import DoctorSidebar from "./Sidebars/DoctorSidebar";

import TodaysAgenda from "./DoctorPages/TodaysAgenda";
import AllPatients from "./DoctorPages/AllPatients";
import ThreeDSkull from "./DoctorPages/ThreeDSkull";
import Profile from "./DoctorPages/Profile";

import NotFound from "../../utils/NotFound";

import PatientMedicalProfile from './DoctorPages/PatientMedicalProfile'

import ViewPatientVisit from "./DoctorPages/ViewPatientVisit";
import ManagePatientVisit from './DoctorPages/ManagePatientVisit';

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
                <Route path="allpatients" element={<AllPatients />} />

                {/*use later when actual data is being fetched via id */}
                {/* <Route path="patientprofile/:id" element={<PatientMedicalProfile />} /> */}
                <Route
                    path="patientprofile/"
                    element={<PatientMedicalProfile />}
                />
                <Route
                    path="viewpatientvisit/"
                    element={<ViewPatientVisit />}
                />
                <Route
                    path="editpatientvisit/"
                    element={<ManagePatientVisit />}
                />
                <Route
                    path="newpatientvisit/"
                    element={<ManagePatientVisit />}
                />
                <Route path="skull" element={<ThreeDSkull />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Box>
    );
}

export default DoctorDashboard;
