import React, { useEffect, useState } from "react";
import { auth, db, doc, setDoc, getDoc } from "../firebase";
import { useNavigate } from "react-router-dom";
import StudNavbar from "../components/student/StudNavbar";
import AnimatedBackground from "../components/AnimatedBackground";
import {
  FaQuoteLeft, FaCalendar, FaTasks, FaBrain, FaRedoAlt, FaHeart, FaComments, FaSmile, FaHandsHelping, FaCloud, FaMusic, FaUsers, FaBriefcase,
} from "react-icons/fa";

// Sample quotes for the hero section
const quotes = [
  "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
  "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
  "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice, and most of all, love of what you are doing. - Pelé",
  "The roots of education are bitter, but the fruit is sweet. - Aristotle",
];

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const navigate = useNavigate();

  // Change quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle user authentication and data fetching
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userRef = doc(db, "students", user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          await setDoc(userRef, { email: user.email, name: user.displayName });
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Navigation handlers
  const handleGuidedMeditationClick = () => {
    navigate("/guided-meditations");
  };

  const handleExamClick = () => {
    navigate("/exam-harmony");
  };

  const handleJournalClick = () => {
    navigate("/journal");
  };

  const handleLetItOutClick = () => {
    navigate("/let-it-out");
  };

  const handleWallClick = () => {
    navigate("/gratitude-wall");
  };

  const handleCommunityClick = () => {
    navigate("/community-chat");
  };

  const handleQuestionnaireClick = () => {
    navigate("/questionnaire");
  };

  const handleCrisisClick = () => {
    navigate("/crisis");
  };

  const handleHelplineClick = () => {
    navigate("/helpline");
  };

  const handleContactCounsellorClick = () => {
    navigate("/contact-counsellor");
  };

  const handleFeelWorthyClick = () => {
    navigate("/feel-worthy");
  };

  // Toggle dropdown visibility
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Stop event propagation
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (!event.target.closest(".professional-resources-dropdown")) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Reusable button component
  const DashboardButton = ({ icon, text, onClick }) => (
    <button
      className="bg-[#E0F2FE] text-black font-semibold px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm hover:shadow-md transition duration-200 flex items-center justify-center gap-2"
      onClick={onClick}
    >
      {icon}
      <span className="text-xs sm:text-sm">{text}</span>
    </button>
  );

  return (
    <div
      className="min-h-screen flex flex-col relative bg-gradient-to-r from-[#F7CFD8] to-[#A6F1E0]"
      // style={{
      //   background: "linear-gradient(135deg, #F7CFD8, #F4F8D3, #A6F1E0, #73C7C7)",
      // }}
    >
      {/* Animated Background for the Entire Page */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>

      {/* Navbar */}
      <StudNavbar />

      {/* Hero Section */}
      <div
  className="relative w-full min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] bg-cover bg-center flex items-center justify-center"
  style={{
    backgroundImage: "url(/images/student-quote-bg.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Overlay for better readability */}
  <div className="absolute inset-0 bg-black bg-opacity-30"></div>

  {/* Welcome Message */}
  <h1 className="relative z-10 text-2xl sm:text-3xl md:text-4xl text-white font-bold text-center px-4">
    Welcome, {user?.displayName || "Student"}!
  </h1>

  {/* Quotes Section */}
  <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 z-10 text-center text-white px-4">
    <FaQuoteLeft className="text-3xl sm:text-4xl md:text-5xl mx-auto mb-2 sm:mb-4" />
    <p className="text-lg sm:text-xl md:text-2xl font-semibold max-w-2xl mx-auto">
      {currentQuote}
    </p>
  </div>
</div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 md:space-y-0 md:space-x-8 relative z-10">
        {/* Left Column */}
        <div className="w-full md:w-1/2 space-y-6 sm:space-y-8">
          {/* Exam Harmony Section */}
          <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-white/10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-4 sm:mb-6 flex items-center gap-2">
              📚 Exam Harmony
            </h2>
            <button
              className="w-full bg-[#DBEAFE] text-black font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center gap-2"
              onClick={handleExamClick}
            >
              <FaCalendar className="text-lg sm:text-xl" />
              <span className="text-sm sm:text-lg md:text-xl">Sync your Exams</span>
            </button>
          </div>

          {/* Self-Care Zone Section */}
          <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-white/10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-4 sm:mb-6">
              💗 Self-Care Zone
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
                { icon: <FaHeart className="text-black" />, text: "Gratitude Journal", onClick: handleJournalClick },
                { icon: <FaComments className="text-black" />, text: "Let It Out", onClick: handleLetItOutClick },
                { icon: <FaSmile className="text-black" />, text: "Gratitude Wall", onClick: handleWallClick },
                { icon: <FaHandsHelping className="text-black" />, text: "Feel Worthy", onClick: handleFeelWorthyClick },
              ].map((item, index) => (
                <DashboardButton key={index} {...item}  />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2 space-y-6 sm:space-y-8">
          {/* Daily Goals Section */}
          <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-white/10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-4 sm:mb-6">
              🎯 Daily Goals
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[
                { icon: <FaTasks className="text-black" />, text: "Opinion Hub", onClick: handleQuestionnaireClick },
                { icon: <FaBrain className="text-black" />, text: "Your Perspective", onClick: handleCrisisClick },
                { icon: <FaRedoAlt className="text-black" />, text: "Chore Roulette" },
              ].map((item, index) => (
                <DashboardButton key={index} {...item} />
              ))}
            </div>
          </div>

          {/* Toolbox Section */}
          <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-white/10 relative overflow-visible">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-4 sm:mb-6">
              🛠️ Toolbox
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { icon: <FaCloud className="text-black" />, text: "Guided Meditation", onClick: handleGuidedMeditationClick },
                { icon: <FaMusic className="text-black" />, text: "Music", onClick: () => {} },
                { icon: <FaUsers className="text-black" />, text: "Community Support", onClick: () => {} },
                {
                  icon: <FaBriefcase className="text-black" />,
                  text: "Professional Resources",
                  onClick: toggleDropdown, // Use toggleDropdown here
                },
              ].map((item, index) => (
                <DashboardButton key={index} {...item} />
              ))}
            </div>

            {/* Professional Resources Dropdown */}
            {isDropdownOpen && (
              <div className="absolute z-[1000] mt-2 w-40 bg-white rounded-lg shadow-lg professional-resources-dropdown right-0">
                <ul className="text-gray-700">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition duration-200"
                    onClick={handleHelplineClick}
                  >
                    Helpline Numbers
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition duration-200"
                    onClick={handleContactCounsellorClick}
                  >
                    Contact a Counsellor
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;