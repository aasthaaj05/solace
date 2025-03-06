import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const MeetingScheduler = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [patientName, setPatientName] = useState("");

  const auth = getAuth();
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Schedule a Meeting</h2>

        {/* Date Input */}
        <label className="block text-gray-700 text-sm font-semibold mb-1">Select Date</label>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        {/* Start Time Input */}
        <label className="block text-gray-700 text-sm font-semibold mb-1">Start Time</label>
        <input 
          type="time" 
          value={startTime} 
          onChange={(e) => setStartTime(e.target.value)} 
          className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        {/* End Time Input */}
        <label className="block text-gray-700 text-sm font-semibold mb-1">End Time</label>
        <input 
          type="time" 
          value={endTime} 
          onChange={(e) => setEndTime(e.target.value)} 
          className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        {/* Patient Name Input */}
        <label className="block text-gray-700 text-sm font-semibold mb-1">Patient Name</label>
        <input 
          type="text" 
          value={patientName} 
          onChange={(e) => setPatientName(e.target.value)} 
          placeholder="Enter patient name" 
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        {/* Submit Button */}
        <button 
          onClick={scheduleMeeting} 
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-200">
          Schedule Meeting
        </button>
      </div>
    </div>
  );
};

export default MeetingScheduler;