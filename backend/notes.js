const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

let db;
let notesCollection;

const initializeCollections = (database) => {
    db = database;
    notesCollection = db.collection("notes");
};

// GET: Fetch All Notes
router.get("/", async (req, res) => {
    try {
        const notes = await notesCollection.find().toArray();
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).send("Error fetching notes: " + err.message);
    }
});

// POST: Add a New Note
router.post("/", async (req, res) => {
    try {
        const { title, content, tags, lastEdited } = req.body;
        const newNote = {
            title,
            content,
            tags: tags || [],
            lastEdited: lastEdited ? new Date(lastEdited) : new Date(),
            createdAt: new Date(),
        };
        const result = await notesCollection.insertOne(newNote);
        res.status(201).json({ _id: result.insertedId, ...newNote });
    } catch (err) {
        res.status(500).send("Error adding note: " + err.message);
    }
});

// PUT: Update a Note
router.put("/:id", async (req, res) => {
    try {
        const noteId = new ObjectId(req.params.id);
        const { title, content, tags, lastEdited } = req.body;
        const updatedNote = {
            title,
            content,
            tags: tags || [],
            lastEdited: lastEdited ? new Date(lastEdited) : new Date(),
        };
        const result = await notesCollection.updateOne(
            { _id: noteId },
            { $set: updatedNote }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.json({ message: "Note updated successfully" });
    } catch (err) {
        res.status(500).send("Error updating note: " + err.message);
    }
});

// DELETE: Remove a Note
router.delete("/:id", async (req, res) => {
    try {
        const noteId = new ObjectId(req.params.id);
        const result = await notesCollection.deleteOne({ _id: noteId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.json({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting note: " + err.message });
    }
});

// ... (keep other routes for /yesterday, /revision, etc.)

module.exports = { router, initializeCollections };