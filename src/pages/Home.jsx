import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1 className="text-2xl">Welcome to the Mental Health App</h1>
      <p>Select an option below:</p>
      <Link to="/login">Login</Link> | <Link to="/signup/student">Sign Up as Student</Link> | <Link to="/signup/counsellor">Sign Up as Counsellor</Link>
    </div>
  );
};

export default Home;
