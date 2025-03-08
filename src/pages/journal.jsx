import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { db } from "../firebase"; // Import Firebase configuration
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import StudNavbar from "../../src/components/student/StudNavbar";
import "./journal.css";

function App() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date());
  const calendarRef = useRef(null);
  const [gratitude, setGratitude] = useState(["", "", ""]);
  const [note, setNote] = useState("");
  const [savedEntries, setSavedEntries] = useState({});
  const [calendarMarks, setCalendarMarks] = useState({});

  const auth = getAuth(); // Firebase Auth instance

  useEffect(() => {
    document.addEventListener("click", closeCalendar);
    return () => {
      document.removeEventListener("click", closeCalendar);
    };
  }, []);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const closeCalendar = (e) => {
    if (calendarRef.current && !calendarRef.current.contains(e.target)) {
      setShowCalendar(false);
    }
  };

  const handleSave = async () => {
    if (gratitude.every((point) => point.trim() !== "")) {
      const formattedDate = date.toDateString();
      const updatedEntries = { ...savedEntries, [formattedDate]: { gratitude, note } };
      setSavedEntries(updatedEntries);

      const updatedCalendarMarks = { ...calendarMarks, [formattedDate]: true };
      setCalendarMarks(updatedCalendarMarks);

      localStorage.setItem("gratitudeEntries", JSON.stringify(updatedEntries));
      localStorage.setItem("calendarMarks", JSON.stringify(updatedCalendarMarks));

      alert("Your gratitude journal has been saved! ✅ && Hurrah!! you won 10 coins🪙");

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
          console.log("Coins updated successfully!");
        } catch (error) {
          console.error("Error updating coins:", error);
        }
      }
    }
  };

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem("gratitudeEntries")) || {};
    const storedMarks = JSON.parse(localStorage.getItem("calendarMarks")) || {};
    setSavedEntries(storedEntries);
    setCalendarMarks(storedMarks);
  }, []);

  return (
    <div className="navbar">
    <StudNavbar ></StudNavbar>
    <div className="app-container">
      {/* Back Button (Top Left Corner) */}
      <Link to="/student-dashboard" className="back-button">← Back</Link>

      <h1 className="title">Gratitude Journal</h1>

      {/* Calendar Icon */}
      <div className="calendar-container" ref={calendarRef}>
        <FaRegCalendarAlt className="calendar-icons" onClick={toggleCalendar} />
        {showCalendar && (
          <DatePicker
            selected={date}
            onChange={(selectedDate) => {
              setDate(selectedDate);
              const formattedDate = selectedDate.toDateString();
              if (savedEntries[formattedDate]) {
                setGratitude(savedEntries[formattedDate].gratitude);
                setNote(savedEntries[formattedDate].note);
              } else {
                setGratitude(["", "", ""]);
                setNote("");
              }
              setShowCalendar(false);
            }}
            inline
            dayClassName={(date) =>
              calendarMarks[date.toDateString()] ? "marked-date" : null
            }
          />
        )}
      </div>

      <div className="journal-container">
        <h2>❤️ 3 Things I am Grateful For:</h2>
        {gratitude.map((item, index) => (
          <input
            key={index}
            type="text"
            placeholder={`${index + 1}. I am grateful for...`}
            value={gratitude[index]}
            onChange={(e) => {
              const newGratitude = [...gratitude];
              newGratitude[index] = e.target.value;
              setGratitude(newGratitude);
            }}
          />
        ))}

        <h2>⭐ Note to Myself ⭐</h2>
        <textarea
          placeholder="Write a note to yourself... (Optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>

        {/* Save Button (Disabled until all 3 gratitude fields are filled) */}
        <button className="save-button" onClick={handleSave} disabled={!gratitude.every((point) => point.trim() !== "")}>
          Save 💾
        </button>
      </div>
    </div>
    </div>
  );
}

export default App;