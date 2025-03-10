// const express = require("express");
// const router = express.Router();
// const { ObjectId } = require("mongodb");
// const cors = require("cors");

// // MongoDB connection
// let db;
// let quizzesCollection;
// let quizSubmissionsCollection; // Collection to store quiz submissions

// const initializeCollections = (database) => {
//   db = database;
//   quizzesCollection = db.collection("quizzes");
//   quizSubmissionsCollection = db.collection("performance"); // New collection
// };

// // ✅ Updated CORS Options
// const corsOptions = {
//   origin: ['http://localhost:5173', 'https://skill-scheduler.onrender.com'],
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

// router.use(cors(corsOptions));
// router.options("*", cors(corsOptions));

// /* -------------- Quizzes API -------------- */

// // ✅ GET: Fetch All Quizzes
// router.get("/quizzes", async (req, res) => {
//   try {
//     const quizzes = await quizzesCollection.find().toArray();
//     res.status(200).json(quizzes);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching quizzes", message: err.message });
//   }
// });

// // ✅ POST: Generate a Quiz
// router.post("/api/quizz/generate-quiz", async (req, res) => {
//   try {
//     const numQuestions = req.body.numQuestions || 5;
//     const quizzes = await quizzesCollection.find().toArray();

//     const allQuestions = quizzes.flatMap((quiz) =>
//       (quiz.questions || []).map((q) => ({
//         question: q.question,
//         options: q.options || [],
//       }))
//     );

//     if (allQuestions.length === 0) {
//       return res.status(400).json({ error: "No questions available to generate quiz" });


//     }

//     const numToSelect = Math.min(numQuestions, allQuestions.length);
//     const shuffledQuestions = allQuestions
//       .sort(() => Math.random() - 0.5)
//       .slice(0, numToSelect);

//     const generatedQuiz = { title: "Generated Quiz", questions: shuffledQuestions };

//     res.status(201).json(generatedQuiz);
//   } catch (err) {
//     res.status(500).json({ error: "Error generating quiz", message: err.message });

//   }
// });

    
// // ✅ POST: Submit Quiz
// router.post("/submit-quiz", async (req, res) => {
//   try {
//     const { quizId, answers } = req.body;

//     console.log("Received answers:", answers);

//     if (!quizId || !answers || typeof answers !== "object") {
//       return res.status(400).json({ error: "Quiz ID and valid answers object are required" });
//     }

//     const quiz = await quizzesCollection.findOne({ _id: new ObjectId(quizId) });

//     if (!quiz) {
//       return res.status(404).json({ error: "Quiz not found" });
//     }

//     let score = 0;
//     let correctAnswers = {};

//     quiz.questions.forEach((q, index) => {
//       correctAnswers[q.question] = q.correctAnswer; // Store correct answers properly
//       if (answers[q.question] === q.correctAnswer) {
//         score += 1;
//       }
//     });

//     res.status(200).json({
//       message: "Quiz submitted successfully",
//       score,
//       totalQuestions: quiz.questions.length,
//       correctAnswers,
//     });
//   } catch (err) {
//     console.error("Error submitting quiz:", err);
//     res.status(500).json({ error: "Error submitting quiz", message: err.message });
//   }
// });


// // ✅ Export the router and initialize function
// module.exports = { router, initializeCollections };


const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const cors = require("cors");

// MongoDB connection
let db;
let quizzesCollection;
let quizSubmissionsCollection;

const initializeCollections = (database) => {
  db = database;
  quizzesCollection = db.collection("quizzes");
  quizSubmissionsCollection = db.collection("performance"); // Collection to store quiz submissions
};

// ✅ CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'https://skill-scheduler.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

router.use(cors(corsOptions));
router.options("*", cors(corsOptions));

/* -------------- Quizzes API -------------- */

// ✅ GET: Fetch All Quizzes
router.get("/api/quizz/quizzes", async (req, res) => {
  try {
    const quizzes = await quizzesCollection.find().toArray();
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching quizzes", message: err.message });
  }
});

// ✅ POST: Generate a Quiz
router.post("/api/quizz/generate-quiz", async (req, res) => {
  try {
    const numQuestions = req.body.numQuestions || 5;
    const quizzes = await quizzesCollection.find().toArray();

    const allQuestions = quizzes.flatMap((quiz) =>
      (quiz.questions || []).map((q) => ({
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer, // Include correct answers for later validation
      }))
    );

    if (allQuestions.length === 0) {
      return res.status(400).json({ error: "No questions available to generate quiz" });
    }

    const numToSelect = Math.min(numQuestions, allQuestions.length);
    const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5).slice(0, numToSelect);

    const generatedQuiz = { title: "Generated Quiz", questions: shuffledQuestions };

    res.status(201).json(generatedQuiz);
  } catch (err) {
    res.status(500).json({ error: "Error generating quiz", message: err.message });
  }
});

// ✅ POST: Submit Quiz & Calculate Score
router.post("/api/quizz/submit-quiz", async (req, res) => {
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
      correctAnswers[q.question] = q.correctAnswer; // Store correct answers properly
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

// ✅ POST: Check Answers
router.post('/api/quizz/check-answers', async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    if (!quizId || !answers || typeof answers !== "object") {
      return res.status(400).json({ error: "Quiz ID and valid answers object are required" });
    }

    console.log("Received quizId:", quizId);
    console.log("User Answers:", answers);

    // Check if quiz exists in the database
    const quiz = await quizzesCollection.findOne({ _id: new ObjectId(quizId) });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Initialize results object
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const answerDetails = {};

    // Compare user answers with correct answers
    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.question]; // Match answer by question text
      const correctAnswer = question.correctAnswer;
      const isCorrect = userAnswer === correctAnswer;

      answerDetails[question.question] = { userAnswer, correctAnswer, isCorrect };

      if (isCorrect) {
        correctAnswers++;
      } else {
        wrongAnswers++;
      }
    });

    // Return quiz results
    return res.json({
      totalQuestions: quiz.questions.length,
      correctAnswers,
      wrongAnswers,
      answerDetails,
      score: Math.round((correctAnswers / quiz.questions.length) * 100),
    });

  } catch (error) {
    console.error('Error checking answers:', error);
    return res.status(500).json({ error: 'Failed to check answers' });
  }
});

// ✅ Export the router and initialize function
module.exports = { router, initializeCollections };
