import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBars, FaTimes, FaHome, FaInfoCircle, FaCogs, FaQuestionCircle, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const Home = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = (event) => {
      event.preventDefault();
      const targetId = event.currentTarget.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for navbar height
          behavior: "smooth",
        });
      }
    };

    const links = document.querySelectorAll(".nav-link");
    links.forEach((link) => link.addEventListener("click", handleScroll));
    return () => links.forEach((link) => link.removeEventListener("click", handleScroll));
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white flex justify-between items-center px-6 py-4 z-50">
        <h1 className="text-2xl font-bold text-[#73C7C7]">SOLACE</h1>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleNav} className="text-[#73C7C7] focus:outline-none">
            {isNavOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <div className={`space-x-6 hidden md:flex ${isNavOpen ? "hidden" : ""}`}>
          <a href="#home" className="nav-link text-gray-700 hover:text-[#73C7C7] cursor-pointer flex items-center gap-2">
            <FaHome /> Home
          </a>
          <a href="#about" className="nav-link text-gray-700 hover:text-[#73C7C7] cursor-pointer flex items-center gap-2">
            <FaInfoCircle /> About Us
          </a>
          <a href="#services" className="nav-link text-gray-700 hover:text-[#73C7C7] cursor-pointer flex items-center gap-2">
            <FaCogs /> Services
          </a>
          <a href="#faqs" className="nav-link text-gray-700 hover:text-[#73C7C7] cursor-pointer flex items-center gap-2">
            <FaQuestionCircle /> FAQs
          </a>
        </div>

        {/* Login/Signup Buttons
        <div className="space-x-4 hidden md:flex">
          <Link to="/login" className="bg-[#73C7C7] text-white px-4 py-2 rounded-lg hover:bg-[#A6F1E0] transition flex items-center gap-2">
            <FaSignInAlt /> Login
          </Link>
          <Link to="/signup/student" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition flex items-center gap-2">
            <FaUserPlus /> Sign Up as Student
          </Link>
          <Link to="/signup/counsellor" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition flex items-center gap-2">
            <FaUserPlus /> Sign Up as Counsellor
          </Link>
        </div> */}

        {/* Mobile Nav Links */}
        {isNavOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-4">
            <a href="#home" className="nav-link text-gray-700 hover:text-[#73C7C7] py-2 flex items-center gap-2">
              <FaHome /> Home
            </a>
            <a href="#about" className="nav-link text-gray-700 hover:text-[#73C7C7] py-2 flex items-center gap-2">
              <FaInfoCircle /> About Us
            </a>
            <a href="#services" className="nav-link text-gray-700 hover:text-[#73C7C7] py-2 flex items-center gap-2">
              <FaCogs /> Services
            </a>
            <a href="#faqs" className="nav-link text-gray-700 hover:text-[#73C7C7] py-2 flex items-center gap-2">
              <FaQuestionCircle /> FAQs
            </a>
            <Link to="/login" className="bg-[#73C7C7] text-white px-4 py-2 rounded-lg mt-4 hover:bg-[#A6F1E0] transition flex items-center gap-2">
              <FaSignInAlt /> Login
            </Link>
            <Link to="/signup/student" className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-green-400 transition flex items-center gap-2">
              <FaUserPlus /> Sign Up as Student
            </Link>
            <Link to="/signup/counsellor" className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-blue-400 transition flex items-center gap-2">
              <FaUserPlus /> Sign Up as Counsellor
            </Link>
          </div>
        )}
      </nav>

      {/* Sections */}
      <section
        id="home"
        className="flex flex-col items-center justify-center min-h-screen pt-20"
        style={{
          background: "linear-gradient(135deg, #F7CFD8, #F4F8D3, #A6F1E0, #73C7C7)",
        }}
      >
        <h2 className="text-4xl font-bold text-[#73C7C7] mb-4">Welcome to Our Platform</h2>
        <p className="text-lg text-gray-700 mb-8">Choose an option to get started:</p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link to="/login" className="bg-[#73C7C7] text-white px-6 py-3 rounded-lg hover:bg-[#A6F1E0] transition flex items-center gap-2">
            <FaSignInAlt /> Login
          </Link>
          <Link to="/signup/student" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-400 transition flex items-center gap-2">
            <FaUserPlus /> Sign Up as Student
          </Link>
          <Link to="/signup/counsellor" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-400 transition flex items-center gap-2">
            <FaUserPlus /> Sign Up as Counsellor
          </Link>
        </div>
      </section>

      <section id="about" className="min-h-screen flex flex-col items-center justify-center bg-[#F4F8D3] p-10">
        <h2 className="text-4xl font-bold text-[#73C7C7] mb-8">About Us</h2>
        <p className="text-lg text-gray-700 max-w-2xl text-center">
          We are dedicated to providing mental health support and resources to students and counsellors. Our platform connects you with the tools and professionals you need to thrive.
        </p>
      </section>

      <section id="services" className="min-h-screen flex flex-col items-center justify-center bg-[#A6F1E0] p-10">
        <h2 className="text-4xl font-bold text-[#73C7C7] mb-8">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-[#73C7C7] mb-2">Counselling</h3>
            <p className="text-gray-700">Connect with professional counsellors for personalized support.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-[#73C7C7] mb-2">Resources</h3>
            <p className="text-gray-700">Access a library of mental health resources and tools.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-[#73C7C7] mb-2">Community</h3>
            <p className="text-gray-700">Join a supportive community of students and professionals.</p>
          </div>
        </div>
      </section>

      <section id="faqs" className="min-h-screen flex flex-col items-center justify-center bg-[#73C7C7] p-10">
        <h2 className="text-4xl font-bold text-white mb-8">FAQs</h2>
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-[#73C7C7]">How do I sign up?</h3>
            <p className="text-gray-700">Click on the "Sign Up" button and choose your role (Student or Counsellor).</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-[#73C7C7]">Is the platform free?</h3>
            <p className="text-gray-700">Yes, our platform is free for students. Counsellors may have premium features.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#73C7C7]">How do I contact support?</h3>
            <p className="text-gray-700">You can reach out to us via the "Contact Us" page or email support@solace.com.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;