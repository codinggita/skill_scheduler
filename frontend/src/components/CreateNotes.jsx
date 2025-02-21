import React, { useState, useEffect } from 'react';
import '../styling/createnotes.css';

const CreateNotes = () => {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [expandedNoteId, setExpandedNoteId] = useState(null); // Track expanded note

  // Fetch existing notes from API
  useEffect(() => {
    fetch('https://skill-scheduler.onrender.com/api/notes/yesterday')
      .then(response => response.json())
      .then(data => setNotes(data))
      .catch(error => console.error('Error fetching notes:', error));
  }, []);

  // Add a new note
  const saveNote = () => {
    if (!noteText.trim()) return;
     // This line checks if the noteText (the content of the note) is empty or only whitespace. If it is, the function exits early and doesn’t proceed with saving the note.// 

    fetch('https://skill-scheduler.onrender.com/api/notes/yesterday', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: noteText }),
    })
      .then(response => response.json())
      .then(data => {
        setNotes([...notes, data]); // Update UI with new note
        setNoteText('');
      })
      .catch(error => console.error('Error saving note:', error));
  };

  // Delete a note
  const deleteNote = (id) => {
    fetch(`https://skill-scheduler.onrender.com/api/notes/yesterday/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setNotes(notes.filter(note => note._id !== id)); // Remove from UI
      })
      .catch(error => console.error('Error deleting note:', error));
  };

  const toggleNote = (id) => {
    setExpandedNoteId(expandedNoteId === id ? null : id);
  };

  return (
    <div className="create-note-container">
      <h2>Create Your Note</h2>

      {/* Textarea for writing note */}
      <textarea
        placeholder="Write your notes here..."
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
      ></textarea>

      {/* Save Button */}
      <button onClick={saveNote}>Save Note</button>

      {/* Display Notes */}
      <ul className="notes-list">
        {notes.map(note => (
          <li key={note._id}>
            <pre className="note-content" onClick={() => toggleNote(note._id)}>
              {expandedNoteId === note._id
                ? note.content // Show full content if expanded
                : `${note.content.split('\n')[0].slice(0, 50)}...`} {/* Show preview */}
            </pre>
            <button onClick={() => deleteNote(note._id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateNotes;
