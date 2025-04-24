import React, { useState } from "react";
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";

import SketchfabViewer from "../api/sketchfabviewer";

// Sample renders list
const renders = [
    {
        label: "Orofacial anatomy with blood and nerve supply",
        modelId: "3f5afc9d2e4b4b28b3459afffab050c3",
    },
    {
        label: "Articular Disc (TMJ)",
        modelId: "a2c3d9bd82274fa187ee482bbe750d78",
    },
    {
        label: "Visualization of the upper and lower teeth",
        modelId: "58eb0a05c4ae45ba87610de0eaea995e",
    },
    {
        label: "Permanent Dentition",
        modelId: "2f69d7b59c3e4a6a8bcae041bd8e591b",
    },
    {
        label: "Innervation of the TMJ",
        modelId: "6715a094e266404b8c57d2515a7a12ff",
    },
    {
        label: "Mandible",
        modelId: "7a3c3b99916e481197e6f18fda107c15",
    },
    {
        label: "Maxillary First Molar Pulp Chamber",
        modelId: "efcb762c4fab4a9b806b4abaf33e10dc",
    },
    {
        label: "Tooth cross-section",
        modelId: "9cc281349c314cc4859e26af238f9cd5",
    },
    {
        label: "Gums Teeth and Tongue",
        modelId: "0540edd5362847bfbf28f984bcc3a037",
    },
];

const ThreeDRenderSelector = () => {
    const [selectedModel, setSelectedModel] = useState(" ");

    const handleChange = (event) => {
        const model = renders.find((r) => r.modelId === event.target.value);
        setSelectedModel(model);
    };

    return (
        <div>
            <Box sx={{ p: 4 }}>
                <FormControl
                    sx={{
                        mb: 3,
                        minWidth: 300,
                        // borderRadius: "10px",
                        backgroundColor: "#CDDAE3",
                        backdropFilter: "blur(6px)",
                    }}
                >
                    <InputLabel>Select a Render</InputLabel>
                    <Select
                        value={selectedModel.modelId}
                        onChange={handleChange}
                        label="Select a Render"
                    >
                        {renders.map((render) => (
                            <MenuItem
                                key={render.modelId}
                                value={render.modelId}
                            >
                                {render.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <div
                style={{
                    paddingLeft: "70px",
                    paddingRight: "70px",
                }}
            >
                {(selectedModel != " " && (
                    <SketchfabViewer
                        title={selectedModel.label}
                        modelId={selectedModel.modelId}
                    />
                )) || (
                    <p
                        style={{
                            padding: "150px 0px 0px 450px",
                            opacity: "30%",
                        }}
                    >
                        Select a render from the drop-down menu to preview it
                    </p>
                )}
            </div>
        </div>
    );
};

export default ThreeDRenderSelector;
