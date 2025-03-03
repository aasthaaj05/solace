import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-[#73C7C7] px-4 py-3 flex items-center justify-between">
      {/* Brand */}
      <div className="text-white font-bold text-4xl">Solace</div>
      
      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        <Link to="/home" className="text-white font-semibold px-4 py-1 hover:text-[#F4F8D3] transition">
          Home
        </Link>
        <Link to="/counselor" className="text-white font-semibold px-4 py-1 hover:text-[#F4F8D3] transition">
          Counselor
        </Link>
        <Link to="/community" className="text-white font-semibold px-4 py-1 hover:text-[#F4F8D3] transition">
          Community Forum
        </Link>
        <Link to="/faqs" className="text-white font-semibold px-4 py-1 hover:text-[#F4F8D3] transition">
          FAQs
        </Link>
        <Link to="/login" className="bg-[#F7CFD8] text-black font-bold px-4 py-1 rounded-md font-medium hover:bg-[#F4F8D3] transition">
          Login
        </Link>
        <Link to="/signup" className="bg-[#F7CFD8] text-black font-bold px-4 py-1 rounded-md font-medium hover:bg-[#F4F8D3] transition">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;