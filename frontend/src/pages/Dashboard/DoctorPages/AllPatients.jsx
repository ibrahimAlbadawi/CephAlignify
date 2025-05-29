import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PatientMedicalProfileCard from "../../Patients/PatientMedicalProfileCard";
import PatientsMedicalProfiles from "../../Patients/PatientsMedicalProfiles.json";
import "./AllPatients.css";

const AllPatients = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const [sortBy, setSortBy] = useState("a-z");

    const navigate = useNavigate();

    const handleSearch = (e) => setSearchTerm(e.target.value);

    const handleSortChange = (e) => setSortBy(e.target.value);



    const filteredPatients = PatientsMedicalProfiles.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === "age-asc") return a.age - b.age;
        if (sortBy === "age-desc") return b.age - a.age;
        if (sortBy === "a-z") return a.name.localeCompare(b.name);
        if (sortBy === "z-a") return b.name.localeCompare(a.name);
        if (sortBy === "lastVisit")
            return new Date(b.lastVisit) - new Date(a.lastVisit);
        return 0;
    });

    const handleCardClick = (id) => {
        //to static page for now
        navigate(`/doctordashboard/patientprofile`);
    };

    return (
        <div id="all-patients-container">
            <h1 id="all-patients-header">All Patients Profiles</h1>

            <div className="search-sort-controls">
                <TextField
                    className="custom-textfield"
                    placeholder="Search"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <FormControl className="custom-select" size="small">
                    <Select
                        value={sortBy}
                        onChange={handleSortChange}
                    >
                        <MenuItem value="a-z">A–Z</MenuItem>
                        <MenuItem value="z-a">Z–A</MenuItem>
                        <MenuItem value="age-asc">Age Asc.</MenuItem>
                        <MenuItem value="age-desc">Age Desc.</MenuItem>
                        <MenuItem value="lastVisit">Last Visit</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div id="all-patients-cards-container">
                <div id="all-patients-cards">
                    {filteredPatients.map((patient, index) => (
                        <div
                            key={index}
                            // use id to navigate to specific patient medical profile
                            onClick={() => handleCardClick(patient.id)}
                            style={{ cursor: "pointer" }}
                        >
                            <PatientMedicalProfileCard
                                patientName={patient.name}
                                age={patient.age}
                                gender={patient.gender}
                                lastVisit={patient.lastVisit}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllPatients;
