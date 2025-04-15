// import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import "./App.css";
import LandingPage from "./pages/Landing/LandingPage";
import ScrollWrapper from "./utils/ScrollWrapper";

import Login from "./pages/auth/Login";
import AboutAndFuture from "./pages/Landing/sections/AboutAndFuture";
import NotFound from "./utils/NotFound";

function App() {
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
        </Routes>
    );
}

export default App;
