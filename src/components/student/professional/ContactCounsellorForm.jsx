import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import StudNavbar from "../../student/StudNavbar"; // Import StudNavbar
import AnimatedBackground from "../../AnimatedBackground"; // Import AnimatedBackground

const ContactCounsellorForm = () => {
  const [counsellors, setCounsellors] = useState([]); // List of counsellors
  const [selectedCounsellor, setSelectedCounsellor] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch counsellors from Firestore
  useEffect(() => {
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
        console.error("Error fetching counsellors: ", error);
      }
    };

    fetchCounsellors();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = auth.currentUser;
    if (!user || !selectedCounsellor) {
      alert("Please select a counsellor and ensure you are logged in.");
      setLoading(false);
      return;
    }

    try {
      // Save the request in Firestore
      const requestsCollection = collection(db, "contactRequests");
      await addDoc(requestsCollection, {
        studentId: user.uid,
        studentName: user.displayName || "Anonymous",
        counsellorId: selectedCounsellor,
        additionalDetails,
        status: "pending",
        timestamp: new Date(),
      });

      alert("Your request has been submitted successfully!");
      navigate("/student-dashboard"); // Redirect to the dashboard
    } catch (error) {
      console.error("Error submitting request: ", error);
      alert("Failed to submit your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-r from-[#F7CFD8] to-[#A6F1E0]">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>

      {/* Navbar */}
      <StudNavbar />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-[#73C7C7] mb-8 text-center">Contact a Counsellor</h1>

          <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
            {/* Counsellor Selection */}
            <div className="mb-6">
              <label htmlFor="counsellor" className="block text-lg font-semibold text-[#73C7C7] mb-2">
                Select a Counsellor
              </label>
              <select
                id="counsellor"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#73C7C7]"
                value={selectedCounsellor}
                onChange={(e) => setSelectedCounsellor(e.target.value)}
                required
              >
                <option value="" disabled>
                  Choose a counsellor
                </option>
                {counsellors.map((counsellor) => (
                  <option key={counsellor.id} value={counsellor.id}>
                    {`${counsellor.name} - $${counsellor.costPerHour}/hr`}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Details */}
            <div className="mb-6">
              <label htmlFor="details" className="block text-lg font-semibold text-[#73C7C7] mb-2">
                Additional Details
              </label>
              <textarea
                id="details"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#73C7C7]"
                rows="4"
                placeholder="Provide additional details about your issue..."
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#73C7C7] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#A6F1E0] hover:text-black transition duration-200"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactCounsellorForm;