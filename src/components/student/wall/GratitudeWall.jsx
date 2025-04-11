import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { getAuth } from "firebase/auth";
import { db } from "../../../firebase"; // Import Firebase configuration
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import StickyNote from "./StickyNote";
import NoteForm from "./NoteForm";

const GratitudeWall = () => {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes")) || []);
  const [coins, setCoins] = useState(0);
  const wallRef = useRef(null);

  // 🪙 Fetch coins when the component mounts
  useEffect(() => {
    const fetchCoins = async () => {
      const userRef = doc(db, "coins", "userId"); // Replace with dynamic user ID
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setCoins(docSnap.data().coins || 0);
      } else {
        await setDoc(userRef, { coins: 0 }); // Initialize if not present
      }
    };

    fetchCoins();
  }, []);

  // 📝 Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // ➕ Add Coins & Note
  const addNote = async (newNote) => {
    setNotes([...notes, newNote]);

    const userRef = doc(db, "users", "userId"); // Replace dynamically
    try {
      const docSnap = await getDoc(userRef);
      const currentCoins = docSnap.exists() ? docSnap.data().coins : 0;
      await updateDoc(userRef, { coins: currentCoins + 5 });
      setCoins(currentCoins + 5);
    } catch (error) {
      console.error("Error updating coins:", error);
    }
  };

  // ❌ Delete Note
  const deleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  // 📸 Export Functions
  const exportAsImage = () => {
    html2canvas(wallRef.current, { scale: 2 }).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "gratitude-wall.png";
      link.click();
    });
  };

  const exportAsPDF = () => {
    html2canvas(wallRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), (canvas.height * pdf.internal.pageSize.getWidth()) / canvas.width);
      pdf.save("gratitude-wall.pdf");
    });
  };

  return (
    <div className="container">
      <h1>Gratitude Wall</h1>
      <NoteForm addNote={addNote} />
      <div className="gratitude-wall" ref={wallRef}>
        {notes.map((note, index) => (
          <StickyNote key={index} index={index} note={note} onDelete={deleteNote} />
        ))}
      </div>
      <div className="button-container">
        <button className="export-button" onClick={exportAsImage}>
          Download as Image
        </button>
        <button className="export-button" onClick={exportAsPDF}>
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default GratitudeWall;
