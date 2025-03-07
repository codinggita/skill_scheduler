import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

const RevisionNotes = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      content: "Review the key concepts of machine learning algorithms including supervised and unsupervised learning methods.",
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isEditing: false,
    },
    {
      id: 2,
      content: "Complete practice problems on differential equations and their applications in real-world scenarios.",
      lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isEditing: false,
    },
    {
      id: 3,
      content: "Study the principles of quantum mechanics and its mathematical foundations.",
      lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isEditing: false,
    },
  ]);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  const handleSaveNote = () => {
    if (newNote.trim()) {
      setNotes([
        { id: Date.now(), content: newNote, lastUpdated: new Date(), isEditing: false },
        ...notes,
      ]);
      setNewNote("");
    }
  };

  const handleEdit = (id) => {
    setNotes(notes.map((note) => ({ ...note, isEditing: note.id === id })));
    setEditingNote(notes.find((note) => note.id === id).content);
  };

  const handleSaveEdit = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, content: editingNote, lastUpdated: new Date(), isEditing: false }
          : note
      )
    );
    setEditingNote(null);
  };

  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8 animate-slide-up">
        <h1 className="text-2xl font-bold text-gray-900">Revision Notes</h1>
        <span className="text-gray-600">Total Notes: {notes.length}</span>
      </div>

      <div className="mb-6 transform transition-all hover:shadow-lg animate-fade-in delay-100">
        <textarea
          className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none transition-all"
          rows="3"
          placeholder="Write your revision note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSaveNote}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Save Note
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transform transition-all hover:scale-102 animate-fade-in delay-100"
          >
            {note.isEditing ? (
              <>
                <textarea
                  className="w-full p-2 border border-gray-200 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-black"
                  value={editingNote}
                  onChange={(e) => setEditingNote(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleSaveEdit(note.id)}
                    className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setNotes(notes.map((n) => ({ ...n, isEditing: false })))}
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-800 mb-3">{note.content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Last updated: {formatDistanceToNow(note.lastUpdated)} ago
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(note.id)}
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevisionNotes;