import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';

// Placeholder pages
const Home = () => <div className="p-4">Home Page</div>;
const Counselor = () => <div className="p-4">Counselor Page</div>;
const Community = () => <div className="p-4">Community Forum Page</div>;
const FAQs = () => <div className="p-4">FAQs Page</div>;
const Login = () => <div className="p-4">Login Page</div>;
const Signup = () => <div className="p-4">Sign Up Page</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F4F8D3]">
        <Navbar />
        <Routes>
          
          <Route path="/home" element={<Home />} />
          <Route path="/counselor" element={<Counselor />} />
          <Route path="/community" element={<Community />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;