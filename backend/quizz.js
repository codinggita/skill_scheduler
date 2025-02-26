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
// ✅ POST: Generate a Quiz (Randomly select questions from existing quizzes)
router.post("/generate-quiz", async (req, res) => {
    try {
        const numQuestions = req.body.numQuestions || 5;
        const quizzes = await quizzesCollection.find().toArray();

        // ✅ Ensure we only take quizzes that have a valid `questions` array
        const allQuestions = quizzes
            .filter(quiz => Array.isArray(quiz.questions) && quiz.questions.length > 0)
            .reduce((acc, quiz) => acc.concat(quiz.questions), []);

        if (allQuestions.length === 0) {
            return res.status(404).json({ error: "No questions available to generate a quiz" });
        }

        // ✅ Prevent selecting more questions than available
        const numToSelect = Math.min(numQuestions, allQuestions.length);
        const selectedQuestions = [];

        while (selectedQuestions.length < numToSelect) {
            const randomIndex = Math.floor(Math.random() * allQuestions.length);
            const question = allQuestions.splice(randomIndex, 1)[0];
            if (question) {
                selectedQuestions.push(question);
            }
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
