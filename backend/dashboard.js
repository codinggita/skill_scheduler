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
    dashboardCollection = db.collection('dashboard');
    plannerCollection = db.collection('planner');
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

router.get('/notes-overview', async (req, res) => {
    try {
        const notesOverview = await dashboardCollection.findOne({ type: "notes-overview" });
        if (!notesOverview) return res.status(404).send("No notes overview found");

        res.status(200).json(notesOverview);
    } catch (err) {
        res.status(500).send("Error fetching notes overview: " + err.message);
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
router.post('/progress', async (req, res) => {
    try {
        const progressData = req.body;
        const result = await dashboardCollection.insertOne(progressData);
        res.status(201).send(`Progress added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding progress: " + err.message);
    }
});

// Export the router and the initializeCollections function
module.exports = { router, initializeCollections };
