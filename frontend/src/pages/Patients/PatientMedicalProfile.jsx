import React from 'react'
import { useParams } from "react-router-dom";


const PatientMedicalProfile = () => {
    const { id } = useParams(); //to fetch desired patient profile data using his id
  return (
    <div>
        patient medical profile
    </div>
  )
}

export default PatientMedicalProfile
