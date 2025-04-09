// import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import "./App.css";
import LandingPage from "./pages/Landing/LandingPage";
import Login from "./pages/auth/Login";

function App() {
    return (
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
            </Routes>
    );
}

export default App;
