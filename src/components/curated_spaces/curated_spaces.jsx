import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import YouTubePlayer from "./youtube_player";
import "./curated_spaces.css";

const videos = {
  focus: "WPni755-Krg",
  calm_relax: "3jWRrafhO7M",
  motivation_boost: "L_jWHffIx5E",
  sleep_unwind: "2OEL4P1Rz04",
  meditation: "ZToicYcHIOU",
  positivity_confidence: "3GwjfUFyY6M",
  break_recharge: "fLexgOxsZu0",
  emotional_release: "kJQP7kiw5Fk",
  morning_energy: "CevxZvSJLk8",
  gratitude_reflection: "RgKAFK5djSk",
  rainy_day: "5qap5aO4i9A",
  creative_flow: "hHW1oY26kxQ",
};

const moodTitles = {
  focus: "Focus Mode",
  calm_relax: "Calm & Relax",
  motivation_boost: "Motivation Boost",
  sleep_unwind: "Sleep & Unwind",
  meditation: "Mindfulness & Meditation",
  positivity_confidence: "Positivity & Confidence",
  break_recharge: "Break & Recharge",
  emotional_release: "Emotional Release",
  morning_energy: "Morning Energy",
  gratitude_reflection: "Gratitude & Reflection",
  rainy_day: "Rainy Day Comfort",
  creative_flow: "Creative Flow",
};

const CuratedSpace = () => {
  const { mood } = useParams();
  const navigate = useNavigate();
  const videoId = videos[mood];
  const title = moodTitles[mood] || "Music Space";

  // 🎯 Pomodoro Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [streak, setStreak] = useState(parseInt(localStorage.getItem("streak")) || 0); // Get streak from local storage

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          if (!isBreak) {
            setStreak((prevStreak) => {
              const newStreak = prevStreak + 1;
              localStorage.setItem("streak", newStreak); // Save to local storage
              return newStreak;
            });
          }
          setIsBreak((prevBreak) => !prevBreak); // Toggle break/work
          return isBreak ? 25 * 60 : 5 * 60; // 5-min break, then back to work
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, isBreak]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  return (
    <div className="curated-space">
      <div className="content">
      <div className="timer-box">
  {/* Title and Streak Container */}
  <div className="title-streak-container">
    <h1 className="timer-title">{title} 🎶</h1>
    <div className="streak-container">
      <span className="streak-icon">🔥</span>
      <span className="streak-counter">{streak}</span>
    </div>
  </div>

  <div className="timer-display-container">
    <h2 className="timer-display">{formatTime(timeLeft)}</h2>
    <p className="timer-mode">{isBreak ? "☕ Break Time" : "🎯 Focus Time"}</p>
  </div>

  {/* Timer Buttons */}
  <div className="timer-buttons">
    <button
      className={`timer-button ${isRunning ? "pause-button" : "start-button"}`}
      onClick={() => setIsRunning(!isRunning)}
    >
      {isRunning ? "Pause" : "Start"}
    </button>
    <button className="reset-button" onClick={handleReset}>
      Reset
    </button>
  </div>
  <button className="exit-button" onClick={() => navigate("/curated")}>
    Exit
  </button>
</div>
        {/* Video Section */}
        <div className="video-box">
          {videoId ? <YouTubePlayer videoId={videoId} /> : <p>Video not found.</p>}
        </div>
      </div>
    </div>
  );
};

export default CuratedSpace;