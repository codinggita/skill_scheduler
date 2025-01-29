
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

let db;
let notesCollection;

// Function to initialize collections
const initializeCollections = (database) => {
    db = database;
    notesCollection = db.collection('notes');
};

// ✅ GET: Fetch all notes
router.get('/', async (req, res) => {
    try {
        const notes = await notesCollection.find().toArray();
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).send("Error fetching notes: " + err.message);
    }
});

// ✅ GET: Fetch a single note by ID
router.get('/:id', async (req, res) => {
    try {
        const note = await notesCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!note) return res.status(404).send("Note not found");
        res.status(200).json(note);
    } catch (err) {
        res.status(500).send("Error fetching note: " + err.message);
    }
});

// ✅ POST: Add a new note
router.post('/', async (req, res) => {
    try {
        const newNote = req.body;
        const result = await notesCollection.insertOne(newNote);
        res.status(201).send(`Note added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding note: " + err.message);
    }
});

// ✅ PUT: Update a note completely
router.put('/:id', async (req, res) => {
    try {
        const noteId = new ObjectId(req.params.id);
        const updatedNote = req.body;
        const result = await notesCollection.replaceOne({ _id: noteId }, updatedNote);
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating note: " + err.message);
    }
});

// ✅ DELETE: Remove a note
router.delete('/:id', async (req, res) => {
    try {
        const noteId = new ObjectId(req.params.id);
        const result = await notesCollection.deleteOne({ _id: noteId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting note: " + err.message);
    }
});

// ✅ Export both the router and initializeCollections
module.exports = { router, initializeCollections };
