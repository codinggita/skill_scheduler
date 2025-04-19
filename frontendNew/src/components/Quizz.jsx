const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const cors = require("cors");

// MongoDB connection
let db;
let quizzesCollection;
let quizSubmissionsCollection;
let dashboardCollection;

const initializeCollections = (database) => {
  db = database;
  quizzesCollection = db.collection("quizzes");
  quizSubmissionsCollection = db.collection("performance");
  dashboardCollection = db.collection("dashboard"); // Added dashboardCollection
  console.log("✅ Quiz and Dashboard collections initialized.");
};

// CORS Configuration
const corsOptions = {
  origin: ["http://localhost:5173", "https://skill-scheduler.onrender.com"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

router.use(cors(corsOptions));
router.options("*", cors(corsOptions));

/* -------------- Quizzes API -------------- */

// GET: Fetch All Quizzes
router.get("/quizzes", async (req, res) => {
  try {
    const quizzes = await quizzesCollection.find().toArray();
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching quizzes", message: err.message });
  }
});

// POST: Generate a Quiz
router.post("/generate-quiz", async (req, res) => {
  try {
    const numQuestions = req.body.numQuestions || 5;
    const quizzes = await quizzesCollection.find().toArray();

    const allQuestions = quizzes.flatMap((quiz) =>
      (quiz.questions || []).map((q) => ({
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
      }))
    );

    if (allQuestions.length === 0) {
      return res.status(400).json({ error: "No questions available to generate quiz" });
    }

    const numToSelect = Math.min(numQuestions, allQuestions.length);
    const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5).slice(0, numToSelect);

    const generatedQuiz = {
      title: "Generated Quiz",
      questions: shuffledQuestions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
    };

    res.status(201).json(generatedQuiz);
  } catch (err) {
    console.error("Quiz generation error:", err);
    res.status(500).json({
      error: "Error generating quiz",
      details: err.message,
    });
  }
});

// POST: Check Answers
router.post("/check-answers", async (req, res) => {
  try {
    const { quizId, quiz, answers } = req.body;

    // Enhanced validation
    if (!quizId) return res.status(400).json({ error: "Quiz ID is required" });
    if (!quiz || !Array.isArray(quiz.questions)) {
      return res.status(400).json({ error: "Invalid quiz format" });
    }
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "Answers must be an object" });
    }

    // Verify all questions have correctAnswer
    const hasMissingAnswers = quiz.questions.some((q) => !q.correctAnswer);
    if (hasMissingAnswers) {
      return res.status(400).json({ error: "Some questions are missing correct answers" });
    }

    // Initialize results
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const answerDetails = {};

    // Check each answer
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const correctAnswer = question.correctAnswer;
      const isCorrect = userAnswer === correctAnswer;

      answerDetails[index] = {
        userAnswer: userAnswer || "Not answered",
        correctAnswer,
        isCorrect,
      };

      if (isCorrect) {
        correctAnswers++;
      } else {
        wrongAnswers++;
      }
    });

    // Calculate score
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const totalQuestions = quiz.questions.length;

    // Store results in quizSubmissionsCollection
    await quizSubmissionsCollection.insertOne({
      quizId,
      userId: req.user?.id || "anonymous",
      score,
      correctAnswers,
      wrongAnswers,
      submittedAt: new Date(),
    });

    // Update dashboardCollection with quiz performance
    await dashboardCollection.updateOne(
      { type: "quiz-performance", userId: req.user?.id || "anonymous" },
      {
        $push: {
          history: {
            date: new Date(),
            score,
            correctAnswers,
            totalQuestions,
          },
        },
        $set: {
          lastUpdated: new Date(),
        },
      },
      { upsert: true }
    );

    // Update quizProgress in dashboardCollection
    const performanceData = await dashboardCollection.findOne({
      type: "quiz-performance",
      userId: req.user?.id || "anonymous",
    }) || { history: [] };

    const stats = calculateAverages(performanceData.history);
    await dashboardCollection.updateOne(
      { type: "progress", userId: req.user?.id || "anonymous" },
      {
        $set: {
          quizProgress: stats.accuracy || score, // Use accuracy or latest score
          lastUpdated: new Date(),
        },
      },
      { upsert: true }
    );

    res.json({
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      answerDetails,
      score,
    });
  } catch (error) {
    console.error("Error checking answers:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// POST: Submit Quiz (Legacy endpoint)
router.post("/submit-quiz", async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    if (!quizId || !answers || typeof answers !== "object") {
      return res.status(400).json({ error: "Quiz ID and valid answers object are required" });
    }

    const quiz = await quizzesCollection.findOne({ _id: new ObjectId(quizId) });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    let score = 0;
    let correctAnswers = {};

    quiz.questions.forEach((q) => {
      correctAnswers[q.question] = q.correctAnswer;
      if (answers[q.question] === q.correctAnswer) {
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

// Helper function to calculate averages
const calculateAverages = (history) => {
  if (!history || history.length === 0) return {};
  const totalQuizzes = history.length;
  const totalCorrect = history.reduce((sum, quiz) => sum + quiz.correctAnswers, 0);
  const totalQuestions = history.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
  const totalScore = history.reduce((sum, quiz) => sum + quiz.score, 0);
  return {
    averageScore: Math.round(totalScore / totalQuizzes),
    accuracy: Math.round((totalCorrect / totalQuestions) * 100),
    totalQuizzes,
    totalCorrect,
    totalQuestions,
  };
};

module.exports = { router, initializeCollections };