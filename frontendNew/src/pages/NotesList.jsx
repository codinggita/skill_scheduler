import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

const API_URL = "https://skill-scheduler.onrender.com/api/notes";

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "", tags: "" });
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addNote = async () => {
    if (!newNote.title || !newNote.content) return;
    try {
      const response = await axios.post(API_URL, {
        ...newNote,
        lastEdited: new Date(),
        tags: newNote.tags.split(",").map((tag) => tag.trim()),
      });
      setNotes([...notes, response.data]);
      setNewNote({ title: "", content: "", tags: "" });
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const updateNote = async () => {
    if (!editingNote.title || !editingNote.content) return;
    try {
      await axios.put(`${API_URL}/${editingNote._id}`, {
        ...editingNote,
        lastEdited: new Date(),
      });
      setNotes(
        notes.map((note) =>
          note._id === editingNote._id ? { ...note, ...editingNote } : note
        )
      );
      setEditingNote(null);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      console.log("Deleting note with ID:", id);
        await axios.delete(`https://skill-scheduler.onrender.com/api/notes/${id}`);
        console.log("Note deleted successfully");
    } catch (error) {
        console.error("Error deleting note:", error);
    }
};

  return (
  <div className="flex bg-gray-100 w-screen h-[calc(100vh-64px)] mt-[64px]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 px-4">
          <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mx-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Add New Note</h2>
          <input type="text" placeholder="Title" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} className="w-full p-2 border rounded mb-2" />
          <textarea placeholder="Content" value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} className="w-full p-2 border rounded mb-2" />
          <input type="text" placeholder="Tags (comma-separated)" value={newNote.tags} onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })} className="w-full p-2 border rounded mb-2" />
          <button onClick={addNote} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">Add Note</button>
        </div>

        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note._id} className="bg-white p-6 rounded-lg shadow-sm mx-4">
              {editingNote?._id === note._id ? (
                <div>
                  <input type="text" value={editingNote.title} onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })} className="w-full p-2 border rounded mb-2" />
                  <textarea value={editingNote.content} onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })} className="w-full p-2 border rounded mb-2" />
                  <button onClick={updateNote} className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2">Save</button>
                  <button onClick={() => setEditingNote(null)} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Cancel</button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{note.title}</h2>
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-gray-600" onClick={() => setEditingNote(note)}>✏️</button>
                      <button onClick={() => deleteNote(note._id)} className="text-gray-400 hover:text-gray-600">🗑️</button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{note.content}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {note.tags?.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-sm text-gray-600 rounded">{tag}</span>
                      ))}
                    </div>
                    {/* <span className="text-sm text-gray-500">Last edited {formatDistanceToNow(new Date(note.lastEdited))} ago</span> */}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteList;
