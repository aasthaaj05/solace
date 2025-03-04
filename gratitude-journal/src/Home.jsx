import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Your Journal 📖</h1>
      <Link to="/gratitude">
        <button className="nav-button">Gratitude Journal 🌞</button>
      </Link>
      <Link to="/let-it-out">
        <button className="nav-button">Let It Out 💬</button>
      </Link>
    </div>
  );
}

export default Home;
