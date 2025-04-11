import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase"; // Ensure correct import
import { onAuthStateChanged } from "firebase/auth"; // Listen for user changes

const StudNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [coins, setCoins] = useState(0); // Store user's coins
  const [user, setUser] = useState(null); // Store authenticated user
  const navigate = useNavigate();

  // Wait for user authentication before fetching coins
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchCoins(currentUser.uid);
      } else {
        setUser(null);
        setCoins(0); // Reset coins when logged out
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Fetch user's coins from Firestore
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
    <nav className="bg-[#73C7C7] p-4 flex items-center justify-between shadow-md relative z-50">
      <h1 className="text-white text-xl font-bold absolute left-1/2 transform -translate-x-1/2">
        SOLACE
      </h1>

      <div className="flex items-center gap-6 ml-auto">
        {/* Coins Section (Only show if user is logged in) */}
        {user && (
          <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
            <span className="font-bold">💰 {coins} Coins</span>
          </div>
        )}

        {/* Emergency Button */}
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-200"
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
    </nav>
  );
};

export default StudNavbar;
