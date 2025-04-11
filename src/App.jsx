import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import AvatarAssistant from "./components/student/AvatarAssistant"; 
// Auth Pages
import Login from "./pages/auth/Login";
import StudentSignup from "./pages/auth/StudentSignup";
import CounsellorSignup from "./pages/auth/CounsellorSignup";
import AdminLogin from "./pages/auth/AdminLogin";

// Dashboard Pages
import CounsellorDashboard from "./pages/CounsellorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Feature Pages
import CalendarPage from "./pages/CalendarPage";
import GuidedMeditations from "./pages/GuidedMeditations";
import ExamIndex from "./pages/ExamIndex";

// Other Pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// UI Components
import { Toaster } from "./components/student/exam/ui/toaster";
import { Toaster as Sonner } from "./components/student/exam/ui/sonner";
import { TooltipProvider } from "./components/student/exam/ui/tooltip";

// Styles
import "./index.css";
import "./indexExam.css";

// Questionnaire
import Login1 from './components/student/questionnaire/Login';
import Questionnaire from './components/student/questionnaire/Questionnaire';
import AdminDashboard1 from './components/student/questionnaire/AdminDashboard';
import PrivateRoute from './components/student/questionnaire/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

// Crisis
import AdminDashboard2 from './components/student/crisis/AdminDashboard';
import Login2 from './components/student/crisis/Login';
import PrivateRoute2 from './components/student/crisis/PrivateRoute';
import Crisisquiz from './components/student/crisis/Crisisquiz';

// Professional
import Helpline from './components/student/professional/Helpline';
import ContactCounsellor from './components/student/professional/ContactCounsellor';
import ContactCounsellorForm from './components/student/professional/ContactCounsellorForm';

// Feel Worthy
import FeelWorthy from './pages/FeelWorthyIndex';

// Gamification
import Journal from './pages/journal';
import LetItOut from './pages/LetItOut';
import GratitudeWall from './components/student/letItOut/gratitude_wall';


// Community Chat
import ChatApp from "./components/student/community/ChatApp";

// Spinner (NEW)
import Spinner from "./components/student/spinner/spinner"; // Import the Spinner component

// Chatbot
import Chatbot from "./components/student/chatbot/chatbot";

// Curated
import CuratedLanding from "./components/student/curated_spaces/curatedlanding";
import CuratedSpace from "./components/student/curated_spaces/curated_spaces";

// Animated Background
import AnimatedBackground from "./components/AnimatedBackground"; // Import the AnimatedBackground component



// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  const [assistantMessage] = useState("Welcome back! How are you feeling today?");
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            {/* Add the AnimatedBackground here */}
            <AnimatedBackground />
             

            <Routes>
              {/* Gamification Routes */}
              <Route path="/journal" element={<Journal />} />
              <Route path="/let-it-out" element={<LetItOut />} />
              <Route path="/gratitude-wall" element={<GratitudeWall />} />
s
              {/* Community Chat */}
              <Route path="/community-chat" element={<ChatApp />} />

              {/* Feel Worthy Routes */}
              <Route path="/feel-worthy" element={<FeelWorthy />} />

              {/* Professional Routes */}
              <Route path="/helpline" element={<Helpline />} />
              <Route path="/contact-counsellor" element={<ContactCounsellor />} />
              <Route path="/contact-counsellor-form" element={<ContactCounsellorForm />} />

              {/* Questionnaire Routes */}
              <Route path="/questionnaire" element={<Questionnaire />} />
              <Route path="/login1" element={<Login1 />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <AdminDashboard1 />
                  </PrivateRoute>
                }
              />

              {/* Crisis Routes */}
              <Route path="/crisis" element={<Crisisquiz />} />
              <Route path="/login2" element={<Login2 />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute2>
                    <AdminDashboard2 />
                  </PrivateRoute2>
                }
              />

              {/* Default Route */}
              <Route path="/" element={<Home />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup/student" element={<StudentSignup />} />
              <Route path="/signup/counsellor" element={<CounsellorSignup />} />
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* Dashboard Routes */}
              <Route path="/counsellor-dashboard" element={<CounsellorDashboard />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />

              {/* Feature Routes */}
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/guided-meditations" element={<GuidedMeditations />} />
              <Route path="/exam-harmony" element={<ExamIndex />} />

              {/* Spinner Route (NEW) */}
              <Route path="/spinner" element={<Spinner />} />

              {/* Curated */}
              <Route path="/curated" element={<CuratedLanding />} />
              <Route path="/curated/:mood" element={<CuratedSpace />} />

              {/* Catch-all Route for Unknown Paths */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Chatbot />
            <AvatarAssistant message={assistantMessage} />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}


export default App;