import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const PatientDetails = ({ patientId }) => {
  const [patient, setPatient] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return;

      const patientRef = doc(db, "users", patientId);
      const patientSnap = await getDoc(patientRef);

      if (patientSnap.exists()) {
        setPatient(patientSnap.data());
      }
    };

    fetchPatient();
  }, [patientId]);

  if (!patient) return <p>Select a patient to view details.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold">{patient.name}</h2>
      <p>Age: {patient.age}</p>
      <p>Sessions Taken: {patient.sessions}</p>
      <h3 className="mt-4 text-lg font-semibold">Session Notes:</h3>
      <p className="border p-2 mt-2 bg-gray-100">{patient.notes}</p>
    </div>
  );
};

export default PatientDetails;
