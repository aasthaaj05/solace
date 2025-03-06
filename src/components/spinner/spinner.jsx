import React, { useState, useEffect } from "react";
import { SpinWheel } from "react-spin-wheel";
import "react-spin-wheel/dist/index.css";
import Confetti from "react-confetti";
import "./Spinner.css"; // Import CSS for styling

function Spinner() {
  const initialItems = [
    "Deep breathing (5 min)",
    "Drink water",
    "Stretch (3 min)",
    "Write 3 gratitudes",
    "Get fresh air",
    "Listen to music",
    "Meditate (5 min)",
    "Screen break (10 min)",
    "Tidy workspace",
    "Declutter (5 min)",
    "Make bed",
    "Quick vacuum/sweep",
    "Wipe surfaces",
    "Fold laundry",
    "Wash dishes",
    "Exercise",
    "Complete a to-do",
    "Unsubscribe email",
    "Organize apps",
    "Delete 5 files",
    "Top 3 priorities",
    "Plan meal",
  ];

  const [show, setShow] = useState(false);
  const [winner, setWinner] = useState("");
  const [key, setKey] = useState(0);
  const [history, setHistory] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]); // Track completed tasks
  const [remainingItems, setRemainingItems] = useState(initialItems);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showWrongPopup, setShowWrongPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); // 🎉 Confetti State
  const [dailyGoal, setDailyGoal] = useState(5); // Daily goal of 5 tasks
  const [tasksCompletedToday, setTasksCompletedToday] = useState(0); // Track tasks completed today
  const [showCompletedTasks, setShowCompletedTasks] = useState(false); // Toggle for completed tasks

  // Load completed tasks, daily progress, and last reset time from localStorage on component mount
  useEffect(() => {
    const savedCompletedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    const savedTasksCompletedToday = parseInt(localStorage.getItem("tasksCompletedToday")) || 0;
    const lastResetTime = parseInt(localStorage.getItem("lastResetTime")) || Date.now();

    setCompletedTasks(savedCompletedTasks);
    setTasksCompletedToday(savedTasksCompletedToday);

    // Check if 24 hours have passed since the last reset
    const currentTime = Date.now();
    const timeSinceLastReset = currentTime - lastResetTime;
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (timeSinceLastReset >= twentyFourHours) {
      resetGame();
      localStorage.setItem("lastResetTime", currentTime.toString()); // Update last reset time
    }
  }, []);

  // Save completed tasks and daily progress to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    localStorage.setItem("tasksCompletedToday", tasksCompletedToday.toString());
  }, [completedTasks, tasksCompletedToday]);

  // Reset daily progress every 24 hours
  useEffect(() => {
    const resetInterval = setInterval(() => {
      setTasksCompletedToday(0);
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

    return () => clearInterval(resetInterval);
  }, []);

  const handleClose = () => {
    setShow(false);
    if (remainingItems.length === 0) {
      resetGame();
    }
  };

  const handleShow = (item) => {
    setWinner(item);
    setShow(true);
    setShowConfetti(true); // 🎉 Start confetti
    setTimeout(() => setShowConfetti(false), 3000); // Stop confetti after 3s
    setHistory((prevHistory) => [...prevHistory, item]);
    setRemainingItems((prevItems) => prevItems.filter((i) => i !== item));
  };

  const restoreToWheel = (item) => {
    setRemainingItems((prevItems) => [...prevItems, item]);
  };

  const handleCheck = (index) => {
    setSelectedIndex(index); // Store the selected task index
    setShowQuestion(true); // Show the question popup
  };

  const handleWrong = (index) => {
    setSelectedIndex(index);
    setShowWrongPopup(true);
  };

  const handleSubmit = () => {
    if (selectedIndex !== null) {
      const task = history[selectedIndex];
      setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, task]); // Add to completed tasks
      setTasksCompletedToday((prevCount) => prevCount + 1); // Increment tasks completed today
      setHistory((prevHistory) => prevHistory.filter((_, i) => i !== selectedIndex)); // Remove from history
      setSelectedIndex(null);
      setShowQuestion(false); // Close the question popup
    }
  };

  const closeQuestionPopup = () => {
    setShowQuestion(false); // Close the question popup without submitting
  };

  const calculateDynamicSize = () => {
    const baseSize = 700;
    const textLengths = remainingItems.map((item) => item.length);
    const maxTextLength = Math.max(...textLengths, 10);
    return Math.max(baseSize, maxTextLength * 15);
  };

  const closeWrongPopup = () => {
    if (selectedIndex !== null) {
      restoreToWheel(history[selectedIndex]);
      setHistory((prevHistory) => prevHistory.filter((_, i) => i !== selectedIndex));
      setSelectedIndex(null);
    }
    setShowWrongPopup(false);
  };

  const resetGame = () => {
    setHistory([]);
    setRemainingItems(initialItems);
    setKey((prevKey) => prevKey + 1);
    setCompletedTasks([]);
    setTasksCompletedToday(0);
  };

  const calculateDynamicFontSize = () => {
    const maxTextLength = Math.max(...remainingItems.map((item) => item.length), 10);
    return Math.max(10, 10 - maxTextLength);
  };

  return (
    <>
      {showConfetti && <Confetti /> /* 🎉 Show confetti when winner popup appears */}
     

      {/* Spin Wheel Section */}
      <div className="tab-content">
        {remainingItems.length > 1 ? (
          <SpinWheel
            key={key} // Forces re-render on reset
            items={remainingItems}
            itemColors={[
              "#2DAA9E", // Deep Teal Green
              "#F7CFD8", // Soft Pink
              "#578FCA", // Deep Blue
              "#A6F1E0", // Light Aqua
              "#F37199", // Bright Pink
              "#FFE6A9", // Warm Yellow-Orange
              "#73C7C7", // Teal Blue
              "#F4F8D3", // Pale Yellow-Green
            ]}
            spinItemStyle={{
              color: "black",
              fontWeight: "bold",
              textAlign: "center",
            }} // Ensures black text color
            onFinishSpin={handleShow} // Show modal when spin finishes
            primaryColor="#4CAF50" // Outer ring color
            contrastColor="#1E1E1E"
            buttonColor="#FF9800" // Spin button color
            size={calculateDynamicSize()}
            fontFamily="Arial"
            fontSize={calculateDynamicFontSize()}
          />
        ) : remainingItems.length === 1 ? (
          <button className="spin-last-button" onClick={() => handleShow(remainingItems[0])}>
            Spin Last Choice
          </button>
        ) : (
          <button className="reset-button" onClick={resetGame}>
            🔄 Reset Game
          </button>
        )}
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${!showCompletedTasks ? "active" : ""}`}
          onClick={() => setShowCompletedTasks(false)}
        >
          Task History
        </button>
        <button
          className={`tab-button ${showCompletedTasks ? "active" : ""}`}
          onClick={() => setShowCompletedTasks(true)}
        >
          Completed Tasks
        </button>
      </div>

      {/* Completed Tasks Section */}
      {showCompletedTasks && (
  <div className="completed-tasks-container">
    <h3>✅ Completed Tasks</h3>
    <ul className="completed-tasks-list">
      {completedTasks.length === 0 ? (
        <li className="completed-task">No tasks completed yet.</li>
      ) : (
        completedTasks.map((task, index) => (
          <li key={index} className="completed-task">
            <span>{task}</span>
          </li>
        ))
      )}
    </ul>
    {/* Progress Bar */}
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{
            width: `${(tasksCompletedToday / dailyGoal) * 100}%`,
          }}
        ></div>
      </div>
      <p className="progress-text">
        {tasksCompletedToday}/{dailyGoal} tasks completed today
      </p>
    </div>
  </div>
)}
      {/* Task History Section */}
      {!showCompletedTasks && (
        <div className="history-container">
          <h3>📝 Task History:</h3>
          <ul>
            {history.length === 0 ? (
              <li>No spins yet.</li>
            ) : (
              history.map((item, index) => (
                <li key={index} className="history-item">
                  <span className="history-text">{item}</span>
                  <button className="check-button" onClick={() => handleCheck(index)}>
                    ✔️
                  </button>
                  <button className="wrong-button" onClick={() => handleWrong(index)}>
                    ❌
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* 🎉 Winner Modal with Celebration */}
      {show && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">🎉 Congratulations!</h2>
            <p className="modal-text">
              You got: <strong>{winner}</strong>!
            </p>
            <button className="close-button" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Question & File Upload */}
      {showQuestion && (
        <div className="question-overlay">
          <div className="question-box">
            <button className="close-cross-button" onClick={closeQuestionPopup}>
              ×
            </button>
            <h3>Question:</h3>
            <p>Can you upload a picture related to {history[selectedIndex]}?</p>
            <input type="file" accept="image/*" />
            <button className="close-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Wrong Answer Popup */}
      {showWrongPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">❌ No Problem!</h2>
            <p className="modal-text">Let's try again tomorrow!</p>
            <button className="close-button" onClick={closeWrongPopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Spinner;