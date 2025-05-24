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
import PrimaryButton from "../../../utils/PrimaryButton";

import AppointmentCard from "../../Appointments/AppointmentCard";
import patients from '../../Appointments/dummyPatients.json'

import "./ManageProfiles.css";

const AllPatients = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("a-z");

    const navigate = useNavigate();

    const handleMakeNewVisit = () => {
        navigate("addpatientvisit");
    };

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleSortChange = (e) => setSortBy(e.target.value);

    const filteredPatients = patients.filter((patient) =>
        patient.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === "age-asc") return a.age - b.age;
        if (sortBy === "age-desc") return b.age - a.age;
        if (sortBy === "a-z") return a.patientName.localeCompare(b.patientName);
        if (sortBy === "z-a") return b.patientName.localeCompare(a.patientName);
        if (sortBy === "visit-time") {
          const getStartTime = (slot) => {
              const [start] = slot.split(" - ");
              const [hours, minutes] = start.split(":").map(Number);
              return hours * 60 + minutes; // convert to minutes since midnight
          };
          return getStartTime(a.timeSlot) - getStartTime(b.timeSlot);
      }
        return 0;
    });

    return (
        <div id="all-patients-container">
            <h1 id="all-patients-header">Manage Visits</h1>

            <div id="search-sort-controls-secretary">
                <div id="search-sort-div">
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
                            label="Sort by"
                            onChange={handleSortChange}
                        >
                            <MenuItem value="a-z">A–Z</MenuItem>
                            <MenuItem value="z-a">Z–A</MenuItem>
                            <MenuItem value="age-asc">Age Asc.</MenuItem>
                            <MenuItem value="age-desc">Age Desc.</MenuItem>
                            <MenuItem value="visit-time">Visit Time</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <PrimaryButton
                    text="Make a new visit"
                    width="222px"
                    height="40px"
                    fontSize="14px"
                    fontWeight="bold"
                    onClick={handleMakeNewVisit}
                />
            </div>
            <div id="todays-agenda-appointments-cards">
                {filteredPatients.map((patient) => (
                    <AppointmentCard
                        key={patient.id}
                        patientName={patient.patientName}
                        age={patient.age}
                        gender={patient.gender}
                        caseSummary={patient.caseSummary}
                        date={patient.date}
                        // onCheckClick={() =>
                        //     handleCheckClick(patient.patientName)
                        // }
                        calledFrom="secretary"
                        />
                ))}
            </div>
        </div>
    );
};

export default AllPatients;
