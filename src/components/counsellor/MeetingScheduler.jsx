import React, { useState } from "react";
import { db } from "../firebase"; // Ensure correct Firebase import
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase auth

const MeetingScheduler = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [patientName, setPatientName] = useState("");

  const auth = getAuth(); // Initialize Firebase Auth
  const user = auth.currentUser;

  const scheduleMeeting = async () => {
    if (!date || !startTime || !endTime || !patientName) {
      alert("All fields are required!");
      return;
    }

    if (!user) {
      alert("User not authenticated!");
      return;
    }

    try {
      const meetingsRef = collection(db, "meetings");

      // Check for conflicts
      const q = query(meetingsRef, where("date", "==", date), where("counselorId", "==", user.uid));
      const snapshot = await getDocs(q);

      let conflict = false;
      snapshot.forEach((doc) => {
        const meeting = doc.data();
        if (
          (startTime >= meeting.startTime && startTime < meeting.endTime) ||
          (endTime > meeting.startTime && endTime <= meeting.endTime) ||
          (startTime <= meeting.startTime && endTime >= meeting.endTime)
        ) {
          conflict = true;
        }
      });

      if (conflict) {
        alert("Time slot already booked!");
        return;
      }

      // Save to Firebase
      await addDoc(meetingsRef, { 
        date, 
        startTime, 
        endTime, 
        patientName, 
        counselorId: user.uid
      });

      alert("Meeting scheduled successfully!");
      setDate("");
      setStartTime("");
      setEndTime("");
      setPatientName("");
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      alert("Failed to schedule meeting. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Schedule a Meeting</h2>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 border rounded mb-2 w-full" />
      <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="p-2 border rounded mb-2 w-full" />
      <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="p-2 border rounded mb-2 w-full" />
      <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Patient Name" className="p-2 border rounded mb-2 w-full" />
      <button onClick={scheduleMeeting} className="bg-blue-500 text-white px-4 py-2 rounded w-full">Schedule</button>
    </div>
  );
};

export default MeetingScheduler;
