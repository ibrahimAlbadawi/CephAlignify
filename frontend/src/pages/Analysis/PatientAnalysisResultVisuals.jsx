import React, { useState } from "react";
import {
    Box,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";

const PatientAnalysisReportVisuals = ({ type }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const renderVisual = () => {
        if (type === "Tracing") return <div>🧠 Showing Tracing Visuals</div>;
        if (type === "Report") return <div>📄 Showing Report Visuals</div>;
        if (type === "PDF") return <div>🖨️ Showing PDF Export</div>;
        return <div>No visual selected</div>;
    };

    return (
        <>
            <Box
                sx={{
                    position: "relative",
                    borderRadius: "8px",
                    padding: "16px",
                    minHeight: "200px",
                }}
            >
                {/* Expand button */}
                <IconButton
                    onClick={handleOpen}
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 2,
                    }}
                >
                    <FullscreenIcon />
                </IconButton>

                {renderVisual()}
            </Box>

            {/* Dialog Popup */}
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="lg"
                PaperProps={{
                    sx: {
                        padding: 3,
                        position: "relative",
                        borderRadius: "12px",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6">
                        {type} - Full View
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            minHeight: "400px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "24px",
                        }}
                    >
                        {renderVisual()}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PatientAnalysisReportVisuals;
