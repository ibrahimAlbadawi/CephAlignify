import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { getAllPatients } from "../../../api/patients";

import "./AllPatients.css";

const AllPatients = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [patients, setPatients] = useState([]);
    const [sortBy, setSortBy] = useState("a-z");

    const navigate = useNavigate();

    const handleSearch = (e) => setSearchTerm(e.target.value);

    const handleSortChange = (e) => setSortBy(e.target.value);

    useEffect(() => {
        getAllPatients()
            .then((res) => {
                // console.log("Fetched patients:", res.data);
                setPatients(res.data);
            })
            .catch((err) => {
                console.error("Error fetching patients:", err.response?.data);
            });
        // .finally(() => {
        //     setLoading(false);
        // });
    }, []);

    const filteredPatients = patients
    .filter((patient) =>
        patient?.Full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
        if (sortBy === "age-asc") return (a.age ?? 0) - (b.age ?? 0);
        if (sortBy === "age-desc") return (b.age ?? 0) - (a.age ?? 0);
        if (sortBy === "a-z")
            return (a.Full_name ?? "").localeCompare(b.Full_name ?? "");
        if (sortBy === "z-a")
            return (b.Full_name ?? "").localeCompare(a.Full_name ?? "");
        if (sortBy === "lastVisit")
            return new Date(b.last_visit ?? 0) - new Date(a.last_visit ?? 0);
        return 0;
    });


    const handleCardClick = (id) => {
        navigate(`/doctordashboard/patientprofile/${id}`);
    };

    return (
        <div id="all-patients-container">
            <h1 id="all-patients-header-doctor-side">All Patients Medical Profiles</h1>

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
                                patientName={patient.Full_name}
                                age={patient.age}
                                gender={patient.Gender}
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
