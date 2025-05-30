// import { useState } from 'react'
import { BrowserRouter } from "react-router-dom";

import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import { NotificationProvider } from "./context/NotificationProvider";

function App() {
    return (
        <BrowserRouter>
            <NotificationProvider>
                <AppRoutes />
            </NotificationProvider>
        </BrowserRouter>
    );
}

export default App;
