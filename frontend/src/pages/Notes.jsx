import React, { useState, useEffect } from 'react';
import '../styling/notes.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [categories, setCategories] = useState(['Revision Notes', 'Quiz Notes', 'Improvements']);
  const [selectedCategory, setSelectedCategory] = useState(null); // Track selected category

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('https://skill-scheduler.onrender.com/api/notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async () => {
    if (newNote.trim() === '') return;

    try {
      const response = await fetch('https://skill-scheduler.onrender.com/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: newNote, 
          category: selectedCategory || 'General' // Include category in the request
        }), 
      });

      if (response.ok) {
        setNewNote('');
        setSelectedCategory(null); // Reset selected category
        fetchNotes();
      } else {
        console.error('Error adding note:', response.status);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const editNote = async () => {
    if (!selectedNote) return;

    try {
      const response = await fetch(`https://skill-scheduler.onrender.com/api/notes/${selectedNote._id}`, {
        method: 'PUT', // Or PATCH, depending on your API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newNote, category: selectedCategory }),
      });

      if (response.ok) {
        setNewNote('');
        setSelectedNote(null);
        setSelectedCategory(null); // Reset selected category
        fetchNotes();
      } else {
        console.error('Error editing note:', response.status);
      }
    } catch (error) {
      console.error('Error editing note:', error);
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setNewNote(note.content);
    setSelectedCategory(note.category); // Set selected category for editing
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filterNotesByCategory = () => {
    if (!selectedCategory) return notes;
    return notes.filter(note => note.category === selectedCategory);
  };

  const filteredNotes = filterNotesByCategory(); // Filter notes based on category

  return (
    <div className="notes-container">
      <div className="notes-left">
        <h2>Yesterday's Notes</h2>
        <div className="note-categories">
          {categories.map(category => (
            <p 
              key={category} 
              className={selectedCategory === category ? 'selected' : ''} // Apply 'selected' class
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </p>
          ))}
        </div>
      </div>

      <div className="notes-center">
        <h2>Take your notes here</h2>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Start typing your notes..."
        />
        <button onClick={selectedNote ? editNote : addNote}>
          {selectedNote ? 'Edit Note' : 'Add Note'}
        </button>
      </div>

      <div className="notes-right">
        <h2>Notes</h2>
        <ul>
          {filteredNotes.map((note) => ( // Render filtered notes
            <li key={note._id} onClick={() => handleNoteClick(note)}>
              <h3>{note.title || 'Untitled Note'}</h3>
              <p>{note.content.slice(0, 50)}...</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notes;