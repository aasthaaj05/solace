import React, { useEffect, useState } from "react";
import { auth, db, doc, setDoc, getDoc } from "../firebase";
import { useNavigate } from "react-router-dom";
import StudNavbar from "../components/student/StudNavbar";
import AnimatedBackground from "../components/AnimatedBackground";
import {
  FaQuoteLeft, FaCalendar, FaTasks, 
  FaHeart, FaComments, FaCloud, 
  FaUsers, FaBriefcase, FaChevronDown, 
  FaBook, FaChartLine, FaSmile, FaGift, FaSpinner
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
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  // Change quotes every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    }, 7000);

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

  // Categories with their respective features
  const categories = {
    examHarmony: [
      {
        id: "exams",
        title: "Exam Harmony",
        icon: <FaCalendar size={20} />,
        description: "Manage exam schedules and reduce stress",
        path: "/exam-harmony"
      }
    ],
    selfCare: [
      {
        id: "feelworthy",
        title: "Feelworthy",
        icon: <FaSmile size={20} />,
        description: "Boost your self-esteem and confidence",
        path: "/feel-worthy"
      },
      {
        id: "gratitudeJournal",
        title: "Gratitude Journal",
        icon: <FaHeart size={20} />,
        description: "Cultivate gratitude for better wellbeing",
        path: "/journal"
      },
      {
        id: "letItOut",
        title: "Let It Out",
        icon: <FaComments size={20} />,
        description: "Express your thoughts freely",
        path: "/let-it-out"
      },
      {
        id: "gratitudeWall",
        title: "Gratitude Wall",
        icon: <FaGift size={20} />,
        description: "Share and read gratitude notes",
        path: "/gratitude-wall"
      }
    ],
    dailyGoals: [
      {
        id: "yourPerspective",
        title: "Your Perspective",
        icon: <FaChartLine size={20} />,
        description: "Reflect on your daily goals and progress",
        path: "/crisis"
      },
      {
        id: "spinTheWheel",
        title: "Spin the Wheel",
        icon: <FaSpinner size={20} />,
        description: "Randomize your daily tasks for fun",
        path: "/spinner"
      }
    ],
    toolbox: [
      {
        id: "guidedMeditation",
        title: "Guided Meditation",
        icon: <FaCloud size={20} />,
        description: "Find calm with guided sessions",
        path: "/guided-meditations"
      },
      {
        id: "curatedSpaces",
        title: "Curated Spaces",
        icon: <FaBook size={20} />,
        description: "Explore curated resources for growth",
        path: "/curated"
      },
      {
        id: "communitySupport",
        title: "Community Support",
        icon: <FaUsers size={20} />,
        description: "Connect with peers for support",
        path: "/community-chat"
      },
      {
        id: "professionalResources",
        title: "Professional Resources",
        icon: <FaBriefcase size={20} />,
        description: "Access counselors and resources",
        path: "/helpline", // Default path
        dropdown: [
          {
            id: "contactCounselor",
            title: "Contact a Counselor",
            path: "/contact-counsellor" // Path to your existing page
          },
          {
            id: "helpline",
            title: "Helpline",
            path: "/helpline" // Existing helpline path
          }
        ]
      }
    ]
  };

  // Navigation handler
  const navigateTo = (path) => {
    navigate(path);
  };

  // Tabs for navigation
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <FaChartLine className="mr-2" /> },
    { id: "examHarmony", label: "Exam Harmony", icon: <FaCalendar className="mr-2" /> },
    { id: "selfCare", label: "Self-Care Zone", icon: <FaHeart className="mr-2" /> },
    { id: "dailyGoals", label: "Daily Goals", icon: <FaTasks className="mr-2" /> },
    { id: "toolbox", label: "Toolbox", icon: <FaBriefcase className="mr-2" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 z-0"></div>
      
      {/* Animated Background with reduced opacity */}
      <div className="fixed inset-0 z-0 opacity-20">
        <AnimatedBackground />
      </div>

      {/* Navbar */}
      <StudNavbar />

      {/* Hero Section */}
      <div className="relative w-full h-56 sm:h-64 bg-cover bg-center flex items-center justify-center">
        {/* Background Image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter brightness-75"
          style={{
            backgroundImage: "url(/images/student-quote-bg.jpg)",
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm"></div>
        
        {/* Content */}
        <div className="relative z-10 px-6 text-center max-w-3xl">
          <h1 className="text-3xl sm:text-4xl text-white font-bold mb-3">
            Welcome, {user?.displayName || "Student"}
          </h1>
          <div className="flex items-center justify-center text-white">
            <FaQuoteLeft className="text-xl mr-2 opacity-80" />
            <p className="text-lg font-medium italic">
              {currentQuote}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-20 bg-white shadow-md">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`py-4 px-6 flex items-center whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Dashboard Stats - Simplified */}
        {activeTab === "dashboard" && (
          <>
            {/* Quick Access Modules */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                categories.examHarmony[0], // Exam Harmony
                categories.toolbox[1],      // Curated Spaces
                categories.selfCare[0],     // Feelworthy
                categories.selfCare[1],     // Gratitude Journal
                categories.dailyGoals[1],   // Spin the Wheel
                categories.dailyGoals[0],   // Your Perspective
              ].map((feature) => (
                <div 
                  key={feature.id}
                  onClick={() => navigateTo(feature.path)}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center space-x-3"
                >
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{feature.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Category Views */}
        {activeTab !== "dashboard" && categories[activeTab] && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 capitalize">{activeTab} Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories[activeTab].map((feature) => (
                <div 
                  key={feature.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4">
                        {feature.icon}
                      </div>
                      <h3 className="font-bold text-lg text-gray-800">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-5">{feature.description}</p>

                    {/* Render dropdown if it exists */}
                    {feature.dropdown ? (
                      <div className="relative">
                        <button
                          onClick={() => navigateTo(feature.path)}
                          className="w-full py-2 rounded-lg bg-[#77C7C7] hover:bg-[#5CA9A9] text-white font-medium transition duration-200"
                        >
                          Open
                        </button>
                        <div className="mt-2">
                          <select
                            onChange={(e) => navigateTo(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#77C7C7]"
                          >
                            <option value={feature.path}>Select an option</option>
                            {feature.dropdown.map((option) => (
                              <option key={option.id} value={option.path}>
                                {option.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => navigateTo(feature.path)}
                        className="w-full py-2 rounded-lg bg-[#77C7C7] hover:bg-[#5CA9A9] text-white font-medium transition duration-200"
                      >
                        Open
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;