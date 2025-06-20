    import React, { useState, useEffect } from "react";

    import { getAllPatients } from "../../../api/patients";

    import { useUser } from "../../../context/UserProvider";

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
    import PrimaryButton from "../../../utils/PrimaryButton";

    import "./ManageProfiles.css";

    const ManageProfiles = () => {
        const [headerText, setHeaderText] = useState("");
        const [fadeClass, setFadeClass] = useState("fade-in");
        const [searchTerm, setSearchTerm] = useState("");
        const [sortBy, setSortBy] = useState("a-z");

        const { user } = useUser();

        const secretaryName = user?.full_name || "Secretary";

        const navigate = useNavigate();

        const [patients, setPatients] = useState([]);

        useEffect(() => { //to handle the fading animtion in the header
            const hour = new Date().getHours();
            const greeting =
                hour < 12
                    ? "Good morning"
                    : hour < 18
                    ? "Good afternoon"
                    : "Good evening";

            // Step 1: Show greeting
            setHeaderText(`${greeting}, ${secretaryName}`);

            // Step 2: After 2.5s, fade out
            const fadeOutTimeout = setTimeout(() => {
                setFadeClass("fade-out");
            }, 2500);

            // Step 3: After 3.2s, change to Agenda title and fade in
            const changeTextTimeout = setTimeout(() => {
                setHeaderText("Manage Profiles");
                setFadeClass("fade-in");
            }, 3200);

            return () => {
                clearTimeout(fadeOutTimeout);
                clearTimeout(changeTextTimeout);
            };
        }, [secretaryName]);

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

        const handleCreateNewProfile = () => {
            navigate("createpatientprofile");
        };

        const handleCardClick = (id) => {
            navigate(`manageappointments/${id}`);
        };

        const handleSearch = (e) => setSearchTerm(e.target.value);
        const handleSortChange = (e) => setSortBy(e.target.value);

        const filteredPatients = patients
            .filter((patient) =>
                patient.Full_name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                if (sortBy === "age-asc") return a.age - b.age;
                if (sortBy === "age-desc") return b.age - a.age;
                if (sortBy === "a-z") return a.Full_name.localeCompare(b.Full_name);
                if (sortBy === "z-a") return b.Full_name.localeCompare(a.Full_name);
                if (sortBy === "lastVisit")
                    return new Date(b.last_visit) - new Date(a.last_visit);
                return 0;
            });

        return (
            <div id="all-patients-container">
                <h1 id="all-patients-header" className={fadeClass}>
                    {headerText}
                </h1>

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
                                <MenuItem value="lastVisit">Last Visit</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <PrimaryButton
                        text="Create a new profile"
                        width="222px"
                        height="40px"
                        fontSize="14px"
                        fontWeight="bold"
                        onClick={handleCreateNewProfile}
                    />
                </div>

                <div id="all-patients-cards-container">
                    {filteredPatients.length > 0 ? (
                        <div id="all-patients-cards">
                            {filteredPatients.map((patient, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleCardClick(patient.id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <PatientMedicalProfileCard
                                        patientName={patient.Full_name}
                                        age={patient.age}
                                        gender={patient.Gender}
                                        lastVisit={patient.lastVisit}
                                        calledFrom="secretary"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p
                            style={{
                                textAlign: "center",
                                color: "#888",
                                marginTop: "30px",
                            }}
                        >
                            {filteredPatients.length === 0 && searchTerm
                                ? "No patient matches your search."
                                : "No patients profiles available yet."}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    export default ManageProfiles;
