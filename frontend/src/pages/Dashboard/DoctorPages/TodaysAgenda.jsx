import React, { useEffect, useState } from "react";
import "./TodaysAgenda.css";
import AppointmentCard from "../../Appointments/AppointmentCard";

import { useNavigate } from "react-router-dom";

// import { getTodaysVisits } from "../../../api/visits";

// for testing only
import patients from "../../Appointments/dummyPatients.json";

const TodaysAgenda = () => {
    const [headerText, setHeaderText] = useState("");
    const [fadeClass, setFadeClass] = useState("fade-in");
    const [visits, setVisits] = useState([]);
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/doctordashboard/newpatientvisit`, {
            state: { callType: "fromAgenda" }, // or any string identifier you prefer
        });
    };

    const doctorName = "Dr. John Doe"; //change this later to be dynamic

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        else if (hour < 18) return "Good afternoon";
        else return "Good evening";
    };

    useEffect(() => {
        // Step 1: Show greeting
        setHeaderText(`${getGreeting()}, ${doctorName}`);

        // Step 2: After 2.5s, fade out
        const fadeOutTimeout = setTimeout(() => {
            setFadeClass("fade-out");
        }, 2500);

        // Step 3: After 3.2s, change to Agenda title and fade in
        const changeTextTimeout = setTimeout(() => {
            setHeaderText("Today's Agenda");
            setFadeClass("fade-in");
        }, 3200);

        // getTodaysVisits()
        //     .then((res) => {
        //         // Expecting an array of visit objects
        //         setVisits(res.data);
        //     })
        //     .catch((err) => {
        //         console.error("Failed to fetch today's visits:", err);
        //     });

        return () => {
            clearTimeout(fadeOutTimeout);
            clearTimeout(changeTextTimeout);
        };
    }, []);

    return (
        <div id="todays-agenda-container">
            <h1 id="todays-agenda-header" className={fadeClass}>
                {headerText}
            </h1>

            <div id="todays-agenda-appointments-cards">
                {patients.map((patient, index) => (
                    <div
                        key={index}
                        // use id to navigate to specific patient medical profile
                        onClick={() => handleCardClick(patient.id)}
                        style={{ cursor: "pointer" }}
                    >
                        <AppointmentCard
                            key={patient.id}
                            patientName={patient.patientName}
                            age={patient.age}
                            gender={patient.gender}
                            caseSummary={patient.caseSummary}
                            timeSlot={patient.timeSlot}
                            calledFrom="doctor"
                            // onCheckClick={() =>
                            //     handleCheckClick(patient.patientName)
                            // }
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodaysAgenda;
