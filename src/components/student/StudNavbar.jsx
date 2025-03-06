import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StudNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Close dropdown when clicking anywhere else
  const handleClickOutside = (event) => {
    if (!event.target.closest(".dropdown")) {
      setDropdownOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[#73C7C7] p-4 flex items-center justify-between shadow-md relative z-50">
      {/* Centered SOLACE Text */}
      <h1 className="text-white text-xl font-bold absolute left-1/2 transform -translate-x-1/2">
        SOLACE
      </h1>

      {/* Right Side: Emergency Button and User Dropdown */}
      <div className="flex items-center gap-4 ml-auto">
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
                    localStorage.removeItem("authToken");
                    sessionStorage.clear();
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