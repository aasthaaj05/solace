import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import StudentSignup from "./pages/auth/StudentSignup";
import CounsellorSignup from "./pages/auth/CounsellorSignup";
import CounsellorDashboard from "./pages/CounsellorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CalendarPage from "./pages/CalendarPage";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
// import MeetingScheduler from "./components/counsellor/MeetingScheduler";
import Home from "./pages/Home"; // Ensure you have a Home page
import "./index.css";  // ✅ Ensure this import exists in your main entry file
import GuidedMeditations from "./pages/GuidedMeditations";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Default Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup/student" element={<StudentSignup />} />
        <Route path="/signup/counsellor" element={<CounsellorSignup />} />
        <Route path="/counsellor-dashboard" element={<CounsellorDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/guided-meditations" element={<GuidedMeditations />} />
        {/* <Route path="/schedule-meeting" element={<MeetingScheduler />} /> */}
        <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect unknown routes */}
      </Routes>
    </Router>
  );
}

export default App;
