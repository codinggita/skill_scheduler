import React, { useState, useEffect } from 'react';
import '../styling/revision.css';

const Revision = () => {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://skill-scheduler.onrender.com/api/notes/revision';

  // Fetch existing revision notes from API
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setNotes(data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching notes:', error));
  };

  // Add a new revision note
  const saveNote = () => {
    if (!noteText.trim()) return;

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: noteText }),
    })
      .then(response => response.json())
      .then(data => {
        setNotes([...notes, data]); // Update UI
        setNoteText('');
      })
      .catch(error => console.error('Error saving note:', error));
  };

  // Delete a revision note
  const deleteNote = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => setNotes(notes.filter(note => note._id !== id))) // Remove from UI
      .catch(error => console.error('Error deleting note:', error));
  };

  // Start editing a note
  const startEdit = (id, content) => {
    setEditingId(id);
    setEditText(content);
  };

  // Save edited note
  const saveEdit = () => {
    fetch(`${API_URL}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editText }),
    })
      .then(() => {
        setNotes(notes.map(note => (note._id === editingId ? { ...note, content: editText } : note)));
        setEditingId(null);
        setEditText('');
      })
      .catch(error => console.error('Error editing note:', error));
  };

  return (
    <div className="revision-notes-container">
      <h2>Revision Notes</h2>

      {/* Textarea for adding a note */}
      <div className="note-input">
        <textarea
          placeholder="Write your revision note..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        ></textarea>
        <button className="save-btn" onClick={saveNote}>Save Note</button>
      </div>

      {/* Notes List */}
      {loading ? (
        <p>Loading notes...</p>
      ) : (
        <ul className="revision-notes-list">
          {notes.length > 0 ? (
            notes.map(note => (
              <li key={note._id}>
                {editingId === note._id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button className="save-btn" onClick={saveEdit}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span>{note.content}</span>
                    <div className="buttons">
                      <button className="edit-btn" onClick={() => startEdit(note._id, note.content)}>Edit</button>
                      <button className="delete-btn" onClick={() => deleteNote(note._id)}>Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))
          ) : (
            <p>No revision notes yet.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Revision;
