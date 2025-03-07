import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import StickyNote from "./StickyNote";
import NoteForm from "./NoteForm";

const GratitudeWall = () => {
  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem("notes")) || [];
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = (newNote) => {
    setNotes([...notes, newNote]);
  };

  const deleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const wallRef = useRef(null);

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
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
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
