import React, { useState } from "react";
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
import PrimaryButton from '../../../utils/PrimaryButton'

import "./ManageProfiles.css";

const AllPatients = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("a-z");

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleSortChange = (e) => setSortBy(e.target.value);

    const filteredPatients = PatientsMedicalProfiles.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === "age") return a.age - b.age;
        if (sortBy === "a-z") return a.name.localeCompare(b.name);
        if (sortBy === "z-a") return b.name.localeCompare(a.name);
        if (sortBy === "lastVisit")
            return new Date(b.lastVisit) - new Date(a.lastVisit);
        return 0;
    });

    return (
        <div id="all-patients-container">
            <h1 id="all-patients-header">All Patients Profiles</h1>

            <div id="search-sort-controls-secretary">
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

                <FormControl  className="custom-select" size="small">
                    <Select
                        value={sortBy}
                        label="Sort by"
                        onChange={handleSortChange}
                    >
                        <MenuItem value="a-z">A–Z</MenuItem>
                        <MenuItem value="z-a">Z–A</MenuItem>
                        <MenuItem value="age">Age</MenuItem>
                        <MenuItem value="lastVisit">Last Visit</MenuItem>
                    </Select>
                </FormControl>

                <PrimaryButton text="Create a new profile" width="222px" height="40px" fontSize="14px" fontWeight="bold"/>
            </div>

            <div id="all-patients-cards-container">
                <div id="all-patients-cards">
                    {filteredPatients.map((patient, index) => (
                        <PatientMedicalProfileCard
                            key={index}
                            patientName={patient.name}
                            age={patient.age}
                            gender={patient.gender}
                            lastVisit={patient.lastVisit}
                            fromSecretary={true}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllPatients;
