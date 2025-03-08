import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, serverTimestamp, doc, getDoc, query, where } from "firebase/firestore";
import { db, auth } from "../../../firebase"; // Adjust the import path as needed
import StudNavbar from "../../student/StudNavbar";

const ContactCounsellor = () => {
  const [counsellors, setCounsellors] = useState([]); // Store counsellors
  const [loading, setLoading] = useState(true); // Manage loading state
  const [student, setStudent] = useState(null); // Store student details
  const [reasons, setReasons] = useState({}); // Store reasons per counsellor
  const [requestStatuses, setRequestStatuses] = useState({}); // Store request statuses

  // Fetch student details from Firestore
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const user = auth.currentUser; // Get authenticated user
        if (user) {
          const studentRef = doc(db, "students", user.uid);
          const studentDoc = await getDoc(studentRef);

          if (studentDoc.exists()) {
            setStudent(studentDoc.data());
          } else {
            console.error("Student document not found.");
          }
        }
      } catch (error) {
        console.error("Error fetching student details: ", error);
      }
    };

    fetchStudentDetails();
  }, []);

  // Fetch counsellors from Firestore
  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        const counsellorsCollection = collection(db, "counsellors");
        const counsellorsSnapshot = await getDocs(counsellorsCollection);
        const counsellorsList = counsellorsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCounsellors(counsellorsList);
      } catch (error) {
        console.error("Error fetching counsellors: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounsellors();
  }, []);

  // Fetch request statuses for the logged-in student
  useEffect(() => {
    const fetchRequestStatuses = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const contactRequestsCollection = collection(db, "contactRequests");
        const q = query(
          contactRequestsCollection,
          where("studentId", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        const statuses = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          statuses[data.counsellorId] = data.status; // Map counsellorId to status
        });

        setRequestStatuses(statuses);
      } catch (error) {
        console.error("Error fetching request statuses: ", error);
      }
    };

    fetchRequestStatuses();
  }, []);

  // Handle input change for the reason field
  const handleReasonChange = (counsellorId, value) => {
    setReasons((prev) => ({
      ...prev,
      [counsellorId]: value, // Store reason specific to the counsellor
    }));
  };

  // Handle "Contact" button click
  const handleContactClick = async (counsellorId, counsellorName) => {
    if (!student) {
      alert("Student details not found. Please try again.");
      return;
    }

    const reason = reasons[counsellorId]?.trim(); // Get reason for this counsellor

    if (!reason) {
      alert("Please enter a reason before contacting the counsellor.");
      return;
    }

    try {
      // Add a contact request to Firestore
      const contactRequestsCollection = collection(db, "contactRequests");
      await addDoc(contactRequestsCollection, {
        counsellorId,
        counsellorName,
        studentId: auth.currentUser.uid, // Use student ID from auth
        studentName: student.name, // Use student name from Firestore
        reason, // Include the reason for contact
        status: "pending", // Initial status of the request
        timestamp: serverTimestamp(),
      });

      // Update the request status locally
      setRequestStatuses((prev) => ({
        ...prev,
        [counsellorId]: "pending", // Set status to "pending"
      }));

      // Show a pop-up notification
      alert("Contact request sent!");

      // Clear the input field after submission
      setReasons((prev) => ({
        ...prev,
        [counsellorId]: "",
      }));
    } catch (error) {
      console.error("Error sending contact request: ", error);
      alert("Failed to send contact request. Please try again.");
    }
  };

  // Get button text and disabled state based on request status
  const getButtonProps = (counsellorId) => {
    const status = requestStatuses[counsellorId];

    switch (status) {
      case "pending":
        return { text: "Requested", disabled: true };
      case "accepted":
        return { text: "Accepted", disabled: true };
      case "declined":
        return { text: "Declined", disabled: true };
      default:
        return { text: "Contact", disabled: false };
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8D3] flex flex-col">
      {/* Navbar */}
      <StudNavbar />

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-8 md:p-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#73C7C7] mb-6 sm:mb-8 text-center">
          Contact a Counsellor
        </h1>

        {/* Loading State */}
        {loading && <div className="text-center text-gray-600">Loading counsellors...</div>}

        {/* Counsellors List */}
        {!loading && (
          <div className="max-w-3xl mx-auto">
            {counsellors.length > 0 ? (
              <ul className="space-y-6">
                {counsellors.map((counsellor) => {
                  const { text, disabled } = getButtonProps(counsellor.id);

                  return (
                    <li
                      key={counsellor.id}
                      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="flex flex-col gap-4">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-semibold text-[#73C7C7] mb-2">
                            {counsellor.name}
                          </h2>
                          <p className="text-lg sm:text-xl text-gray-800">
                            Cost per Hour: ${counsellor.costPerHour}
                          </p>
                        </div>

                        {/* Reason Input Field */}
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#73C7C7]"
                          rows="3"
                          placeholder="Enter your reason for contacting this counsellor..."
                          value={reasons[counsellor.id] || ""}
                          onChange={(e) => handleReasonChange(counsellor.id, e.target.value)}
                          disabled={disabled} // Disable input if request is sent
                        ></textarea>

                        {/* Contact Button */}
                        <button
                          className={`bg-[#73C7C7] text-white px-4 py-2 rounded-lg transition duration-200 ${
                            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#5AA6A6]"
                          }`}
                          onClick={() => handleContactClick(counsellor.id, counsellor.name)}
                          disabled={disabled} // Disable button if request is sent
                        >
                          {text}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-center text-gray-600">No counsellors available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactCounsellor;