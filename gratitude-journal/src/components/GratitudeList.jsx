import GratitudeItem from "./GratitudeItem";

export default function GratitudeList({ entries, deleteEntry }) {
  return (
    <div className="w-full max-w-md mt-5">
      {entries.length === 0 ? (
        <p className="text-gray-600 text-center">No gratitude entries yet.</p>
      ) : (
        entries.map((entry) => (
          <GratitudeItem key={entry.id} entry={entry} deleteEntry={deleteEntry} />
        ))
      )}
    </div>
  );
}
