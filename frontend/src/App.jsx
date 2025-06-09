import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import { NotificationProvider } from "./context/NotificationProvider";
import { UserProvider } from "./context/UserProvider";

function App() {
    useEffect(() => {
        //to hide the annoying morphSVG console logs
        if (window.console && console.log) {
            const originalLog = console.log;
            console.log = function (msg) {
                if (
                    typeof msg === "string" &&
                    msg.includes("invalid morphSVG tween value")
                ) {
                    return;
                }
                originalLog.apply(console, arguments);
            };
        }
    }, []);
    return (
        <BrowserRouter>
            <UserProvider>
                <NotificationProvider>
                    <AppRoutes />
                </NotificationProvider>
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;
