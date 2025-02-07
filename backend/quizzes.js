const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

let db;
let quizzesCollection;

// Function to initialize collections
const initializeCollections = (database) => {
    db = database;
    quizzesCollection = db.collection("quizzes");
};

// ✅ GET: Fetch All Quizzes
router.get("/", async (req, res) => {
    try {
        const quizzes = await quizzesCollection.find().toArray();
        res.status(200).json(quizzes);
    } catch (err) {
        res.status(500).json({ message: "Error fetching quizzes", error: err.message });
    }
});

// ✅ POST: Add a Quiz
router.post("/", async (req, res) => {
    try {
        const { question, options, correctAnswer } = req.body;
        if (!question || !options || !correctAnswer || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ message: "Invalid quiz data. Ensure all fields are provided and options are at least 2." });
        }
        
        const newQuiz = { question, options, correctAnswer };
        const result = await quizzesCollection.insertOne(newQuiz);
        res.status(201).json({ _id: result.insertedId, ...newQuiz });
    } catch (err) {
        res.status(500).json({ message: "Error adding quiz", error: err.message });
    }
});

// ✅ PUT: Update a Quiz
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { question, options, correctAnswer } = req.body;
        if (!question || !options || !correctAnswer || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ message: "Invalid quiz data." });
        }
        
        const result = await quizzesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { question, options, correctAnswer } }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Quiz not found." });
        }
        
        res.json({ message: "Quiz updated successfully." });
    } catch (err) {
        res.status(500).json({ message: "Error updating quiz", error: err.message });
    }
});

// ✅ DELETE: Remove a Quiz
router.delete("/:id", async (req, res) => {
    try {
        const result = await quizzesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Quiz not found." });
        }
        res.json({ message: "Quiz deleted successfully." });
    } catch (err) {
        res.status(500).json({ message: "Error deleting quiz", error: err.message });
    }
});

module.exports = { router, initializeCollections };
