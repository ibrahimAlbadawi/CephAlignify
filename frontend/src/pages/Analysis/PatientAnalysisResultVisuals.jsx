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

const PatientAnalysisReportVisuals = ({ type, analysisImage, pdfFile }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const renderVisual = (fullScreen = false) => {
        if (type === "Tracing") {
            return analysisImage ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <img
                        src={analysisImage}
                        alt="Cephalometric Analysis"
                        style={{
                            width: fullScreen ? "100%" : "85%",
                            height: fullScreen ? "90vh" : "85%",
                            objectFit: "contain",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                        }}
                    />
                </Box>
            ) : (
                <div>No analysis tracing available</div>
            );
        }

        if (type === "Report") {
            return (
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "18px",
                    }}
                >
                    <Typography>
                        📄 Report content will be shown here if needed
                    </Typography>
                </Box>
            );
        }

        if (type === "PDF") {
            return pdfFile ? (
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <a
                        href={pdfFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            textDecoration: "underline",
                            color: "#284b63",
                            fontWeight: "bold",
                            fontSize: "18px",
                        }}
                    >
                        View PDF Report
                    </a>
                </Box>
            ) : (
                <div>No PDF report available</div>
            );
        }

        return <div>No visual selected</div>;
    };

    return (
        <>
            <Box
                sx={{
                    position: "relative",
                    borderRadius: "8px",
                    padding: "16px",
                    width: "465px",
                    height: "458px",
                    overflow: "hidden",
                }}
            >
                <IconButton
                    onClick={handleOpen}
                    sx={{
                        position: "absolute",
                        top: 30,
                        right: 20,
                        zIndex: 2,
                    }}
                >
                    <FullscreenIcon />
                </IconButton>

                {renderVisual(false)}
            </Box>

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
                    <Typography variant="h6">{type} - Full View</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "90vh",
                    }}
                >
                    {renderVisual(true)}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PatientAnalysisReportVisuals;
