import React, { useState, useEffect } from 'react';
import '../styling/notes.css';


// const cloudinary = require('cloudinary');

// cloudinary.v2.config({
//   cloud_name: 'dnfqhhyoo',
//   api_key: '188198583196523',
//   api_secret: 'pwRFYK025lbtMCCc2-8WRaJPL_s',
//   secure: true,
// });

const Notes = () => {
  const categories = [
    { name: "Yesterday's Notes", api: "yesterday" },
    { name: "Revision Notes", api: "revision" },
    { name: "Quiz Notes", api: "quiz" },
    { name: "Improvements", api: "improvements" }
  ];

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]); // Default to Yesterday's Notes

  useEffect(() => {
    fetchNotes();
  }, [selectedCategory]); // Fetch notes when category changes

  // Fetch notes based on selected category
  const fetchNotes = async () => {
    try {
      const response = await fetch(`https://skill-scheduler.onrender.com/api/notes/${selectedCategory.api}`);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Add a new note
  const addNote = async () => {
    if (newNote.trim() === '') return;

    try {
      const response = await fetch(`https://skill-scheduler.onrender.com/api/notes/${selectedCategory.api}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote })
      });

      if (response.ok) {
        setNewNote('');
        fetchNotes(); // Fetch updated notes immediately
      } else {
        console.error('Error adding note:', response.status);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Edit an existing note
  const editNote = async () => {
    if (!selectedNote) return;

    try {
      const response = await fetch(`https://skill-scheduler.onrender.com/api/notes/${selectedCategory.api}/${selectedNote._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote })
      });

      if (response.ok) {
        setNewNote('');
        setSelectedNote(null);
        fetchNotes(); // Refresh notes
      } else {
        console.error('Error editing note:', response.status);
      }
    } catch (error) {
      console.error('Error editing note:', error);
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`https://skill-scheduler.onrender.com/api/notes/${selectedCategory.api}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchNotes(); // Refresh notes after deletion
      } else {
        console.error('Error deleting note:', response.status);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Handle note selection for editing
  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setNewNote(note.content);
  };

  return (
    <div className="notes-container">
      {/* Sidebar Navigation */}
      <div className="notes-sidebar">
        {categories.map((category) => (
          <button
            key={category.api}
            className={selectedCategory.api === category.api ? 'active' : ''}
            onClick={() => setSelectedCategory(category)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Notes Editor */}
      <div className="notes-editor">
        <h2>{selectedCategory.name}</h2>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write your notes here..."
        />
        <button onClick={selectedNote ? editNote : addNote}>
          {selectedNote ? 'Edit Note' : 'Add Note'}
        </button>
      </div>

      {/* Notes List */}
      <div className="notes-list">
        <h2>Saved Notes</h2>
        {notes.length === 0 ? <p>No notes available.</p> : (
          <ul>
            {notes.map((note) => (
              <li key={note._id}>
                <div onClick={() => handleNoteClick(note)}>
                  <h3>{note.title || 'Untitled'}</h3>
                  <p>{note.content.slice(0, 50)}...</p>
                </div>
                <button className="delete-btn" onClick={() => deleteNote(note._id)}>delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notes;
