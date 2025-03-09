import React from "react";

const StickyNote = ({ note, index, onDelete }) => {
  return (
    <div className="sticky-note">
      <button className="delete-btn" onClick={() => onDelete(index)}>X</button>
      <p>{note}</p>
    </div>
  );
};

export default StickyNote;

