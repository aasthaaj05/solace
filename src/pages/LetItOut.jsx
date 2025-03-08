import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAuth } from "firebase/auth";
import { db } from "../firebase"; 
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import "./styles.css";

const auth = getAuth();

function LetItOut() {
  const [mode, setMode] = useState(null);
  const [text, setText] = useState("");
  const [savedText, setSavedText] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const videoRef = useRef(null);
  const videoStreamRef = useRef(null);
  const videoChunks = useRef([]);
  const videoRecorderRef = useRef(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("letItOutText")) || {};
    setSavedText(storedData);
  }, []);

  const handleSave = async (type) => {
    const date = new Date().toDateString();
    const updatedData = {
      ...savedText,
      [date]: {
        ...savedText[date],
        [type]: type === "text" ? text : type === "audio" ? audioUrl : videoUrl,
      },
    };

    setSavedText(updatedData);
    localStorage.setItem("letItOutText", JSON.stringify(updatedData));
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} saved! ✅ && Hurrah!! you won 10 coins🪙`);

    // **Update Coins in Firestore**
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const userRef = doc(db, "coins", userId);

      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const currentCoins = userSnap.data().coins || 0;
          await updateDoc(userRef, { coins: currentCoins + 10 });
        } else {
          await setDoc(userRef, { coins: 10 }); // Set initial coins if user doc doesn't exist
        }
        console.log("Coins updated successfully! 🪙");
      } catch (error) {
        console.error("Error updating coins:", error);
      }
    }
  };

  return (
    <div className="let-it-out-container">
      <h1>My Safe Space</h1>
      <Link to="/">
        <button className="nav-button">Back</button>
      </Link>
      
      <div className="calendar-container" ref={calendarRef}>
        <button
          className="calendar-icon"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          📅
        </button>
        {showCalendar && (
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setShowCalendar(false);
            }}
            inline
          />
        )}
      </div>

      {selectedDate && (
        <div className="saved-note">
          <h3>Saved Entry for {selectedDate.toDateString()}</h3>
          <p>{savedText[selectedDate.toDateString()]?.text || "No text entry."}</p>
          {savedText[selectedDate.toDateString()]?.audio && <audio controls src={savedText[selectedDate.toDateString()].audio}></audio>}
          {savedText[selectedDate.toDateString()]?.video && <video controls src={savedText[selectedDate.toDateString()].video}></video>}
          <button onClick={() => setSelectedDate(null)}>Close</button>
        </div>
      )}

      <div className="button-container">
        <button className="text-btn" onClick={() => setMode("text")}>✍️ Text</button>
        <button className="audio-btn" onClick={() => setMode("audio")}>🎤 Audio</button>
        <button className="video-btn" onClick={() => setMode("video")}>📹 Video</button>
      </div>

      {mode === "text" && (
        <div>
          <textarea placeholder="Write down your thoughts..." value={text} onChange={(e) => setText(e.target.value)}></textarea>
          <button onClick={() => handleSave("text")}>Save 📝</button>
        </div>
      )}

      {mode === "audio" && (
        <div className="audio-recorder">
          {recording ? <p>🔴 Recording...</p> : <button onClick={startAudioRecording}>▶ Start Recording</button>}
          {recording && <button onClick={stopAudioRecording}>⏹ Stop Recording</button>}
          {audioUrl && (
            <>
              <audio controls src={audioUrl}></audio>
              <button onClick={() => handleSave("audio")}>Save ✅</button>
              <button onClick={() => setAudioUrl(null)}>🗑 Delete</button>
            </>
          )}
        </div>
      )}

      {mode === "video" && (
        <div className="video-recorder">
          <video ref={videoRef} autoPlay></video>
          <button onClick={startVideoRecording}>▶ Start Recording</button>
          <button onClick={stopVideoRecording}>⏹ Stop Recording</button>
          {videoUrl && (
            <>
              <video controls src={videoUrl}></video>
              <button onClick={() => handleSave("video")}>Save ✅</button>
              <button onClick={() => setVideoUrl(null)}>🗑 Delete</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default LetItOut;
