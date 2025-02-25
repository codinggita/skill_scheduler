import React, { useState, useEffect } from 'react';
import '../styling/yesterday.css'
const Yesterday = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [expandedNoteId, setExpandedNoteId] = useState(null); 

  // Fetch all Yesterday notes
  useEffect(() => {
    fetch('https://skill-scheduler.onrender.com/api/notes/yesterday')
      .then(response => response.json())
      .then(data => setNotes(data))
      .catch(error => console.error('Error fetching notes:', error));
  }, []);

  // Add a new note
  const addNote = () => {
    if (!newNote.trim()) return;
    
    fetch('https://skill-scheduler.onrender.com/api/notes/yesterday', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newNote }),
    })
      .then(response => response.json())
      .then(data => {
        setNotes([...notes, data]); // Add new note to the list
        setNewNote('');
      })
      .catch(error => console.error('Error adding note:', error));
  };

  // Edit an existing note
  const editNote = (id) => {
    fetch(`https://skill-scheduler.onrender.com/api/notes/yesterday/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editedContent }),
    })
      .then(response => response.json())
      .then(updatedNote => {
        setNotes(notes.map(note => (note._id === id ? updatedNote : note)));
        setEditingNote(null);
        setEditedContent('');
      })
      .catch(error => console.error('Error editing note:', error));
  };

  // Delete a note
  const deleteNote = (id) => {
    fetch(`https://skill-scheduler.onrender.com/api/notes/yesterday/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setNotes(notes.filter(note => note._id !== id));
      })
      .catch(error => console.error('Error deleting note:', error));
  };

  const toggleNote = (id) => {
    setExpandedNoteId(expandedNoteId === id ? null : id);
  };

  return (
    <div className="yesterday-container">
      <h2>Yesterday's Notes</h2>
      
      {/* Add Note Input */}
      <div>
        <input 
          type="text" 
          placeholder="Add a new note..." 
          value={newNote} 
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button onClick={addNote}>Add</button>
      </div>

      {/* Notes List */}
      <ul>
        {notes.map(note => (
          <li key={note._id}>
            {editingNote === note._id ? (
              <>
                <input 
                  type="text" 
                  value={editedContent} 
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <button onClick={() => editNote(note._id)}>Save</button>
                <button onClick={() => setEditingNote(null)}>Cancel</button>
              </>
            ) : (
              <>
                <pre className="note-content" onClick={() => toggleNote(note._id)}>
              {expandedNoteId === note._id
                ? note.content // Show full content if expanded
                : `${note.content.split('\n')[0].slice(0, 50)}...`} {/* Show preview */}
            </pre>
                <button onClick={() => { setEditingNote(note._id); setEditedContent(note.content); }}>Edit</button>
                <button onClick={() => deleteNote(note._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Yesterday;

