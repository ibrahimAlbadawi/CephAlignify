// src/api/analysis.js

import axios from "./axios";

// Start a new cephalometric analysis
export const startAnalysis = (visitId, imageFile, analysisType, enableAIDiagnosis = false) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("analysis_type", analysisType);
    formData.append("enable_ai_diagnosis", enableAIDiagnosis ? "true" : "false");

    return axios.post(`/start-analysis/${visitId}/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// Trigger DeepSeek AI diagnosis for a completed analysis
export const triggerDeepSeekDiagnosis = (analysisId) => {
    return axios.post(`/deepseek-chat/?analysis_id=${analysisId}`);
};

// Get Steiner measurements from the report
export const getSteinerMeasurements = (analysisId) => {
    return axios.get(`/api/analysis/measurements/${analysisId}/`);
};

// Get Steiner image
export const getSteinerImage = (analysisId) => {
    return axios.get(`/api/steiner-image/${analysisId}/`);
};

// Update an existing analysis (doctor only)
export const updateAnalysis = (visitId, imageFile, analysisType, enableAIDiagnosis = false) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("analysis_type", analysisType);
    formData.append("enable_ai_diagnosis", enableAIDiagnosis ? "true" : "false");

    return axios.put(`/update-analysis/${visitId}/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

