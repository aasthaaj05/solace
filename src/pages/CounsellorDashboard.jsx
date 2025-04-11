import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, query, where, addDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase"; // Adjust the import path as needed
import { FaBars } from "react-icons/fa";
import Navbar from "../components/counsellor/Navbar";
import AnimatedBackground from "../components/AnimatedBackground"; // Import AnimatedBackground

const quotes = [
  "Helping one person might not change the whole world, but it could change the world for one person.",
  "Mental health needs a great deal of attention. It's the final taboo and it needs to be faced and dealt with.",
  "The purpose of our lives is to be happy and help others find happiness.",
  "Every small step towards healing is a big victory.",
  "Listening with empathy is the first step to making a difference."
];

const CounsellorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [schedulingMeeting, setSchedulingMeeting] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Fetch requests for the logged-in counsellor
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("No authenticated user");
          return;
        }

        const requestsQuery = query(
          collection(db, "contactRequests"),
          where("counsellorId", "==", user.uid)
        );

        const requestsSnapshot = await getDocs(requestsQuery);
        const requestsList = requestsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRequests(requestsList);
      } catch (error) {
        console.error("Error fetching requests: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle accepting or declining a request
  const handleRequestAction = async (requestId, action) => {
    try {
      if (action === "accepted") {
        // Update the request status to "accepted"
        const requestRef = doc(db, "contactRequests", requestId);
        await updateDoc(requestRef, {
          status: action,
        });
  
        // Update the UI with smooth transitions
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === requestId ? { ...request, status: action } : request
          )
        );
  
        // If the request is accepted, automatically show chat and schedule meeting options
        const updatedRequest = requests.find((request) => request.id === requestId);
        setSelectedRequest(updatedRequest);
      } else if (action === "declined") {
        // Delete the request from Firestore
        const requestRef = doc(db, "contactRequests", requestId);
        await deleteDoc(requestRef);
  
        // Remove the request from the UI
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );
  
        // Clear the selected request if it was the one declined
        if (selectedRequest?.id === requestId) {
          setSelectedRequest(null);
        }
      }
  
      alert(`Request ${action} successfully!`);
    } catch (error) {
      console.error("Error updating request: ", error);
      alert("Failed to update request. Please try again.");
    }
  };

  // Check for overlapping meetings
  const isTimeSlotAvailable = async (counsellorId, date, startTime, endTime) => {
    try {
      const meetingsQuery = query(
        collection(db, "meetings"),
        where("counsellorId", "==", counsellorId),
        where("date", "==", date)
      );

      const meetingsSnapshot = await getDocs(meetingsQuery);
      const meetings = meetingsSnapshot.docs.map((doc) => doc.data());

      // Check for overlapping time slots
      for (const meeting of meetings) {
        if (
          (startTime >= meeting.startTime && startTime < meeting.endTime) ||
          (endTime > meeting.startTime && endTime <= meeting.endTime) ||
          (startTime <= meeting.startTime && endTime >= meeting.endTime)
        ) {
          return false; // Time slot is not available
        }
      }

      return true; // Time slot is available
    } catch (error) {
      console.error("Error checking time slot availability: ", error);
      return false;
    }
  };

  // Handle scheduling a meeting
  const handleScheduleMeeting = async () => {
    if (!date || !startTime || !endTime) {
      alert("Please fill in all fields.");
      return;
    }

    if (startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("No authenticated user.");
        return;
      }

      // Check if the time slot is available
      const isAvailable = await isTimeSlotAvailable(user.uid, date, startTime, endTime);
      if (!isAvailable) {
        alert("This time slot is already booked. Please choose another slot.");
        return;
      }

      // Save the meeting
      const meetingData = {
        counsellorId: user.uid,
        studentId: selectedRequest.studentId,
        date,
        startTime,
        endTime,
        status: "scheduled",
      };

      const meetingsCollection = collection(db, "meetings");
      await addDoc(meetingsCollection, meetingData);

      alert("Meeting scheduled successfully!");
      setSchedulingMeeting(false);
      setDate("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error("Error scheduling meeting: ", error);
      alert("Failed to schedule meeting. Please try again.");
    }
  };

  // Set a random quote on component mount
  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#F4F8D3] to-[#A6F1E0]">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>

      {/* Navbar */}
      <div className="relative z-10">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Main Content */}
      <div className="flex flex-grow relative z-10">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-white/90 backdrop-blur-sm shadow-lg p-4 rounded-r-2xl">
            <h2 className="text-xl font-semibold text-[#73C7C7] mb-3 border-b-2 border-[#73C7C7] pb-1">
              Requests
            </h2>
            <ul className="space-y-2">
              {requests.map((request) => (
                <li
                  key={request.id}
                  className={`cursor-pointer px-3 py-2 rounded-lg text-[#5A9A9A] bg-[#F4F8D3] hover:bg-[#F7CFD8] transition-all duration-300 ${
                    selectedRequest?.id === request.id ? "bg-[#F7CFD8]" : ""
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  {request.studentName} - {request.status}
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-grow p-6">
          {!selectedRequest ? (
            <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
              <h2 className="text-4xl font-bold text-gray-700 mb-4 text-center">{quote}</h2>
              <p className="text-lg text-gray-600 text-center">
                Your work is making the world a better place!
              </p>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-[#73C7C7] mb-4">Patient Details</h2>
              <div className="text-gray-700 space-y-2">
                <p><strong>Name:</strong> {selectedRequest.studentName}</p>
                <p><strong>Reason for Request:</strong> {selectedRequest.reason}</p>
                <p><strong>Status:</strong> {selectedRequest.status}</p>
              </div>

              {/* Action Buttons */}
              {selectedRequest.status === "pending" ? (
                <div className="mt-4 space-x-2">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
                    onClick={() => handleRequestAction(selectedRequest.id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
                    onClick={() => handleRequestAction(selectedRequest.id, "declined")}
                  >
                    Decline
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-x-2">
                  <button
                    className="bg-[#73C7C7] text-white px-4 py-2 rounded-lg hover:bg-[#5A9A9A] transition-all duration-300"
                    onClick={() => alert("Chat functionality coming soon!")}
                  >
                    Chat
                  </button>
                  <button
                    className="bg-[#F7CFD8] text-white px-4 py-2 rounded-lg hover:bg-[#E6BFC0] transition-all duration-300"
                    onClick={() => setSchedulingMeeting(true)}
                  >
                    Schedule Meeting
                  </button>
                </div>
              )}

              {/* Schedule Meeting Form */}
              {schedulingMeeting && (
                <div className="mt-4 bg-[#F4F8D3] p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-[#73C7C7] mb-2">Schedule Meeting</h3>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300"
                    />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300"
                    />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div className="mt-4 space-x-2">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
                      onClick={handleScheduleMeeting}
                    >
                      Confirm
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
                      onClick={() => setSchedulingMeeting(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CounsellorDashboard;