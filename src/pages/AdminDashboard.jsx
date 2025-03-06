import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../firebase";
import Navbar from "../components/admin/AdminNavbar";

const AdminDashboard = () => {
  const [studentCount, setStudentCount] = useState(2);
  const [counselorCount, setCounselorCount] = useState(1);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch student count
        const studentsSnapshot = await getDocs(collection(db, "students"));
        setStudentCount(studentsSnapshot.size);

        // Fetch counselor count
        const counselorsSnapshot = await getDocs(collection(db, "counselors"));
        setCounselorCount(counselorsSnapshot.size);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        {/* Welcome Message */}
        <h1 className="text-3xl font-bold text-gray-800">Welcome, Admin! 👋</h1>
        <p className="text-gray-600 mt-2">Here are the latest stats of the platform:</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Student Count */}
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">Total Students</h2>
            <p className="text-2xl font-bold text-[#73C7C7]">{studentCount}</p>
          </div>

          {/* Counselor Count */}
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">Total Counselors</h2>
            <p className="text-2xl font-bold text-[#73C7C7]">{counselorCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
