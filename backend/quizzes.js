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
