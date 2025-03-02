import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Sidebar = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "counselor") {
        setPatients(userSnap.data().patients); // Array of patient IDs
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-lg font-semibold mb-4">Patients</h2>
      <ul>
        {patients.map((patientId) => (
          <li
            key={patientId}
            className="cursor-pointer p-2 hover:bg-gray-600"
            onClick={() => onSelectPatient(patientId)}
          >
            {patientId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
