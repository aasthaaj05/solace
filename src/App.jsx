


import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Chatbot from "./components/chatbot/chatbot";
import Spinner from "./components/spinner/spinner";
import CuratedLanding from "./components/curated_spaces/curatedlanding";
import CuratedSpace from "./components/curated_spaces/curated_spaces"; // Page for playing YouTube playlists
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav>
          <ul>
            <li><Link to="/">🎡 Spin the Wheel</Link></li>
            <li><Link to="/curated">🎵 Curated Spaces</Link></li>
          </ul>
        </nav>

        {/* Routes for different pages */}
        <Routes>
          <Route path="/" element={
            <>
              <h1>🎡 Spin the Wheel 🎡</h1>
              <Spinner />
            </>
          } />
          <Route path="/curated" element={<CuratedLanding />} />
          <Route path="/curated/:mood" element={<CuratedSpace />} />
        </Routes>

        {/* Chatbot will be present on all pages */}
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
