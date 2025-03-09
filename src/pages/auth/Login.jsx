import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, signInWithEmailAndPassword } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [subPopup, setSubPopup] = useState("");
  const [thirdPopup, setThirdPopup] = useState("");
  const [popupHistory, setPopupHistory] = useState([]); // Track popup history

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const userId = userCredential.user.uid;

      // Check if the user is a student
      const studentRef = doc(db, "students", userId);
      const studentSnap = await getDoc(studentRef);

      // Check if the user is a counsellor
      const counsellorRef = doc(db, "counsellors", userId);
      const counsellorSnap = await getDoc(counsellorRef);

      if (studentSnap.exists()) {
        // User is a student
        localStorage.setItem("role", "student");
        setShowPopup(true); // Show mood selection popup
      } else if (counsellorSnap.exists()) {
        // User is a counsellor
        localStorage.setItem("role", "counsellor");
        navigate("/counsellor-dashboard"); // Redirect to counsellor dashboard
      } else {
        // User role not found
        throw new Error("User role not found. Please contact support.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelection = (mood) => {
    if (mood === "calm") {
      navigate("/student-dashboard");
    } else if (mood === "cheerful") {
      setSubPopup("cheerful");
      setPopupHistory([...popupHistory, "mood"]); // Add to history
    } else if (mood === "bit_low") {
      setSubPopup("bit_low");
      setPopupHistory([...popupHistory, "mood"]); // Add to history
    } else if (mood === "super_pumped") {
      setSubPopup("super_pumped");
      setPopupHistory([...popupHistory, "mood"]); // Add to history
    }
  };

  const handleBitLowSelection = (response) => {
    if (response === "yes") {
      setThirdPopup("yes");
      setPopupHistory([...popupHistory, "bit_low"]); // Add to history
    } else if (response === "no") {
      setThirdPopup("no");
      setPopupHistory([...popupHistory, "bit_low"]); // Add to history
    }
  };

  const handleSuperPumpedSelection = (option) => {
    if (option === "spin_the_chore") {
      navigate("/spinner");
    } else if (option === "opinion_hub") {
      navigate("/crisis");
    }
  };

  const handleCheerfulSelection = (option) => {
    if (option === "gratitude_wall") {
      navigate("/gratitude-wall");
    } else if (option === "gratitude_journal") {
      navigate("/journal");
    } else if (option === "feel_worthy") {
      navigate("/feel-worthy");
    }
  };

  const handleBitLowYesSelection = (option) => {
    if (option === "community_chat") {
      navigate("/community-chat");
    } else if (option === "professional_help") {
      navigate("/contact-counsellor");
    }
  };

  const handleBitLowNoSelection = (option) => {
    if (option === "let_it_out") {
      navigate("/let-it-out");
    } else if (option === "guided_meditation") {
      navigate("/guided-meditations");
    } else if (option === "curated_spaces") {
      navigate("/curated");
    }
  };

  const handleBack = () => {
    if (popupHistory.length > 0) {
      const lastPopup = popupHistory[popupHistory.length - 1];
      setPopupHistory(popupHistory.slice(0, -1)); // Remove last entry

      if (lastPopup === "mood") {
        setSubPopup("");
      } else if (lastPopup === "bit_low") {
        setThirdPopup("");
      }
    }
  };

  const handleClose = () => {
    navigate("/student-dashboard");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#F7CFD8] to-[#A6F1E0]">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold text-center text-[#73C7C7] mb-4">Welcome Back</h2>
        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#73C7C7] bg-[#F4F8D3] text-gray-700"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#73C7C7] bg-[#F4F8D3] text-gray-700"
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 text-white bg-[#73C7C7] rounded-lg font-semibold hover:bg-[#A6F1E0] transition-all"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Sign Up Options */}
        <p className="text-center text-sm text-gray-600 mt-4">Don't have an account?</p>
        <div className="flex justify-center mt-2 space-x-3">
          <button
            onClick={() => navigate("/signup/student")}
            className="px-4 py-2 text-white bg-[#73C7C7] rounded-lg font-semibold hover:bg-[#A6F1E0] transition-all"
          >
            Sign up as Student
          </button>
          <button
            onClick={() => navigate("/signup/counsellor")}
            className="px-4 py-2 text-white bg-[#73C7C7] rounded-lg font-semibold hover:bg-[#A6F1E0] transition-all"
          >
            Sign up as Counsellor
          </button>
        </div>
      </div>

      {/* Mood Selection Pop-up */}
      {showPopup && !subPopup && localStorage.getItem("role") === "student" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-2xl shadow-xl w-[420px] text-center relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black text-lg" onClick={handleClose}>✖</button>
            <h3 className="text-lg font-semibold text-black mb-4">🧐 How's your day going?</h3>
            <p className="text-sm text-gray-500 mb-6">Pick a mood below:</p>

            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 rounded-xl bg-[#FFDCDC] hover:bg-[#FFC4C4]" onClick={() => handleMoodSelection("cheerful")}>😊 Cheerful & Bright</button>
              <button className="p-4 rounded-xl bg-[#FFE6A7] hover:bg-[#FFD37A]" onClick={() => handleMoodSelection("calm")}>😌 Calm & Steady</button>
              <button className="p-4 rounded-xl bg-[#A7E6FF] hover:bg-[#7FD4FF]" onClick={() => handleMoodSelection("bit_low")}>😔 Feeling A Bit Low</button>
              <button className="p-4 rounded-xl bg-[#C8F7DC] hover:bg-[#A0EFC2]" onClick={() => handleMoodSelection("super_pumped")}>🤩 Super Pumped</button>
            </div>
          </div>
        </div>
      )}

      {/* Second-Level Popups */}
      {subPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-2xl shadow-xl w-[420px] text-center relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg" onClick={handleClose}>✖</button>
            <button className="absolute top-3 left-3 text-gray-500 hover:text-black text-lg" onClick={handleBack}>⬅ Back</button>

            {subPopup === "cheerful" && (
              <>
                <h3 className="text-lg font-semibold text-black mb-4">😊 How about...</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button className="p-4 w-full rounded-xl bg-[#FFDCDC] hover:bg-[#FFC4C4]" onClick={() => handleCheerfulSelection("gratitude_wall")}>Gratitude Wall</button>
                  <button className="p-4 w-full rounded-xl bg-[#FFE6A7] hover:bg-[#FFD37A]" onClick={() => handleCheerfulSelection("gratitude_journal")}>Gratitude Journal</button>
                  <button className="p-4 w-full rounded-xl bg-[#A7E6FF] hover:bg-[#7FD4FF]" onClick={() => handleCheerfulSelection("feel_worthy")}>Feel Worthy</button>
                </div>
              </>
            )}

            {subPopup === "bit_low" && !thirdPopup && (
              <>
                <h3 className="text-lg font-semibold text-black mb-4">🤔 Want to talk to someone?</h3>
                <button className="p-4 w-full rounded-xl bg-[#FFDCDC] hover:bg-[#FFC4C4] mb-2" onClick={() => handleBitLowSelection("yes")}>✅ Yes</button>
                <button className="p-4 w-full rounded-xl bg-[#A7E6FF] hover:bg-[#7FD4FF]" onClick={() => handleBitLowSelection("no")}>❌ No</button>
              </>
            )}

            {thirdPopup === "yes" && (
              <>
                <h3 className="text-lg font-semibold text-black mb-4">💬 Who would you like to talk to?</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button className="p-4 w-full rounded-xl bg-[#FFDCDC] hover:bg-[#FFC4C4]" onClick={() => handleBitLowYesSelection("community_chat")}>Community Chat</button>
                  <button className="p-4 w-full rounded-xl bg-[#FFE6A7] hover:bg-[#FFD37A]" onClick={() => handleBitLowYesSelection("/contact-counsellor")}>Contact counsellor</button>
                </div>
              </>
            )}

            {thirdPopup === "no" && (
              <>
                <h3 className="text-lg font-semibold text-black mb-4">🎵 What would you like to do?</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button className="p-4 w-full rounded-xl bg-[#FFDCDC] hover:bg-[#FFC4C4]" onClick={() => handleBitLowNoSelection("let_it_out")}>Let It Out</button>
                  <button className="p-4 w-full rounded-xl bg-[#FFE6A7] hover:bg-[#FFD37A]" onClick={() => handleBitLowNoSelection("guided_meditation")}>Guided Meditation</button>
                  <button className="p-4 w-full rounded-xl bg-[#A7E6FF] hover:bg-[#7FD4FF]" onClick={() => handleBitLowNoSelection("curated_spaces")}>Curated Spaces</button>
                </div>
              </>
            )}

            {subPopup === "super_pumped" && (
              <>
                <h3 className="text-lg font-semibold text-black mb-4">🤩 What would you like to do?</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button className="p-4 w-full rounded-xl bg-[#FFDCDC] hover:bg-[#FFC4C4]" onClick={() => handleSuperPumpedSelection("spin_the_chore")}>Spin the Chore</button>
                  <button className="p-4 w-full rounded-xl bg-[#FFE6A7] hover:bg-[#FFD37A]" onClick={() => handleSuperPumpedSelection("opinion_hub")}>Opinion Hub</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;