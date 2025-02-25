import { useState } from "react";

export default function YesterdaysNotes() {
  const [notes, setNotes] = useState([
    "Had a productive meeting with the design team about the new feature implementation.",
    "Completed the documentation for API endpoints.",
    "Started working on the new user dashboard layout and completed initial wireframes.",
    "Fixed three critical bugs in the authentication system and deployed to staging."
  ]);
  const [newNote, setNewNote] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedNote, setEditedNote] = useState("");

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote]);
      setNewNote("");
    }
  };

  const deleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditedNote(notes[index]);
  };

  const saveEdit = () => {
    const updatedNotes = [...notes];
    updatedNotes[editingIndex] = editedNote;
    setNotes(updatedNotes);
    setEditingIndex(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold">Yesterday's Notes</h2>
      <p className="text-gray-600 mb-4">Keep track of your daily activities and thoughts</p>
      
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          className="flex-1 p-2 border rounded" 
          placeholder="Add a new note..." 
          value={newNote} 
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button 
          className="bg-black text-white px-4 py-2 rounded flex items-center"
          onClick={addNote}
        >
          + Add Note
        </button>
      </div>
      
      {notes.map((note, index) => (
        <div key={index} className="flex items-center justify-between bg-white p-3 rounded shadow mb-2">
          {editingIndex === index ? (
            <input 
              type="text" 
              className="flex-1 p-2 border rounded"
              value={editedNote} 
              onChange={(e) => setEditedNote(e.target.value)}
            />
          ) : (
            <p>{note}</p>
          )}
          
          <div className="flex gap-2">
            {editingIndex === index ? (
              <>
                <button className="bg-black text-white px-3 py-1 rounded" onClick={saveEdit}>Save</button>
                <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setEditingIndex(null)}>Cancel</button>
              </>
            ) : (
              <>
                <button className="text-gray-500" onClick={() => startEditing(index)}>
                  ✏️
                </button>
                <button className="text-red-500" onClick={() => deleteNote(index)}>
                  🗑️
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
 
