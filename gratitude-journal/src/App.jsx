import React, { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import "./styles.css";

function App() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date());
  const calendarRef = useRef(null);
  const [gratitude, setGratitude] = useState(["", "", ""]);
  const [note, setNote] = useState("");
  const [savedEntries, setSavedEntries] = useState({}); // Stores all saved data
  const [calendarMarks, setCalendarMarks] = useState({}); // Marks tick on saved dates

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

  const handleSave = () => {
    if (gratitude.every((point) => point.trim() !== "")) {
      const formattedDate = date.toDateString();
      const updatedEntries = { ...savedEntries, [formattedDate]: { gratitude, note } };
      setSavedEntries(updatedEntries);

      const updatedCalendarMarks = { ...calendarMarks, [formattedDate]: true };
      setCalendarMarks(updatedCalendarMarks);

      localStorage.setItem("gratitudeEntries", JSON.stringify(updatedEntries));
      localStorage.setItem("calendarMarks", JSON.stringify(updatedCalendarMarks));

      alert("Your gratitude journal has been saved! ✅");
    }
  };

  const handleDateClick = (selectedDate) => {
    const formattedDate = selectedDate.toDateString();
    setDate(selectedDate);

    if (savedEntries[formattedDate]) {
      setGratitude(savedEntries[formattedDate].gratitude);
      setNote(savedEntries[formattedDate].note);
    } else {
      setGratitude(["", "", ""]);
      setNote("");
    }
  };

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem("gratitudeEntries")) || {};
    const storedMarks = JSON.parse(localStorage.getItem("calendarMarks")) || {};
    setSavedEntries(storedEntries);
    setCalendarMarks(storedMarks);
  }, []);

  return (
    <div className="app-container">
      <h1 className="title">Gratitude Journal</h1>

      {/* Calendar Icon */}
      <div className="calendar-container" ref={calendarRef}>
        <FaRegCalendarAlt className="calendar-icon" onClick={toggleCalendar} />
        {showCalendar && (
          <div className="calendar-popup">
            <Calendar
              onChange={handleDateClick}
              value={date}
              tileContent={({ date }) => (calendarMarks[date.toDateString()] ? "✅" : "")}
            />
          </div>
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
  );
}

export default App;
