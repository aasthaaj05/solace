import React, { useState, useEffect } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import Navbar from "../components/counsellor/Navbar";

const patients = [
  { id: 1, name: "John Doe", age: 32, condition: "Anxiety", notes: "Progressing well with therapy.", hours: 10, sessions: 5 },
  { id: 2, name: "Jane Smith", age: 28, condition: "Depression", notes: "Needs more follow-ups.", hours: 15, sessions: 8 }
];

const quotes = [
  "Helping one person might not change the whole world, but it could change the world for one person.",
  "Mental health needs a great deal of attention. It's the final taboo and it needs to be faced and dealt with.",
  "The purpose of our lives is to be happy and help others find happiness.",
  "Every small step towards healing is a big victory.",
  "Listening with empathy is the first step to making a difference."
];

const CounsellorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewingNotes, setViewingNotes] = useState(false);
  const [schedulingMeeting, setSchedulingMeeting] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const bookMeeting = () => {
    if (!selectedPatient) {
      alert("Please select a patient first.");
      return;
    }

    const newMeeting = { date, startTime, endTime, patientId: selectedPatient.id };
    const isSlotTaken = meetings.some(meeting => meeting.date === date && meeting.startTime === startTime);
    if (isSlotTaken) {
      alert("This time slot is already booked. Please choose another slot.");
      return;
    }

    setMeetings([...meetings, newMeeting]);
    setSchedulingMeeting(false);
    setDate("");
    setStartTime("");
    setEndTime("");
    alert("Meeting successfully scheduled!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F8D3]">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-grow">
        {sidebarOpen && (
          <aside className="w-64 bg-[#A6F1E0] shadow-lg p-4 rounded-r-2xl">
            <h2 className="text-xl font-semibold text-[#73C7C7] mb-3 border-b-2 border-[#73C7C7] pb-1">
              Patients
            </h2>
            <ul className="space-y-2">
              {patients.map(patient => (
                <li
                  key={patient.id}
                  className={`cursor-pointer px-3 py-2 rounded-lg text-[#5A9A9A] ${selectedPatient?.id === patient.id ? "bg-[#F7CFD8]" : "bg-[#F4F8D3]"} hover:bg-[#F7CFD8] transition`}
                  onClick={() => {
                    setSelectedPatient(patient);
                    setViewingNotes(false);
                    setSchedulingMeeting(false);
                  }}
                >
                  {patient.name}
                </li>
              ))}
            </ul>
          </aside>
        )}
        <main className="flex-grow p-6">
          {selectedPatient ? (
            <div className="bg-white p-6 rounded-xl shadow-lg relative">
              <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={() => setSelectedPatient(null)}>
                <FaTimes size={20} />
              </button>
              <h2 className="text-3xl font-bold text-[#73C7C7] mb-2">{selectedPatient.name}</h2>
              <p className="text-lg text-gray-700"><strong>Age:</strong> {selectedPatient.age}</p>
              <p className="text-lg text-gray-700"><strong>Condition:</strong> {selectedPatient.condition}</p>
              <p className="text-lg text-gray-700"><strong>Hours of Therapy:</strong> {selectedPatient.hours}</p>
              <p className="text-lg text-gray-700"><strong>Sessions Taken:</strong> {selectedPatient.sessions}</p>
              <div className="mt-4 space-x-3">
                <button className="bg-[#73C7C7] text-white px-4 py-2 rounded-lg hover:bg-[#5A9A9A] transition" onClick={() => setViewingNotes(true)}>
                  View Session Notes
                </button>
                <button className="bg-[#F7CFD8] text-white px-4 py-2 rounded-lg hover:bg-[#E6BFC0] transition">
                  Chat
                </button>
                <button className="bg-[#A6F1E0] text-white px-4 py-2 rounded-lg hover:bg-[#8FD8C8] transition" onClick={() => setSchedulingMeeting(true)}>
                  Schedule Meeting
                </button>
              </div>
              {viewingNotes && (
                <div className="bg-white p-6 mt-4 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold text-[#73C7C7]">Session Notes</h3>
                  <p className="text-gray-700 mt-2">{selectedPatient.notes}</p>
                  <button className="mt-3 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition" onClick={() => setViewingNotes(false)}>
                    Close
                  </button>
                </div>
              )}
              {schedulingMeeting && (
                <div className="bg-white p-6 mt-4 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold text-[#73C7C7]">Schedule Meeting</h3>
                  <div className="mt-3">
                    <label className="block text-gray-700">Date:</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border rounded p-2 w-full" />
                  </div>
                  <div className="mt-3">
                    <label className="block text-gray-700">Start Time:</label>
                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="border rounded p-2 w-full" />
                  </div>
                  <div className="mt-3">
                    <label className="block text-gray-700">End Time:</label>
                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="border rounded p-2 w-full" />
                  </div>
                  <button className="mt-4 bg-[#73C7C7] text-white px-4 py-2 rounded-lg hover:bg-[#5A9A9A] transition" onClick={bookMeeting}>
                    Book Meeting
                  </button>
                  <button className="mt-4 ml-3 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition" onClick={() => setSchedulingMeeting(false)}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-[#73C7C7] mb-3">{quote}</h2>
              <p className="text-[#5A9A9A] text-lg">Your work is making the world a better place!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CounsellorDashboard;