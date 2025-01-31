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
        res.status(500).send("Error fetching quizzes: " + err.message);
    }
});

// ✅ POST: Add a Quiz
router.post("/", async (req, res) => {
    try {
        const result = await quizzesCollection.insertOne(req.body);
        res.status(201).json({ _id: result.insertedId, ...req.body });
    } catch (err) {
        res.status(500).send("Error adding quiz: " + err.message);
    }
});

// ✅ DELETE: Remove a Quiz
router.delete("/:id", async (req, res) => {
    try {
        await quizzesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Quiz deleted" });
    } catch (err) {
        res.status(500).send("Error deleting quiz: " + err.message);
    }
});

module.exports = { router, initializeCollections };
