const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const cors = require("cors");

// MongoDB connection
let db;
let quizzesCollection;

const initializeCollections = (database) => {
  db = database;
  quizzesCollection = db.collection("quizzes");
};

// ✅ Updated CORS Options
const corsOptions = {
  origin: ['http://localhost:5173', 'https://your-frontend-domain.com'], 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // ✅ Allow Authorization header
  credentials: true, // ✅ Allow credentials (cookies, auth headers)
  optionsSuccessStatus: 200, // ✅ Fix for legacy browsers
};

router.use(cors(corsOptions)); // ✅ Apply CORS globally

// ✅ Enable preflight requests (important for POST requests)
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

// ✅ Export the router and initialize function
module.exports = { router, initializeCollections };
