const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// MongoDB connection (initialized in server.js)
let db;
let plannerCollection;
let notesCollection;
let dashboardCollection;

// Function to initialize collections
const initializeCollections = (database) => {
    db = database;
    dashboardCollection = db.collection('dashboard');
    plannerCollection = db.collection('planner');
    notesCollection = db.collection('notes');
};

// ✅ GET: Dashboard Data (User-Specific)
router.get('/dashboard', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    try {
        const totalTasks = await plannerCollection.countDocuments({ userId });
        const completedTasks = await plannerCollection.countDocuments({ userId, status: "Completed" });

        const taskCompletionPercentage = totalTasks > 0 
            ? ((completedTasks / totalTasks) * 100).toFixed(2)
            : 0;

        const notesOverview = await notesCollection
            .find({ userId }, { projection: { id: 1, title: 1, content: 1, createdAt: 1 } })
            .toArray();

        res.status(200).json({
            progressReport: {
                totalTasks,
                completedTasks,
                taskCompletionPercentage
            },
            notesOverview
        });
    } catch (err) {
        res.status(500).send("Error fetching dashboard data: " + err.message);
    }
});

// ✅ GET: User Progress
router.get('/progress', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    try {
        const progressData = await dashboardCollection.findOne({ userId, type: "progress" });
        if (!progressData) return res.status(404).send("No progress data found");

        res.status(200).json(progressData);
    } catch (err) {
        res.status(500).send("Error fetching progress data: " + err.message);
    }
});

// ✅ POST: Add User Progress
router.post("/api/progress", async (req, res) => {
    try {
        const { userId, progressArray } = req.body;
        if (!userId || !Array.isArray(progressArray)) {
            return res.status(400).json({ message: "User ID and progress array are required" });
        }

        const progressWithUser = progressArray.map(progress => ({
            ...progress,
            userId
        }));

        const result = await dashboardCollection.insertMany(progressWithUser);
        res.status(201).json({ message: "Progress records added successfully", insertedCount: result.insertedCount });
    } catch (error) {
        console.error("Error adding progress:", error);
        res.status(500).json({ message: "Error adding progress" });
    }
});

// ✅ GET: Notes Overview (User-Specific)
router.get('/notes-overview', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    try {
        const notesOverview = await dashboardCollection.findOne({ userId, type: "notes-overview" });
        if (!notesOverview) return res.status(404).send("No notes overview found");

        res.status(200).json(notesOverview);
    } catch (err) {
        res.status(500).send("Error fetching notes overview: " + err.message);
    }
});

// ✅ POST: Add Notes Overview
router.post("/api/notes-overview", async (req, res) => {
    try {
        const { userId, notesArray } = req.body;
        if (!userId || !Array.isArray(notesArray)) {
            return res.status(400).json({ message: "User ID and notes array are required" });
        }

        const notesWithUser = notesArray.map(note => ({
            ...note,
            userId
        }));

        const result = await dashboardCollection.insertMany(notesWithUser);
        res.status(201).json({ message: "Notes overview added successfully", insertedCount: result.insertedCount });
    } catch (error) {
        console.error("Error adding notes overview:", error);
        res.status(500).json({ message: "Error adding notes overview" });
    }
});

// ✅ GET: Upcoming Exam Dates (User-Specific)
router.get('/upcoming-exams', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    try {
        const exams = await dashboardCollection.find({ userId, type: "exam-date" }).toArray();
        if (!exams.length) return res.status(404).send("No upcoming exams found");

        res.status(200).json(exams);
    } catch (err) {
        res.status(500).send("Error fetching exam dates: " + err.message);
    }
});

// ✅ Export Router & Initialize Collections
module.exports = { router, initializeCollections };
