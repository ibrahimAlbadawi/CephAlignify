import React, { useEffect, useState } from "react";
import "./TodaysAgenda.css";
import AppointmentCard from "../../Appointments/AppointmentCard";

import { useNavigate } from "react-router-dom";

import { useUser } from "../../../context/UserProvider";

import { getAllAppointments } from "../../../api/appointments";

const TodaysAgenda = () => {
    const [appointments, setAppointments] = useState([]);
    const [headerText, setHeaderText] = useState("");
    const [fadeClass, setFadeClass] = useState("fade-in");
    const [visits, setVisits] = useState([]);
    const navigate = useNavigate();

    const { user } = useUser();

    const handleCardClick = (appointment) => {
        navigate(`../newpatientvisit/${appointment.id}`, {
            state: {
                callType: "fromAgenda",
                appointment, // passing the whole object
            },
        });
    };

    const doctorName = user?.full_name || "Doctor";

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        else if (hour < 18) return "Good afternoon";
        else return "Good evening";
    };

    useEffect(() => {
        //to display a proper header
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
        return () => {
            clearTimeout(fadeOutTimeout);
            clearTimeout(changeTextTimeout);
        };
    }, [doctorName]);

    useEffect(() => {
        getAllAppointments()
            .then((res) => {
                // console.log(res.data); // to make sure appropriate res is being returned
                setAppointments(res.data);
                // setAppointments(res.data.appointments);
                // console.log(appointments)
                // setPatient(res.data);
                // console.log(patient) (WRONG)
            })
            .catch((err) => {
                console.error(
                    "Failed to fetch patient:",
                    err.response?.data || err
                );
            });
    }, []);

    return (
        <div id="todays-agenda-container">
            <h1 id="todays-agenda-header" className={fadeClass}>
                {headerText}
            </h1>

            <div id="todays-agenda-appointments-cards">
                {appointments && appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                        <div
                            key={index}
                            // use id to navigate to specific patient medical profile
                            onClick={() => handleCardClick(appointment)}
                            style={{ cursor: "pointer" }}
                        >
                            <AppointmentCard
                                key={appointment.id}
                                patientName={appointment.patient_name}
                                age={appointment.patient_age}
                                gender={appointment.patient_gender}
                                caseSummary={appointment.Patient_case || "N/A"}
                                timeSlot={appointment.DateAndTime}
                                calledFrom="doctor"
                                isCompleted={appointment.is_completed}
                                isToggleable={false} // always make it false
                            />
                        </div>
                    ))
                ) : (
                    <p
                        style={{
                            textAlign: "center",
                            marginTop: "20px",
                            color: "#888",
                        }}
                    >
                        No appointments are there yet.
                    </p>
                )}
            </div>
        </div>
    );
};

export default TodaysAgenda;
