import React, { useState } from "react";
import { FaUserCircle, FaBars, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
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
    <nav className="bg-white p-4 flex items-center justify-between shadow-md">
      <FaBars
        className="text-[#73C7C7] text-2xl cursor-pointer"
        onClick={toggleSidebar}
      />
      <h1 className="text-[#073C7C] text-xl font-bold">SOLACE</h1>
      <div className="flex items-center gap-4">
        <FaCalendarAlt
          className="text-[#73C7C7] text-2xl cursor-pointer"
          onClick={() => navigate("/calendar")}
        />
        <div className="relative dropdown">
          <FaUserCircle
            className="text-[#73C7C7] text-3xl cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#F4F8D3] rounded shadow-lg">
              <ul className="text-gray-700">
                <li
                  className="px-4 py-2 hover:bg-[#F7CFD8] cursor-pointer"
                  onClick={() => navigate("/change-password")}
                >
                  Change Password
                </li>
                <li
                  className="px-4 py-2 hover:bg-[#F7CFD8] cursor-pointer"
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

export default Navbar;
