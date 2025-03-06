import React, { useEffect, useState } from "react";
import { auth, db, doc, setDoc, getDoc } from "../firebase";
import { useNavigate } from "react-router-dom";
import StudNavbar from "../components/student/StudNavbar";
import AnimatedBackground from "../components/AnimatedBackground"; 
import { motion } from "framer-motion";
import {
  FaQuoteLeft,
  FaCalendar,
  FaTasks,
  FaBrain,
  FaRedoAlt,
  FaHeart,
  FaComments,
  FaSmile,
  FaHandsHelping,
  FaCloud,
  FaMusic,
  FaUsers,
  FaBriefcase,
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
  const navigate = useNavigate();

  // Change quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col relative"
    >
      {/* Animated Background for the Entire Page */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>

      {/* Navbar */}
      <StudNavbar />

      {/* Hero Section */}
      <div
        className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url(/images/student-quote-bg.jpg)", // Path relative to the public folder
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        {/* Welcome Message */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-2xl sm:text-3xl md:text-4xl text-white font-bold flex items-center gap-2 text-center"
        >
          Welcome, {user?.displayName || "Student"}!
        </motion.h1>

        {/* Quotes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute bottom-4 sm:bottom-8 left-0 right-0 z-10 text-center text-white px-4"
        >
          <FaQuoteLeft className="text-3xl sm:text-4xl md:text-5xl mx-auto mb-2 sm:mb-4" />
          <p className="text-lg sm:text-xl md:text-2xl font-semibold max-w-2xl mx-auto">
            {currentQuote}
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 md:space-y-0 md:space-x-8 relative z-10">
        {/* Left Column */}
        <div className="w-full md:w-1/2 space-y-6 sm:space-y-8">
          {/* Exam Harmony Section */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="bg-white/50 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-white/10"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-4 sm:mb-6 flex items-center gap-2">
              📚 Exam Harmony
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-[#DBEAFE] text-black font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <FaCalendar className="text-lg sm:text-xl" />
              <span className="text-sm sm:text-lg md:text-xl">Sync your Exams</span>
            </motion.button>
          </motion.div>

          {/* Self-Care Zone Section */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="bg-white/50 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-white/10"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-4 sm:mb-6">
              💗 Self-Care Zone
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { icon: <FaHeart className="text-black" />, text: "Gratitude Journal" },
                { icon: <FaComments className="text-black" />, text: "Let It Out" },
                { icon: <FaSmile className="text-black" />, text: "Gratitude Wall" },
                { icon: <FaHandsHelping className="text-black" />, text: "Feel Worthy" },
              ].map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#E0F2FE] text-black font-semibold px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm hover:shadow-md transition duration-200 flex items-center justify-center gap-2"
                >
                  {item.icon}
                  <span className="text-xs sm:text-sm">{item.text}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2 space-y-6 sm:space-y-8">
          {/* Daily Goals Section */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="bg-white/50 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-white/10"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-4 sm:mb-6">
              🎯 Daily Goals
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[
                { icon: <FaTasks className="text-black" />, text: "Opinion Hub" },
                { icon: <FaBrain className="text-black" />, text: "Your Perspective" },
                { icon: <FaRedoAlt className="text-black" />, text: "Chore Roulette" },
              ].map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#E0F2FE] text-black font-semibold px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm hover:shadow-md transition duration-200 flex items-center justify-center gap-2"
                >
                  {item.icon}
                  <span className="text-xs sm:text-sm">{item.text}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Toolbox Section */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="bg-white/50 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-white/10"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-4 sm:mb-6">
              🛠️ Toolbox
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { icon: <FaCloud className="text-black" />, text: "Guided Meditation" },
                { icon: <FaMusic className="text-black" />, text: "Music" },
                { icon: <FaUsers className="text-black" />, text: "Community Support" },
                { icon: <FaBriefcase className="text-black" />, text: "Professional Resources" },
              ].map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#E0F2FE] text-black font-semibold px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm hover:shadow-md transition duration-200 flex items-center justify-center gap-2"
                >
                  {item.icon}
                  <span className="text-xs sm:text-sm">{item.text}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;