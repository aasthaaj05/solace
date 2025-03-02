import { useState } from "react";

export default function GratitudeForm({ addEntry }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;
    addEntry(text);
    setText(""); // Clear input after submitting
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
      <textarea
        className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
        placeholder="What are you grateful for today?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
      >
        Add Gratitude
      </button>
    </form>
  );
}
