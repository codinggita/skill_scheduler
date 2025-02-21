// const express = require("express");
// const router = express.Router();
// const { ObjectId } = require("mongodb");

// let db;
// let quizzesCollection;


// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: "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",
// });

// const completion = openai.chat.completions.create({
//   model: "gpt-4o-mini",
//   store: true,
//   messages: [
//     {"role": "user", "content": "write a haiku about ai"},
//   ],
// });

// completion.then((result) => console.log(result.choices[0].message));

// // Function to initialize collections
// const initializeCollections = (database) => {
//     db = database;
//     quizzesCollection = db.collection("quizzes");
// };

// // ✅ GET: Fetch All Quizzes
// router.get("/", async (req, res) => {
//     try {
//         const quizzes = await quizzesCollection.find().toArray();
//         res.status(200).json(quizzes);
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching quizzes", error: err.message });
//     }
// });

// // ✅ POST: Add a Quiz
// router.post("/", async (req, res) => {
//     try {
//         const { question, options, correctAnswer } = req.body;
//         if (!question || !options || !correctAnswer || !Array.isArray(options) || options.length < 2) {
//             return res.status(400).json({ message: "Invalid quiz data. Ensure all fields are provided and options are at least 2." });
//         }
        
//         const newQuiz = { question, options, correctAnswer };
//         const result = await quizzesCollection.insertOne(newQuiz);
//         res.status(201).json({ _id: result.insertedId, ...newQuiz });
//     } catch (err) {
//         res.status(500).json({ message: "Error adding quiz", error: err.message });
//     }
// });

// // ✅ PUT: Update a Quiz
// router.put("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { question, options, correctAnswer } = req.body;
//         if (!question || !options || !correctAnswer || !Array.isArray(options) || options.length < 2) {
//             return res.status(400).json({ message: "Invalid quiz data." });
//         }
        
//         const result = await quizzesCollection.updateOne(
//             { _id: new ObjectId(id) },
//             { $set: { question, options, correctAnswer } }
//         );
        
//         if (result.matchedCount === 0) {
//             return res.status(404).json({ message: "Quiz not found." });
//         }
        
//         res.json({ message: "Quiz updated successfully." });
//     } catch (err) {
//         res.status(500).json({ message: "Error updating quiz", error: err.message });
//     }
// });

// // ✅ DELETE: Remove a Quiz
// router.delete("/:id", async (req, res) => {
//     try {
//         const result = await quizzesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
//         if (result.deletedCount === 0) {
//             return res.status(404).json({ message: "Quiz not found." });
//         }
//         res.json({ message: "Quiz deleted successfully." });
//     } catch (err) {
//         res.status(500).json({ message: "Error deleting quiz", error: err.message });
//     }
// });

// module.exports = { router, initializeCollections };



const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Generate quiz from notes using OpenAI
router.post("/generate-quiz", async (req, res) => {
    const { notes } = req.body; // User's notes

    if (!notes) {
        return res.status(400).json({ error: "Notes are required to generate a quiz" });
    }

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a quiz generator. Create a multiple-choice quiz from the given notes." },
                    { role: "user", content: `Generate a quiz with 3 multiple-choice questions from these notes:\n\n${notes}` }
                ],
                max_tokens: 500,
                temperature: 0.7,
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                }
            }
        );

        const generatedQuiz = response.data.choices[0].message.content;

        res.json({ quiz: generatedQuiz });
    } catch (error) {
        console.error("Error generating quiz:", error);
        res.status(500).json({ error: "Failed to generate quiz" });
    }
});

module.exports = router;
