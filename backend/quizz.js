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

// ✅ GET: Fetch Quiz by Title
router.get("/quizzes/title/:title", async (req, res) => {
    try {
        const title = req.params.title;
        const quiz = await quizzesCollection.findOne({ title });
        if (!quiz) {
            return res.status(404).json({ message: "No quiz found with this title" });
        }
        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).json({ error: "Error fetching quiz", message: err.message });
    }
});

// ✅ POST: Generate a Quiz (Randomly select questions from existing quizzes)
router.post("/generate-quiz", async (req, res) => {
    try {
        const numQuestions = req.body.numQuestions || 5; // Default to 5 questions if not specified
        const quizzes = await quizzesCollection.find().toArray();
        const allQuestions = quizzes.reduce((acc, quiz) => acc.concat(quiz.questions), []);

        // Randomly select questions
        const selectedQuestions = [];
        for (let i = 0; i < numQuestions; i++) {
            const randomIndex = Math.floor(Math.random() * allQuestions.length);
            selectedQuestions.push(allQuestions.splice(randomIndex, 1)[0]);
        }

        const generatedQuiz = {
            title: "Generated Quiz",
            questions: selectedQuestions
        };

        res.status(201).json(generatedQuiz);
    } catch (err) {
        res.status(500).json({ error: "Error generating quiz", message: err.message });
    }
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
