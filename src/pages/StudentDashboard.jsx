import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [counsellors, setCounsellors] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }
      
      const studentRef = doc(db, "students", user.uid);
      const studentSnap = await getDoc(studentRef);
      if (studentSnap.exists()) {
        setStudent(studentSnap.data());
      } else {
        console.error("No student data found!");
      }
    };

    const fetchCounsellors = async () => {
      const counsellorsRef = collection(db, "counsellors");
      const counsellorSnap = await getDocs(counsellorsRef);
      setCounsellors(counsellorSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchStudentData();
    fetchCounsellors();
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-[#73C7C7] text-white p-4">
        <h2 className="text-xl font-bold mb-4">Student Dashboard</h2>
        <button onClick={handleLogout} className="w-full bg-red-500 p-2 rounded-lg mt-4">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {student?.name || "Student"}!</h2>

        {/* Profile Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-lg font-bold mb-2">Your Profile</h3>
          {student ? (
            <ul className="text-gray-700">
              <li><strong>Email:</strong> {student.email}</li>
              <li><strong>Phone:</strong> {student.phone}</li>
              <li><strong>College:</strong> {student.college}</li>
            </ul>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>

        {/* Counsellor List */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-2">Available Counsellors</h3>
          {counsellors.length > 0 ? (
            <ul className="space-y-2">
              {counsellors.map((counsellor) => (
                <li key={counsellor.id} className="p-2 border rounded bg-gray-50">
                  <strong>{counsellor.name}</strong> - ₹{counsellor.costPerHour}/hr
                </li>
              ))}
            </ul>
          ) : (
            <p>No counsellors available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
