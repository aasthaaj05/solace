import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db, collection, getDocs, query, where, doc, getDoc } from "../firebase";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMeetingsWithStudentNames(selectedDate);
  }, [selectedDate]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchStudentName = async (studentId) => {
    try {
      const studentRef = doc(db, "students", studentId);
      const studentSnap = await getDoc(studentRef);
      
      if (studentSnap.exists()) {
        return studentSnap.data().name || "Unknown Student";
      }
      return "Unknown Student";
    } catch (err) {
      console.error("Error fetching student:", err);
      return "Error loading name";
    }
  };

  const fetchMeetingsWithStudentNames = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const formattedDate = formatDate(date);
      const meetingsRef = collection(db, "meetings");
      const q = query(meetingsRef, where("date", "==", formattedDate));
      const snapshot = await getDocs(q);

      const meetingsWithNames = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const meetingData = doc.data();
          const studentName = await fetchStudentName(meetingData.studentID);
          
          return {
            id: doc.id,
            ...meetingData,
            studentName // Add the student name to the meeting object
          };
        })
      );
      
      setMeetings(meetingsWithNames);
    } catch (err) {
      console.error("Failed to fetch meetings:", err);
      setError("Failed to load meetings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F4F8D3] min-h-screen flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-3xl">
        <h2 className="text-[#73C7C7] text-2xl sm:text-3xl font-bold text-center mb-6">
          Meeting Calendar
        </h2>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-center mb-6">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="border-0 bg-[#A6F1E0] text-[#073C7C] rounded-lg p-2 shadow-md w-full max-w-md"
          />
        </div>

        <h3 className="mt-6 text-lg sm:text-xl font-semibold text-[#073C7C] text-center">
          Meetings on {selectedDate.toDateString()}
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <p>Loading meetings...</p>
          </div>
        ) : (
          <div className="mt-4">
            {meetings.length > 0 ? (
              <ul className="space-y-3">
                {meetings.map((meeting) => (
                  <li
                    key={meeting.id}
                    className="bg-[#F7CFD8] p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200"
                  >
                    <p className="text-[#073C7C] font-semibold text-lg">
                      Student: {meeting.studentName}
                    </p>
                    <p className="text-gray-700">
                      Time: {meeting.startTime} - {meeting.endTime}
                    </p>
                    {meeting.additionalDetails && (
                      <p className="text-sm text-gray-600 mt-1">
                        Details: {meeting.additionalDetails}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-center py-4">
                No meetings scheduled for this date.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;