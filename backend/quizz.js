const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const cors = require("cors");

// MongoDB connection
let db;
let quizzesCollection;
let quizSubmissionsCollection; // Collection to store quiz submissions

const initializeCollections = (database) => {
  db = database;
  quizzesCollection = db.collection("quizzes");
  quizSubmissionsCollection = db.collection("performance"); // New collection
};

// ✅ Updated CORS Options
const corsOptions = {
  origin: ['http://localhost:5173', 'https://your-frontend-domain.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

router.use(cors(corsOptions));
router.options("*", cors(corsOptions));

/* -------------- Quizzes API -------------- */

// ✅ GET: Fetch All Quizzes
router.get("/quizzes", async (req, res) => {
  try {
    const quizzes = await quizzesCollection.find().toArray();
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching quizzes", message: err.message });
  }
});

// ✅ POST: Generate a Quiz
router.post("/generate-quiz", async (req, res) => {
  try {
    const numQuestions = req.body.numQuestions || 5;
    const quizzes = await quizzesCollection.find().toArray();

    const allQuestions = quizzes.flatMap((quiz) =>
      (quiz.questions || []).map((q) => ({
        question: q.question,
        options: q.options || [],
      }))
    );

    if (allQuestions.length === 0) {
      return res.status(400).json({ error: "No questions available to generate quiz" });
    }

    const numToSelect = Math.min(numQuestions, allQuestions.length);
    const shuffledQuestions = allQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, numToSelect);

    const generatedQuiz = { title: "Generated Quiz", questions: shuffledQuestions };

    res.status(201).json(generatedQuiz);
  } catch (err) {
    res.status(500).json({ error: "Error generating quiz", message: err.message });
  }
});

/* -------------- ✅ Submit Quiz API -------------- */
// ✅ POST: Submit Quiz
router.post("/submit-quiz", async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    if (!quizId || !answers) {
      return res.status(400).json({ error: "Quiz ID and answers are required" });
    }

    // Fetch the original quiz from the database
    const quiz = await quizzesCollection.findOne({ _id: new ObjectId(quizId) });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    let score = 0;
    let correctAnswers = {};

    quiz.questions.forEach((q, index) => {
      correctAnswers[index] = q.correctAnswer; // Assuming the correct answer is stored in DB
      if (answers[index] === q.correctAnswer) {
        score += 1;
      }
    });

    res.status(200).json({
      message: "Quiz submitted successfully",
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
    });
  } catch (err) {
    res.status(500).json({ error: "Error submitting quiz", message: err.message });
  }
});


// ✅ Export the router and initialize function
module.exports = { router, initializeCollections };
