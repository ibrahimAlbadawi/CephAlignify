import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Icons } from "./utils/constants.jsx";

import { ThemeProvider } from "@mui/material/styles";
import theme from "./utils/theme.jsx"; // your custom theme

// To set the favicon dynamically according the web browser theme (light, dark)
// Note: the icon will change according the device theme and not the browser's
function setDynamicFavicon() {
    const favicon = document.getElementById("favicon");
    if (!favicon) return;

    const updateFavicon = (theme) => {
        favicon.href =
            theme === "dark"
                ? Icons.FaviconBlackTheme
                : Icons.FaviconWhiteTheme;
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    updateFavicon(mediaQuery.matches ? "dark" : "light");

    mediaQuery.addEventListener("change", (e) => {
        updateFavicon(e.matches ? "dark" : "light");
    });
}

setDynamicFavicon();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <StrictMode>
                <App />
            </StrictMode>
        </ThemeProvider>
    </StrictMode>
);
