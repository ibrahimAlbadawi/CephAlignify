import React from "react";

import "./TodaysAgenda.css";
import AppointmentCard from "../../Appointments/AppointmentCard";

//for testing only
import patients from "../../Appointments/dummyPatients.json";

const TodaysAgenda = () => {
    return (
        <div id="todays-agenda-container">
            <h1 id="todays-agenda-header">Today's Agenda</h1>
            <div id="appointments-cards">
                {patients.map((patient) => (
                    <AppointmentCard
                        key={patient.id}
                        patientName={patient.patientName}
                        age={patient.age}
                        gender={patient.gender}
                        caseSummary={patient.caseSummary}
                        timeSlot={patient.timeSlot}
                        onCheckClick={() =>
                            handleCheckClick(patient.patientName)
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default TodaysAgenda;
