const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

// MongoDB connection (initialized in server.js)
let db;
let quizzesCollection;

// Function to initialize collections
const initializeCollections = (database) => {
    db = database;
    quizzesCollection = db.collection("quizzes");
};

/* -------------- Quizzes -------------- */

// ✅ GET: Fetch All Quizzes
router.get("/quizzes", async (req, res) => {
    try {
        const quizzes = await quizzesCollection.find().toArray();
        res.status(200).json(quizzes);
    } catch (err) {
        res.status(500).json({ error: "Error fetching quizzes", message: err.message });
    }
});

// ✅ GET: Fetch Quiz by Subject
router.get("/quizzes/subject/:subject", async (req, res) => {
    try {
        const subject = req.params.subject;
        const quiz = await quizzesCollection.findOne({ subject });
        if (!quiz) {
            return res.status(404).json({ message: "No quiz found for this subject" });
        }
        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).json({ error: "Error fetching quiz", message: err.message });
    }
});

// ✅ POST: Generate a Quiz (Randomly select questions from existing quizzes)

router.post("/generate-quiz", async (req, res) => {
    try {
        const numQuestions = req.body.numQuestions || 5;
        const quizzes = await quizzesCollection.find().toArray();

        // ✅ Extract all valid questions
        const allQuestions = quizzes.flatMap(quiz => quiz.questions || []);

        if (allQuestions.length === 0) {
            return res.status(400).json({ error: "No questions available to generate quiz" });
        }

        // ✅ Ensure we don't request more questions than available
        const numToSelect = Math.min(numQuestions, allQuestions.length);

        // ✅ Shuffle questions and pick the first `numToSelect`
        const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5).slice(0, numToSelect);

        const generatedQuiz = {
            title: "Generated Quiz",
            questions: shuffledQuestions
        };

        res.status(201).json(generatedQuiz);
    } catch (err) {
        res.status(500).json({ error: "Error generating quiz", message: err.message });
    }
    res.status(201).json({ /* quiz data */ });
});




// ✅ POST: Add a New Quiz
router.post("/quizzes", async (req, res) => {
    try {
        const quiz = { ...req.body, createdAt: new Date() };
        const result = await quizzesCollection.insertOne(quiz);
        res.status(201).json({ _id: result.insertedId, ...quiz });
    } catch (err) {
        res.status(500).json({ error: "Error adding quiz", message: err.message });
    }
});

// Export the router and initialize function
module.exports = { router, initializeCollections };
