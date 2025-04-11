import React, { useState, useEffect } from "react";
import { FaUserCircle, FaHome, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase"; // Ensure correct import
import { onAuthStateChanged } from "firebase/auth"; // Listen for user changes
import AvatarAssistant from "./AvatarAssistant"; // Adjust path if needed


const StudNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [coins, setCoins] = useState(0);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchCoins(currentUser.uid);
      } else {
        setUser(null);
        setCoins(0);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCoins = async (userId) => {
    try {
      const userCoinsRef = doc(db, "coins", userId);
      const docSnap = await getDoc(userCoinsRef);

      if (docSnap.exists()) {
        setCoins(docSnap.data().coins);
      }
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
  };

  return (
    <nav className="bg-[#73C7C7] p-4 shadow-md relative z-50">
      <div className="flex items-center justify-between">
        {/* Left Section: Home Icon and Title */}
        <div className="flex items-center gap-4">
          <FaHome
            className="text-white text-2xl cursor-pointer hover:text-[#F4F8D3] transition duration-200"
            onClick={() => navigate("/student-dashboard")}
          />
          <h1 className="text-white text-xl font-bold">SOLACE</h1>
        </div>

        {/* Mobile Menu Toggle */}
        <FaBars
          className="text-white text-2xl md:hidden cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Right Section (md and up) */}
        <div className="hidden md:flex items-center gap-6">
          {user && (
            <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg flex items-center gap-2 shadow-md text-sm">
              <span className="font-bold">💰 {coins} Coins</span>
            </div>
          )}

          <button 
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-200 text-sm"
            onClick={() => alert("Emergency Assistance Activated!")}
          >
            Emergency
          </button>

          {/* User Dropdown */}
          <div className="relative dropdown">
            <FaUserCircle
              className="text-white text-3xl cursor-pointer hover:text-[#F4F8D3] transition duration-200"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#F4F8D3] rounded shadow-lg z-[1000]">
                <ul className="text-gray-700">
                  <li
                    className="px-4 py-2 hover:bg-[#F7CFD8] cursor-pointer transition duration-200"
                    onClick={() => navigate("/change-password")}
                  >
                    Change Password
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-[#F7CFD8] cursor-pointer transition duration-200"
                    onClick={() => {
                      auth.signOut();
                      navigate("/login");
                    }}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="flex flex-col gap-4 mt-4 md:hidden">
          {user && (
            <div className="bg-yellow-400 text-gray-900 px-3 py-2 rounded-lg flex items-center justify-center gap-2 shadow-md text-sm">
              <span className="font-bold">💰 {coins} Coins</span>
            </div>
          )}

          <button 
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-200 text-sm"
            onClick={() => alert("Emergency Assistance Activated!")}
          >
            Emergency
          </button>

          <div className="flex justify-center gap-4">
            <FaUserCircle
              className="text-white text-3xl cursor-pointer hover:text-[#F4F8D3] transition duration-200"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
          </div>

          {dropdownOpen && (
            <div className="mt-2 w-full bg-[#F4F8D3] rounded shadow-lg text-center">
              <ul className="text-gray-700">
                <li
                  className="px-4 py-2 hover:bg-[#F7CFD8] cursor-pointer transition duration-200"
                  onClick={() => navigate("/change-password")}
                >
                  Change Password
                </li>
                <li
                  className="px-4 py-2 hover:bg-[#F7CFD8] cursor-pointer transition duration-200"
                  onClick={() => {
                    auth.signOut();
                    navigate("/login");
                  }}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default StudNavbar;
