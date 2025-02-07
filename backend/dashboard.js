const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// MongoDB connection (this will be initialized in server.js)
let db;
let plannerCollection;
let notesCollection;
let dashboardCollection;

// Function to initialize collections
const initializeCollections = (database) => {
    db = database;
    planndashboardCollection = db.collection('dashboard');erCollection = db.collection('planner');
    notesCollection = db.collection('notes');
};

// GET: Dashboard data
router.get('/dashboard', async (req, res) => {
    try {
        const totalTasks = await plannerCollection.countDocuments();
        const completedTasks = await plannerCollection.countDocuments({ status: "Completed" });

        const taskCompletionPercentage = ((completedTasks / totalTasks) * 100).toFixed(2);
        const notesOverview = await notesCollection.find({}, { projection: { id: 1, title: 1, content: 1, createdAt: 1 } }).toArray();

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

router.get('/progress', async (req, res) => {
    try {
        const progressData = await dashboardCollection.findOne({ type: "progress" });
        if (!progressData) return res.status(404).send("No progress data found");

        res.status(200).json(progressData);
    } catch (err) {
        res.status(500).send("Error fetching progress data: " + err.message);
    }
});

router.post("/api/progress", async (req, res) => {
    try {
        const progressArray1 = req.body; // Should be an array of objects
        if (!Array.isArray(progressArray1)) {
            return res.status(400).json({ message: "Expected an array of progress records" });
        }

        const result = await db.collection("progress").insertMany(progressArray1);
        res.status(201).json({ message: "Progress records added successfully", insertedCount: result.insertedCount });
    } catch (error) {
        console.error("Error adding progress:", error);
        res.status(500).json({ message: "Error adding progress" });
    }
});

router.get('/notes-overview', async (req, res) => {
    try {
        const notesOverview = await dashboardCollection.findOne({ type: "notes-overview" });
        if (!notesOverview) return res.status(404).send("No notes overview found");

        res.status(200).json(notesOverview);
    } catch (err) {
        res.status(500).send("Error fetching notes overview: " + err.message);
    }
});

// ✅ POST: Add Notes Overview

  
  router.post("/api/notes-overview", async (req, res) => {
    try {
        const progressArray = req.body; // Should be an array of objects
        if (!Array.isArray(progressArray)) {
            return res.status(400).json({ message: "Expected an array of progress records" });
        }

        const result = await db.collection("progress").insertMany(progressArray);
        res.status(201).json({ message: "Progress records added successfully", insertedCount: result.insertedCount });
    } catch (error) {
        console.error("Error adding progress:", error);
        res.status(500).json({ message: "Error adding progress" });
    }
});
  

// ✅ GET: Fetch Upcoming Exam Dates
router.get('/upcoming-exams', async (req, res) => {
    try {
        const exams = await dashboardCollection.find({ type: "exam-date" }).toArray();
        if (!exams.length) return res.status(404).send("No upcoming exams found");

        res.status(200).json(exams);
    } catch (err) {
        res.status(500).send("Error fetching exam dates: " + err.message);
    }
});

// ✅ POST: Add Progress Data (For Testing)

// Export the router and the initializeCollections function
module.exports = { router, initializeCollections };

