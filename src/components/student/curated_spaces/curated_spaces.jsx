import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import YouTubePlayer from "./youtube_player";
import "./curated_spaces.css";

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

const videos = {
    focus: "WPni755-Krg",
    calm_relax: "1ZYbU82GVz4",
    motivation_boost: "nuv1oOgzLKQ",
    sleep_unwind: "2OEL4P1Rz04",
    meditation: "mw4k1tCnAuE",
    positivity_confidence: "nvlbm8ht7_A",
    break_recharge: "jh9VN0qFObY",
    emotional_release: "QFgFdSuEgPg",
    morning_energy: "CevxZvSJLk8",
    gratitude_reflection: "JEDGFaXYIX8",
    rainy_day: "QHIyFIMu4uQ",
    creative_flow: "EG16dFYK0gw",
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
    const FOCUS_DURATION = 2400; // 40 minutes in seconds
    const BREAK_DURATION = 900;  // 15 minutes in seconds

    const hasUpdatedStreak = useRef(false);

    const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
    const [userId, setUserId] = useState('');
    const [timerActive, setTimerActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [streak, setStreak] = useState(0);
    const isBreakRef = useRef(isBreak);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUserId(user?.uid || '');
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        console.log("⏰ Timer useEffect triggered. timerActive:", timerActive, "userId:", userId);
        if (!timerActive || !userId) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev > 0) {
                    return prev - 1;
                } else {
                    clearInterval(interval);
                    console.log("⏱️ Timer reached 0. isBreakRef.current:", isBreakRef.current);
                    if (!isBreakRef.current) {
                        console.log("🎯 Focus ended. hasUpdatedStreak:", hasUpdatedStreak.current);
                        if (!hasUpdatedStreak.current) {
                            updateStreak();
                            hasUpdatedStreak.current = true;
                        }
                        console.log("☕ Starting break. timeLeft:", BREAK_DURATION);
                        setIsBreak(true);
                        isBreakRef.current = true;
                        setTimeLeft(BREAK_DURATION);
                        setTimerActive(true); // Keep timer active during break
                    } else {
                        console.log("☕ Break ended. Resetting for focus. timeLeft:", FOCUS_DURATION);
                        setIsBreak(false);
                        isBreakRef.current = false;
                        hasUpdatedStreak.current = false;
                        setTimeLeft(FOCUS_DURATION);
                        setTimerActive(true); // Start next focus immediately
                    }
                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timerActive, userId]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleStartPause = () => {
        setTimerActive(!timerActive);
    };

    const handleReset = () => {
        setTimerActive(false);
        setIsBreak(false);
        isBreakRef.current = false;
        setTimeLeft(FOCUS_DURATION);
        hasUpdatedStreak.current = false;
    };

    useEffect(() => {
        if (userId) {
            loadStreak(userId);
        }
    }, [userId]);

    const loadStreak = async (uid) => {
        try {
            const streakRef = doc(db, "streaks", uid);
            const snap = await getDoc(streakRef);
            if (snap.exists()) {
                setStreak(snap.data().streak || 0);
            }
        } catch (err) {
            console.error("Error loading streak:", err);
        }
    };

    const updateStreak = async () => {
        console.log("➡️ updateStreak function started");
        console.log("👤 Current userId:", userId);
        const today = new Date().toDateString();

        if (!userId) {
            console.warn("❌ No userId, exiting updateStreak");
            return;
        }

        try {
            const streakRef = doc(db, "streaks", userId);
            const streakSnap = await getDoc(streakRef);

            let newStreak = 1;

            if (streakSnap.exists()) {
                const data = streakSnap.data();
                const lastUpdateDate = data.lastUpdated?.toDate()?.toDateString();

                console.log("📅 Firestore lastUpdated:", lastUpdateDate);

                if (lastUpdateDate === new Date(Date.now() - 86400000).toDateString()) {
                    newStreak = (data.streak || 0) + 1;
                } else if (lastUpdateDate !== today) {
                    newStreak = 1;
                } else {
                    console.log("🛑 Already updated Firestore today, exiting updateStreak");
                    return;
                }
            }

            console.log("✍️ Attempting to write to Firestore. New streak:", newStreak);
            await setDoc(streakRef, {
                streak: newStreak,
                lastUpdated: new Date()
            });
            console.log("✅ Firestore write successful. New streak set to:", newStreak);
            setStreak(newStreak);
            console.log("⚛️ Local state 'streak' updated to:", newStreak);
        } catch (err) {
            console.error("🔥 Firestore update failed:", err);
        }
    };

    return (
        <div className="curated-space">
            <div className="content">
                <div className="timer-box">
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

                    <div className="timer-buttons">
                        <button
                            className={`timer-button ${timerActive ? "pause-button" : "start-button"}`}
                            onClick={handleStartPause}
                        >
                            {timerActive ? "Pause" : "Start"}
                        </button>
                        <button className="reset-button" onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                    <button className="exit-button" onClick={() => navigate("/curated")}>
                        Exit
                    </button>
                </div>
               
                <div className="video-box">
                    {videoId ? <YouTubePlayer videoId={videoId} /> : <p>Video not found.</p>}
                </div>
            </div>
        </div>
    );
};

export default CuratedSpace;