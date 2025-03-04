import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

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

  const handleSave = (type) => {
    const date = new Date().toDateString();
    const updatedData = { ...savedText, [date]: { ...savedText[date], [type]: type === "text" ? text : type === "audio" ? audioUrl : videoUrl } };
    setSavedText(updatedData);
    localStorage.setItem("letItOutText", JSON.stringify(updatedData));
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} saved! ✅`);
  };

  const startAudioRecording = async () => {
    try {
      setRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        setAudioUrl(URL.createObjectURL(audioBlob));
        setRecording(false);
      };

      audioChunks.current = [];
      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      videoRecorderRef.current = mediaRecorder;
      videoChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        videoChunks.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(videoChunks.current, { type: "video/mp4" });
        setVideoUrl(URL.createObjectURL(videoBlob));
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopVideoRecording = () => {
    if (videoRecorderRef.current) {
      videoRecorderRef.current.stop();
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
