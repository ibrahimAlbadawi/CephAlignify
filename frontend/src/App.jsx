// import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import "./App.css";
import LandingPage from "./pages/Landing/LandingPage";
import Login from "./pages/auth/Login";
import ScrollWrapper from "./utils/ScrollWrapper";

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
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default App;
