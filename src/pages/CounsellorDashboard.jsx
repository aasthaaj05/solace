import React, { useState } from "react";
import Sidebar from "../components/counsellor/Sidebar";  
import PatientDetails from "../components/counsellor/PatientDetails";  

const Dashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div className="flex h-screen">
      {/* Sidebar with patient list */}
      <Sidebar onSelectPatient={setSelectedPatient} />

      {/* Main section showing patient details */}
      <div className="flex-1 p-4">
        <PatientDetails patientId={selectedPatient} />
      </div>
    </div>
  );
};

export default Dashboard;
