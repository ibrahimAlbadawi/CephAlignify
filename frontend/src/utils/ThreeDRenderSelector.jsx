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
        label: "Articular Disc (TMJ)",
        modelId: "a2c3d9bd82274fa187ee482bbe750d78",
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
        label: "Orofacial anatomy with blood and nerve supply",
        modelId: "3f5afc9d2e4b4b28b3459afffab050c3",
    },
];

const ThreeDRenderSelector = () => {
    const [selectedModel, setSelectedModel] = useState(renders[0]);

    const handleChange = (event) => {
        const model = renders.find((r) => r.modelId === event.target.value);
        setSelectedModel(model);
    };

    return (
        <div>
            <Box sx={{ p: 4 }}>
                <FormControl sx={{ mb: 3, minWidth: 300 }}>
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
            <SketchfabViewer
                title={selectedModel.label}
                modelId={selectedModel.modelId}
            />
        </div>
    );
};

export default ThreeDRenderSelector;
