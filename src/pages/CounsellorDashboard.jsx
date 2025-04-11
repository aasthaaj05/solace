import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, query, where, addDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { FaBars } from "react-icons/fa";
import Navbar from "../components/counsellor/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";

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
  const [showConfirmation, setShowConfirmation] = useState(false);

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
          studentName: doc.data().studentName || "Anonymous Student",
          studentEmail: doc.data().studentEmail || "No email provided",
          reason: doc.data().reason || "No reason provided",
          additionalDetails: doc.data().additionalDetails || "No additional details provided",
          status: doc.data().status || "pending",
          isGroup: doc.data().isGroup || false,
          groupMembers: doc.data().groupMembers || [],
          ...doc.data()
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
        const requestRef = doc(db, "contactRequests", requestId);
        await updateDoc(requestRef, {
          status: action,
          updatedAt: new Date().toISOString()
        });
  
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === requestId ? { ...request, status: action } : request
          )
        );
  
        const updatedRequest = requests.find((request) => request.id === requestId);
        setSelectedRequest(updatedRequest);
        setShowConfirmation(false);
      } else if (action === "declined") {
        const requestRef = doc(db, "contactRequests", requestId);
        await deleteDoc(requestRef);
  
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );
  
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

      for (const meeting of meetings) {
        if (
          (startTime >= meeting.startTime && startTime < meeting.endTime) ||
          (endTime > meeting.startTime && endTime <= meeting.endTime) ||
          (startTime <= meeting.startTime && endTime >= meeting.endTime)
        ) {
          return false;
        }
      }

      return true;
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

      const isAvailable = await isTimeSlotAvailable(user.uid, date, startTime, endTime);
      if (!isAvailable) {
        alert("This time slot is already booked. Please choose another slot.");
        return;
      }

      const meetingData = {
        counsellorId: user.uid,
        counsellorName: user.displayName || "Counsellor",
        studentId: selectedRequest.studentId,
        studentName: selectedRequest.studentName,
        studentEmail: selectedRequest.studentEmail,
        date,
        startTime,
        endTime,
        status: "scheduled",
        createdAt: new Date().toISOString()
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
              Counseling Requests
            </h2>
            {loading ? (
              <p className="text-gray-500">Loading requests...</p>
            ) : requests.length === 0 ? (
              <p className="text-gray-500">No requests found</p>
            ) : (
              <ul className="space-y-2">
                {requests.map((request) => (
                  <li
                    key={request.id}
                    className={`cursor-pointer px-3 py-2 rounded-lg text-[#5A9A9A] bg-[#F4F8D3] hover:bg-[#F7CFD8] transition-all duration-300 ${
                      selectedRequest?.id === request.id ? "bg-[#F7CFD8]" : ""
                    }`}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <div className="font-medium">{request.studentName}</div>
                    <div className="text-sm">{request.status}</div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-grow p-6">
          {!selectedRequest ? (
            <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
              <h2 className="text-4xl font-bold text-gray-700 mb-4 text-center">{quote}</h2>
              <p className="text-lg text-gray-600 text-center">
                {requests.length === 0 
                  ? "You currently have no counseling requests."
                  : "Select a request from the sidebar to view details."}
              </p>
            </div>
          ) : showConfirmation ? (
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-[#73C7C7] mb-6">Confirm Request Acceptance</h2>
              
              <div className="mb-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Request Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Student Name</p>
                        <p className="text-gray-800">{selectedRequest.studentName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Student Email</p>
                        <p className="text-gray-800">{selectedRequest.studentEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Reason</p>
                        <p className="text-gray-800">{selectedRequest.reason}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <p className="text-gray-800 capitalize">{selectedRequest.status}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">Additional Details</p>
                        <p className="text-gray-800 whitespace-pre-line">
                          {selectedRequest.additionalDetails}
                        </p>
                      </div>
                      {selectedRequest.isGroup && (
                        <div className="col-span-2">
                          <p className="text-sm font-medium text-gray-500">Group Session Details</p>
                          <p className="text-gray-800">
                            {selectedRequest.groupMembers.length + 1} participants (including {selectedRequest.studentName})
                          </p>
                          {selectedRequest.groupMembers.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-500">Group Members:</p>
                              <ul className="list-disc pl-5">
                                {selectedRequest.groupMembers.map((member, index) => (
                                  <li key={index} className="text-gray-800">
                                    {member.name} ({member.email})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm">
                  By accepting this request, you agree to provide counseling services to this student.
                  Please ensure you review all details before proceeding.
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-3 rounded-lg transition duration-200"
                >
                  Back to Request
                </button>
                <button
                  onClick={() => handleRequestAction(selectedRequest.id, "accepted")}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-3 rounded-lg transition duration-200"
                >
                  Confirm Acceptance
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-[#73C7C7] mb-4">Student Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#F4F8D3] p-4 rounded-lg">
                  <h3 className="font-semibold text-[#5A9A9A] mb-2">Personal Information</h3>
                  <p><strong>Name:</strong> {selectedRequest.studentName}</p>
                  <p><strong>Email:</strong> {selectedRequest.studentEmail}</p>
                </div>
                <div className="bg-[#F4F8D3] p-4 rounded-lg">
                  <h3 className="font-semibold text-[#5A9A9A] mb-2">Request Details</h3>
                  <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedRequest.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>{selectedRequest.status}</span></p>
                  <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="mb-6 bg-[#F4F8D3] p-4 rounded-lg">
                <h3 className="font-semibold text-[#5A9A9A] mb-2">Additional Information</h3>
                <div className="whitespace-pre-line bg-white p-3 rounded">
                  {selectedRequest.additionalDetails}
                </div>
              </div>

              {/* Group Session Details */}
              {selectedRequest.isGroup && (
                <div className="mb-6 bg-[#F4F8D3] p-4 rounded-lg">
                  <h3 className="font-semibold text-[#5A9A9A] mb-2">Group Session Details</h3>
                  <p className="mb-2">
                    <strong>Total Participants:</strong> {selectedRequest.groupMembers.length + 1} (including {selectedRequest.studentName})
                  </p>
                  {selectedRequest.groupMembers.length > 0 && (
                    <div>
                      <p className="font-medium mb-1">Group Members:</p>
                      <ul className="list-disc pl-5 bg-white p-3 rounded">
                        {selectedRequest.groupMembers.map((member, index) => (
                          <li key={index}>
                            {member.name} ({member.email})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {selectedRequest.status === "pending" ? (
                <div className="mt-6 flex space-x-4">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-all duration-300 flex-1"
                    onClick={() => setShowConfirmation(true)}
                  >
                    Accept Request
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all duration-300 flex-1"
                    onClick={() => handleRequestAction(selectedRequest.id, "declined")}
                  >
                    Decline Request
                  </button>
                </div>
              ) : (
                <div className="mt-6 flex flex-col space-y-4">
                  <div className="flex space-x-4">
                    <button
                      className="bg-[#73C7C7] hover:bg-[#5A9A9A] text-white px-6 py-2 rounded-lg transition-all duration-300 flex-1"
                      onClick={() => alert("Chat functionality coming soon!")}
                    >
                      Start Chat Session
                    </button>
                    <button
                      className="bg-[#F7CFD8] hover:bg-[#E6BFC0] text-white px-6 py-2 rounded-lg transition-all duration-300 flex-1"
                      onClick={() => setSchedulingMeeting(true)}
                    >
                      Schedule Meeting
                    </button>
                  </div>
                  
                  {schedulingMeeting && (
                    <div className="mt-4 bg-[#F4F8D3] p-4 rounded-lg shadow-md">
                      <h3 className="text-xl font-bold text-[#73C7C7] mb-4">Schedule Meeting with {selectedRequest.studentName}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-300"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                          <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                          <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-300"
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex space-x-4">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-all duration-300 flex-1"
                          onClick={handleScheduleMeeting}
                        >
                          Confirm Meeting
                        </button>
                        <button
                          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-all duration-300 flex-1"
                          onClick={() => setSchedulingMeeting(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
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