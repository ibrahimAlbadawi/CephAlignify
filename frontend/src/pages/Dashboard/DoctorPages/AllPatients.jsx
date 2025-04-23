import React from "react";

import PatientMedicalProfileCard from "../../Patients/PatientMedicalProfileCard";

import PatientsMedicalProfiles from "../../Patients/PatientsMedicalProfiles.json";
const AllPatients = () => {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "16px",
                padding: "16px",
            }}
        >
            {PatientsMedicalProfiles.map((patient, index) => (
                <PatientMedicalProfileCard
                    key={index}
                    name={patient.name}
                    age={patient.age}
                    gender={patient.gender}
                    lastVisit={patient.lastVisit}
                />
            ))}
        </div>
    );
};

export default AllPatients;
