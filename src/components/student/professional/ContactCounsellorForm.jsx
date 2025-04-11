import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../../../firebase";
import { collection, getDocs, addDoc, query, where, doc, getDoc } from "firebase/firestore";
import StudNavbar from "../../student/StudNavbar";
import AnimatedBackground from "../../AnimatedBackground";

const ContactCounsellorForm = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [existingRequests, setExistingRequests] = useState([]);
  const [nameLoading, setNameLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Fetch student name from students collection
        try {
          const studentRef = doc(db, "students", currentUser.uid);
          const studentSnap = await getDoc(studentRef);
          
          if (studentSnap.exists()) {
            setStudentName(studentSnap.data().name || "Anonymous");
          } else {
            setStudentName("Anonymous");
          }
        } catch (error) {
          console.error("Error fetching student name:", error);
          setStudentName("Anonymous");
        }
        
        setNameLoading(false);
        
        if (location.state?.selectedIssue) {
          setSelectedReason(location.state.selectedIssue);
        } else {
          navigate("/contact-counsellor");
          return;
        }
        
        await fetchCounsellors();
        await checkExistingRequests(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, [location.state, navigate]);

  const fetchCounsellors = async () => {
    try {
      const counsellorsCollection = collection(db, "counsellors");
      const snapshot = await getDocs(counsellorsCollection);
      const counsellorsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCounsellors(counsellorsList);
    } catch (error) {
      console.error("Error fetching counsellors:", error);
    }
  };

  const checkExistingRequests = async (studentId) => {
    try {
      const requestsRef = collection(db, "contactRequests");
      const q = query(
        requestsRef,
        where("studentId", "==", studentId),
        where("status", "in", ["pending", "accepted"])
      );
      const snapshot = await getDocs(q);
      const requests = snapshot.docs.map(doc => doc.data());
      setExistingRequests(requests);
    } catch (error) {
      console.error("Error checking existing requests:", error);
    }
  };

  const hasPendingRequest = (counsellorId) => {
    return existingRequests.some(
      request => request.counsellorId === counsellorId && 
                request.status === "pending"
    );
  };

  const hasAcceptedRequest = (counsellorId) => {
    return existingRequests.some(
      request => request.counsellorId === counsellorId && 
                request.status === "accepted"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user || !selectedCounsellor || !selectedReason) {
      alert("Please select a counsellor and ensure you're logged in");
      setLoading(false);
      return;
    }

    if (hasPendingRequest(selectedCounsellor)) {
      alert("You already have a pending request with this counsellor");
      setLoading(false);
      return;
    }

    if (hasAcceptedRequest(selectedCounsellor)) {
      alert("You already have an accepted session with this counsellor");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "contactRequests"), {
        studentId: user.uid,
        studentName: studentName,
        studentEmail: user.email || "No email provided",
        counsellorId: selectedCounsellor,
        counsellorName: counsellors.find(c => c.id === selectedCounsellor)?.name || "Unknown Counsellor",
        reason: selectedReason,
        additionalDetails,
        status: "pending",
        createdAt: new Date().toISOString(),
        isGroup: location.state?.isGroup || false,
        groupMembers: location.state?.groupMembers || []
      });

      alert("Your request has been submitted successfully!");
      navigate("/student-dashboard");
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-r from-[#F7CFD8] to-[#A6F1E0]">
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>

      <StudNavbar />

      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-[#73C7C7] mb-8 text-center">Contact a Counsellor</h1>

          <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#73C7C7] mb-4 border-b border-[#73C7C7] pb-2">
                Your Information
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <div className="w-full p-3 bg-gray-100 rounded-lg">
                  {nameLoading ? "Loading..." : studentName}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Counselling
                </label>
                <div className="w-full p-3 bg-gray-100 rounded-lg">
                  {selectedReason || "Not specified - please go back and select an issue"}
                </div>
              </div>

              {location.state?.isGroup && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Session
                  </label>
                  <div className="w-full p-3 bg-gray-100 rounded-lg">
                    {location.state.groupMembers.length + 1} participants (including you)
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#73C7C7] mb-4 border-b border-[#73C7C7] pb-2">
                Counsellor Selection
              </h2>
              
              <div className="mb-4">
                <label htmlFor="counsellor" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Counsellor *
                </label>
                <select
                  id="counsellor"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#73C7C7]"
                  value={selectedCounsellor}
                  onChange={(e) => setSelectedCounsellor(e.target.value)}
                  required
                >
                  <option value="" disabled>Choose a counsellor</option>
                  {counsellors.map((counsellor) => {
                    const isPending = hasPendingRequest(counsellor.id);
                    const isAccepted = hasAcceptedRequest(counsellor.id);
                    const disabled = isPending || isAccepted;
                    
                    return (
                      <option 
                        key={counsellor.id} 
                        value={counsellor.id}
                        disabled={disabled}
                        className={disabled ? "bg-gray-200" : ""}
                      >
                        {counsellor.name} - {counsellor.specialization || "General Counseling"}
                        {isPending && " (Request Pending)"}
                        {isAccepted && " (Session Active)"}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#73C7C7] mb-4 border-b border-[#73C7C7] pb-2">
                Additional Information
              </h2>
              
              <div className="mb-4">
                <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Details (Optional)
                </label>
                <textarea
                  id="additionalDetails"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#73C7C7]"
                  rows="4"
                  placeholder="Please provide more details about your situation..."
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#73C7C7] hover:bg-[#5A9A9A] text-white font-semibold px-4 py-3 rounded-lg transition duration-200 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactCounsellorForm;