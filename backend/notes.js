const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

// MongoDB connection (initialized in server.js)
let db;
let notesCollection;

// Function to initialize collections
const initializeCollections = (database) => {
    db = database;
    notesCollection = db.collection("notes");
};


//  GET: Fetch All Notes
//  Endpoint: GET /api/notes
//  Description: Fetch all notes from the database
router.get("/", async (req, res) => {
    try {
        const notes = await notesCollection.find().toArray();
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).send("Error fetching notes: " + err.message);
    }
});
router.delete("/api/notes/:id", async (req, res) => {
    try {
      const note = await Note.findByIdAndDelete(req.params.id);
      if (!note) return res.status(404).json({ message: "Note not found" });
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting note" });
    }
  });

// ✅ GET: Fetch All Yesterday's Notes
router.get("/yesterday", async (req, res) => {
    try {
        const notes = await notesCollection.find({ type: "yesterday" }).toArray();
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).send("Error fetching yesterday's notes: " + err.message);
    }
});

// ✅ POST: Add a New Yesterday's Note
router.post("/yesterday", async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = { title, content, type: "yesterday", createdAt: new Date() };
        const result = await notesCollection.insertOne(newNote);
        res.status(201).json({ _id: result.insertedId, ...newNote });
    } catch (err) {
        res.status(500).send("Error adding yesterday's note: " + err.message);
    }
});

// ✅ PUT: Update Yesterday's Note
router.put("/yesterday/:id", async (req, res) => {
    try {
        const noteId = new ObjectId(req.params.id);
        const updatedNote = req.body;
        const result = await notesCollection.updateOne({ _id: noteId }, { $set: updatedNote });
        res.json({ message: `${result.modifiedCount} document(s) updated` });
    } catch (err) {
        res.status(500).send("Error updating yesterday's note: " + err.message);
    }
});

// ✅ DELETE: Remove Yesterday's Note
router.delete("/yesterday/:id", async (req, res) => {
    try {
        await notesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Yesterday's note deleted" });
    } catch (err) {
        res.status(500).send("Error deleting yesterday's note: " + err.message);
    }
});


// ✅ GET: Fetch All Revision Notes
router.get("/revision", async (req, res) => {
    try {
        const notes = await notesCollection.find({ type: "revision" }).toArray();
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).send("Error fetching revision notes: " + err.message);
    }
});

// ✅ POST: Add a New Revision Note
router.post("/revision", async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = { title, content, type: "revision", createdAt: new Date() };
        const result = await notesCollection.insertOne(newNote);
        res.status(201).json({ _id: result.insertedId, ...newNote });
    } catch (err) {
        res.status(500).send("Error adding revision note: " + err.message);
    }
});

// ✅ PUT: Update Revision Note
router.put("/revision/:id", async (req, res) => {
    try {
        const noteId = new ObjectId(req.params.id);
        const updatedNote = req.body;
        const result = await notesCollection.updateOne({ _id: noteId }, { $set: updatedNote });
        res.json({ message: `${result.modifiedCount} document(s) updated` });
    } catch (err) {
        res.status(500).send("Error updating revision note: " + err.message);
    }
});

// ✅ DELETE: Remove Revision Note
router.delete("/revision/:id", async (req, res) => {
    try {
        await notesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Revision note deleted" });
    } catch (err) {
        res.status(500).send("Error deleting revision note: " + err.message);
    }
});


// ✅ GET: Fetch All Quiz Notes
router.get("/quizzes", async (req, res) => {
    try {
        const notes = await notesCollection.find({ type: "quizzes" }).toArray();
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).send("Error fetching quiz notes: " + err.message);
    }
});

// ✅ POST: Add a New Quiz Note
router.post("/quizzes", async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = { title, content, type: "quizzes", createdAt: new Date() };
        const result = await notesCollection.insertOne(newNote);
        res.status(201).json({ _id: result.insertedId, ...newNote });
    } catch (err) {
        res.status(500).send("Error adding quiz note: " + err.message);
    }
});

// ✅ PUT: Update Quiz Note
router.put("/quizzes/:id", async (req, res) => {
    try {
        const noteId = new ObjectId(req.params.id);
        const updatedNote = req.body;
        const result = await notesCollection.updateOne({ _id: noteId }, { $set: updatedNote });
        res.json({ message: `${result.modifiedCount} document(s) updated` });
    } catch (err) {
        res.status(500).send("Error updating quiz note: " + err.message);
    }
});

// ✅ DELETE: Remove Quiz Note
router.delete("/quizzes/:id", async (req, res) => {
    try {
        await notesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Quiz note deleted" });
    } catch (err) {
        res.status(500).send("Error deleting quiz note: " + err.message);
    }
});


// ✅ GET: Fetch All Improvement Notes
router.get("/improvements", async (req, res) => {
    try {
        const notes = await notesCollection.find({ type: "improvements" }).toArray();
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).send("Error fetching improvement notes: " + err.message);
    }
});

// ✅ POST: Add a New Improvement Note
router.post("/improvements", async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = { title, content, type: "improvements", createdAt: new Date() };
        const result = await notesCollection.insertOne(newNote);
        res.status(201).json({ _id: result.insertedId, ...newNote });
    } catch (err) {
        res.status(500).send("Error adding improvement note: " + err.message);
    }
});

// ✅ PUT: Update Improvement Note
router.put("/improvements/:id", async (req, res) => {
    try {
        const noteId = new ObjectId(req.params.id);
        const updatedNote = req.body;
        const result = await notesCollection.updateOne({ _id: noteId }, { $set: updatedNote });
        res.json({ message: `${result.modifiedCount} document(s) updated` });
    } catch (err) {
        res.status(500).send("Error updating improvement note: " + err.message);
    }
});

// ✅ DELETE: Remove Improvement Note
router.delete("/improvements/:id", async (req, res) => {
    try {
        await notesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Improvement note deleted" });
    } catch (err) {
        res.status(500).send("Error deleting improvement note: " + err.message);
    }
});


// ✅ Export both the router and initializeCollections
module.exports = { router, initializeCollections };