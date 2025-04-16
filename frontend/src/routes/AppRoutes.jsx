import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage";
import Login from "../pages/auth/Login";
import AboutAndFuture from "../pages/Landing/sections/AboutAndFuture";
import NotFound from "../utils/NotFound";
import ScrollWrapper from "../utils/ScrollWrapper";
import ResetPassword from "../pages/Auth/ResetPassword";
import NewPassword from '../pages/Auth/NewPassword'

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ScrollWrapper>
                        <LandingPage />
                    </ScrollWrapper>
                }
            />
            <Route
                path="/login"
                element={
                    <ScrollWrapper>
                        <Login />
                    </ScrollWrapper>
                }
            />
            <Route
                path="/about"
                element={
                    <ScrollWrapper>
                        <AboutAndFuture />
                    </ScrollWrapper>
                }
            />
            <Route path="*" element={<NotFound />} />
            <Route
                path="/resetpassword"
                element={
                    <ScrollWrapper>
                        <ResetPassword />
                    </ScrollWrapper>
                }
            />
            <Route
                path="/newpassword"
                element={
                    <ScrollWrapper>
                        <NewPassword />
                    </ScrollWrapper>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
