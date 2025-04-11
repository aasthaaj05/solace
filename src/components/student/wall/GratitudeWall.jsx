import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { getAuth } from "firebase/auth";
import { db } from "../../../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";

import StickyNote from "./StickyNote";
import NoteForm from "./NoteForm";

const GratitudeWall = () => {
  const [notes, setNotes] = useState([]);
  const [coins, setCoins] = useState(0);
  const wallRef = useRef(null);
  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch coins from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchCoins = async () => {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setCoins(docSnap.data().coins || 0);
      } else {
        await setDoc(userRef, { coins: 0 });
      }
    };

    fetchCoins();
  }, [user]);

  // Fetch notes from Firestore in real-time
  useEffect(() => {
    if (!user) return;

    const notesRef = collection(db, "users", user.uid, "gratitudeNotes");
    const unsubscribe = onSnapshot(notesRef, (snapshot) => {
      const fetchedNotes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotes(fetchedNotes);
    });

    return () => unsubscribe();
  }, [user]);

  // Add note and update coins
  const addNote = async (newNote) => {
    if (!user) return;

    try {
      const noteRef = collection(db, "users", user.uid, "gratitudeNotes");
      await addDoc(noteRef, {
        ...newNote,
        timestamp: new Date(),
      });

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      const currentCoins = docSnap.exists() ? docSnap.data().coins || 0 : 0;
      await updateDoc(userRef, { coins: currentCoins + 5 });
      setCoins(currentCoins + 5);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Delete note from Firestore
  const deleteNote = async (noteId) => {
    if (!user) return;

    try {
      const noteRef = doc(db, "users", user.uid, "gratitudeNotes", noteId);
      await deleteDoc(noteRef);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Export wall as image
  const exportAsImage = () => {
    html2canvas(wallRef.current, { scale: 2 }).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "gratitude-wall.png";
      link.click();
    });
  };

  // Export wall as PDF
  const exportAsPDF = () => {
    html2canvas(wallRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdf.internal.pageSize.getWidth(),
        (canvas.height * pdf.internal.pageSize.getWidth()) / canvas.width
      );
      pdf.save("gratitude-wall.pdf");
    });
  };

  return (
    <div className="container">
      <h1>Gratitude Wall 💛</h1>
      <p>Coins: {coins}</p>
      <NoteForm addNote={addNote} />
      <div className="gratitude-wall" ref={wallRef}>
        {notes.map((note, index) => (
          <StickyNote
            key={note.id}
            index={index}
            note={note}
            onDelete={() => deleteNote(note.id)}
          />
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
