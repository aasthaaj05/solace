import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App"; // Gratitude Journal Page
import LetItOut from "./LetItOut"; // Let It Out Page
import Home from "./Home"; // (Optional) Home Page
import "./index.css"; 
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />  {/* Optional Home Page */}
        <Route path="/gratitude" element={<App />} />  {/* Gratitude Journal */}
        <Route path="/let-it-out" element={<LetItOut />} />  {/* Let It Out Page */}
      </Routes>
    </Router>
  </React.StrictMode>
);
