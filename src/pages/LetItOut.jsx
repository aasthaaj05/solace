import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAuth } from "firebase/auth";
import { db } from "../firebase"; 
import StudNavbar from "../../src/components/student/StudNavbar";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import "./LetItOut.css";

const auth = getAuth();

function LetItOut() {
  const [isRecording, setIsRecording] = useState(false);
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

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunks.current = []; // Fix: Use correct ref
  
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };
  
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url); // Fix: Use correct state setter
      };
  
      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("Recording started...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };
  
  // ✅ Fix `stopAudioRecording`
  const stopAudioRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("Recording stopped.");
    }
  };

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); // Include audio
      videoRef.current.srcObject = stream;
      videoStreamRef.current = stream;
  
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" }); // ✅ Correct MIME type
      videoRecorderRef.current = mediaRecorder;
      videoChunks.current = []; 
  
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunks.current.push(event.data);
        }
      };
  
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(videoChunks.current, { type: "video/webm" });
        const videoURL = URL.createObjectURL(videoBlob);
        setVideoUrl(videoURL); // ✅ Correct state update
        stream.getTracks().forEach((track) => track.stop()); // ✅ Stop camera after recording
        videoRef.current.srcObject = null; // ✅ Clear video stream
      };
  
      mediaRecorder.start();
      setIsRecording(true); // ✅ Indicate recording started
      console.log("Video recording started...");
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };
  
  const stopVideoRecording = () => {
    if (videoRecorderRef.current && videoRecorderRef.current.state !== "inactive") {
      videoRecorderRef.current.stop();
      setIsRecording(false); // ✅ Indicate recording stopped
      console.log("Video recording stopped.");
    }
  };
  
  
  return (
    <div className="navbar">
    <StudNavbar ></StudNavbar>
    
    <div className="let-it-out-container">
      <h1 className="title">My Safe Space</h1>
    
      
      <div className="calendar-container" ref={calendarRef}>
        <button
          className="calendar-icon back-btn1"
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
        {isRecording ? (
  <button onClick={stopAudioRecording}>⏹ Stop Recording</button>
) : (
  <button onClick={startAudioRecording}>▶ Start Recording</button>
)}

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
    
    {isRecording ? (
      <button onClick={stopVideoRecording}>⏹ Stop Recording</button>
    ) : (
      <button onClick={startVideoRecording}>▶ Start Recording</button>
    )}

    {videoUrl && (
      <>
        <video controls src={videoUrl}></video>
        <button onClick={() => handleSave("video")}>Save ✅</button>
        <button onClick={() => setVideoUrl(null)}>🗑 Delete</button>
      </>
    )}
  </div>
)}


<Link to="/student-dashboard">
        <button className="back-btn">Back</button>
      </Link>
    </div>
    </div>
  );
}

export default LetItOut;
