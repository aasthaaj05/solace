import { useState } from "react";

const NoteForm = ({ addNote }) => {
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note.trim() === "") return;

    addNote(note);
    setNote("");  // Clear input
  };
  


  return (
    <form onSubmit={handleSubmit} className="note-form">
      <input 
        type="text" 
        placeholder="Write your gratitude..."
        value={note} 
        onChange={(e) => setNote(e.target.value)}
        
      />
      <button type="submit">Add Note</button>
    </form>
  );
};

export default NoteForm;
