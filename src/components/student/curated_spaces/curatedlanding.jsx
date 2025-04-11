import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./curatedlanding.css";
import StudNavbar from "../StudNavbar";

const moods = [
  { key: "focus", label: "Focus Mode", description: "Lo-fi, Instrumental", image: "/images/focus.jpeg" },
  { key: "calm_relax", label: "Calm & Relax", description: "Acoustic, Ambient", image: "/images/relax.jpeg" },
  { key: "motivation_boost", label: "Motivation Boost", description: "Upbeat, Energetic", image: "/images/motivation.jpeg" },
  { key: "sleep_unwind", label: "Sleep & Unwind", description: "White Noise, Soft", image: "/images/sleep.jpeg" },
  { key: "meditation", label: "Mindfulness & Meditation", description: "Guided, Zen", image: "/images/meditation.jpeg" },
  { key: "positivity_confidence", label: "Positivity & Confidence", description: "Empowering, Uplifting", image: "/images/positivity.jpeg" },
  { key: "break_recharge", label: "Break & Recharge", description: "Fun, Lighthearted", image: "/images/break.jpeg" },
  { key: "emotional_release", label: "Emotional Release", description: "Soothing, Reflective", image: "/images/emotional.jpeg" },
  { key: "morning_energy", label: "Morning Energy", description: "Refreshing, Peaceful", image: "/images/morning.jpeg" },
  { key: "gratitude_reflection", label: "Gratitude & Reflection", description: "Warm, Mellow", image: "/images/gratitude.jpeg" },
  { key: "rainy_day", label: "Rainy Day Comfort", description: "Cozy, Soothing, Rain Sounds", image: "/images/rainy.jpeg" },
  { key: "creative_flow", label: "Creative Flow", description: "Experimental, Inspiring", image: "/images/creative.jpeg" },
];

const CuratedLanding = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredMoods = moods.filter((mood) =>
    mood.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
     {/* Navbar */}
     <StudNavbar />
   
    <div className="curated-container1">
      <h1>🎵 Find Your Mood Space 🎵</h1>

      <input
        type="text"
        placeholder="🔍 Search spaces..."
        className="search-bar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid-container">
        {filteredMoods.length > 0 ? (
          filteredMoods.map((mood) => (
            <div
              key={mood.key}
              className="curated-card"
              onClick={() => navigate(`/curated/${mood.key}`)}
            >
              <img src={mood.image} alt={mood.label} className="mood-image" />
              <div className="card-content">
                <h3>{mood.label}</h3>
                <p className="mood-description">{mood.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">😢 No spaces found...</p>
        )}
      </div>
    </div>
    </>
  );
};

export default CuratedLanding;
