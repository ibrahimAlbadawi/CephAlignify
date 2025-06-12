import React, { useState, useEffect } from "react";

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
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PatientMedicalProfileCard from "../../Patients/PatientMedicalProfileCard";
import PrimaryButton from "../../../utils/PrimaryButton";

import AppointmentCard from "../../Appointments/AppointmentCard";

import useGoBack from "../../../utils/handleGoBack";

import { getPatientById } from "../../../api/patients";

import "./ManageProfiles.css";

const ManageAppointments = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("a-z");
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getPatientById(id)
            .then((res) => {
                // console.log(res.data); // to make sure appropriate res is being returned
                setAppointments(res.data.appointments);
                // console.log(appointments)
                setPatient(res.data);
                // console.log(patient)
            })
            .catch((err) => {
                console.error(
                    "Failed to fetch patient:",
                    err.response?.data || err
                );
            });
    }, [id]);

    useEffect(() => {
        // console.log(appointments);
    }, [appointments]);

    const handleMakeNewAppointment = () => {
        navigate("addpatientappointment");
    };

    const handleEditProfile = () => {
        navigate("editpatientprofile");
    };

    const handleGoBack = useGoBack("/manageprofiles/");

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleSortChange = (e) => setSortBy(e.target.value);

    const filteredAppointments = appointments
        //filter according to the patient case
        .filter((appt) =>
            appt.Patient_case?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "a-z")
                return a.Patient_case.localeCompare(b.Patient_case);
            if (sortBy === "z-a")
                return b.Patient_case.localeCompare(a.Patient_case);
            if (sortBy === "visit-time") {
                const getTime = (datetime) => new Date(datetime).getTime();
                return getTime(a.DateAndTime) - getTime(b.DateAndTime);
            }
            return 0;
        });

    return (
        <div id="all-patients-container">
            <h1 id="manage-appointments-header">
                {patient?.Full_name || "Patient"}'s Medical Profile
            </h1>

            <div id="go-back-button">
                <PrimaryButton
                    text="Go back"
                    width="120px"
                    height="30px"
                    fontSize="14px"
                    icon={<ArrowBackIosIcon />}
                    onClick={handleGoBack}
                />
            </div>
            <div id="search-sort-controls-secretary">
                <div id="search-sort-div">
                    <TextField
                        className="custom-textfield"
                        placeholder="Search in patients cases"
                        variant="outlined"
                        size="10px"
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& input::placeholder": {
                                fontSize: "13px",
                            },
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
                            <MenuItem value="visit-time">Visit Time</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div id="manageappointmentsbuttons">
                    <PrimaryButton
                        text="Edit profile"
                        height="40px"
                        fontSize="14px"
                        fontWeight="bold"
                        onClick={handleEditProfile}
                    />
                    <PrimaryButton
                        text="Make a new appointment"
                        width="222px"
                        height="40px"
                        fontSize="14px"
                        fontWeight="bold"
                        onClick={handleMakeNewAppointment}
                    />
                </div>
            </div>
            <div id="todays-agenda-appointments-cards">
                {filteredAppointments && filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appt) => (
                        <AppointmentCard
                            appointment={appt} 
                            key={appt.id}
                            patientName={appt.patient_name}
                            age={appt.patient_age}
                            gender={appt.patient_gender}
                            caseSummary={appt.Patient_case || "N/A"}
                            date={appt.DateAndTime || "Date not specified"}
                            calledFrom="secretary"
                        />
                    ))
                ) : (
                    <p
                        style={{
                            textAlign: "center",
                            marginTop: "20px",
                            color: "#888",
                        }}
                    >
                        No appointments available for this patient.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ManageAppointments;
