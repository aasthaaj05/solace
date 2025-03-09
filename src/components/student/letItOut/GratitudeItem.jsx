export default function GratitudeItem({ entry, deleteEntry }) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center mt-3">
        <div>
          <p className="text-gray-800">{entry.text}</p>
          <span className="text-gray-500 text-sm">{entry.date}</span>
        </div>
        <button
          onClick={() => deleteEntry(entry.id)}
          className="text-red-500 hover:text-red-700 transition"
        >
          ✖
        </button>
      </div>
    );
  }
  