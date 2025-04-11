import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db, collection, getDocs, query, where } from "../firebase";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    fetchMeetings(selectedDate);
  }, [selectedDate]);

  const fetchMeetings = async (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const meetingsRef = collection(db, "meetings");
    const q = query(meetingsRef, where("date", "==", formattedDate));
    const snapshot = await getDocs(q);

    const meetingsList = snapshot.docs.map((doc) => doc.data());
    setMeetings(meetingsList);
  };

  return (
    <div className="bg-[#F4F8D3] min-h-screen flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-3xl">
        {/* Title */}
        <h2 className="text-[#73C7C7] text-2xl sm:text-3xl font-bold text-center mb-6">
          Meeting Calendar
        </h2>

        {/* Calendar Wrapper */}
        <div className="flex justify-center mb-6">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="border-0 bg-[#A6F1E0] text-[#073C7C] rounded-lg p-2 shadow-md w-full max-w-md"
          />
        </div>

        {/* Meetings List */}
        <h3 className="mt-6 text-lg sm:text-xl font-semibold text-[#073C7C] text-center">
          Meetings on {selectedDate.toDateString()}
        </h3>

        <div className="mt-4">
          {meetings.length > 0 ? (
            <ul className="space-y-3">
              {meetings.map((meeting, index) => (
                <li
                  key={index}
                  className="bg-[#F7CFD8] p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 text-center sm:text-left"
                >
                  <p className="text-[#073C7C] font-semibold text-lg">
                    {meeting.patientName}
                  </p>
                  <p className="text-gray-700 text-sm sm:text-base">
                    {meeting.startTime} - {meeting.endTime}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center mt-2 text-base sm:text-lg">
              No meetings scheduled.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;