const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

let db;
let dashboardCollection;
let plannerCollection;
let notesCollection;

// ✅ Function to initialize collections
const initializeCollections = (database) => {
    db = database;
    dashboardCollection = db.collection('dashboard'); 
    plannerCollection = db.collection('planner');
    notesCollection = db.collection('notes');

    console.log("✅ Dashboard collections initialized.");
};

// ✅ GET: Dashboard data 
router.get('/dashboard', async (req, res) => {
    try {
        if (!plannerCollection || !notesCollection) {
            return res.status(500).json({ error: "Database collections not initialized" });
        }

        const totalTasks = await plannerCollection.countDocuments();
        const completedTasks = await plannerCollection.countDocuments({ status: "Completed" });

        const taskCompletionPercentage = totalTasks > 0 
            ? ((completedTasks / totalTasks) * 100).toFixed(2) 
            : 0;

        const notesOverview = await notesCollection.find({}, { 
            projection: { id: 1, title: 1, content: 1, createdAt: 1 } 
        }).toArray();

        const progressData = await dashboardCollection.findOne({ type: "progress" }) || {};

        res.status(200).json({
            progressReport: {
                totalTasks,
                completedTasks,
                taskCompletionPercentage
            },
            studiedHours: progressData.studiedHours || 0,
            quizProgress: progressData.quizProgress || 0,
            notesOverview
        });
    } catch (err) {
        res.status(500).json({ error: "Error fetching dashboard data", details: err.message });
    }
});

// ✅ GET: Progress Data
router.get('/progress', async (req, res) => {
    try {
        if (!dashboardCollection) {
            return res.status(500).json({ error: "Dashboard collection not initialized" });
        }

        const progressData = await dashboardCollection.findOne({ type: "progress" }) || {};
        res.status(200).json(progressData);
    } catch (err) {
        res.status(500).json({ error: "Error fetching progress data", details: err.message });
    }
});

// ✅ POST: Add Progress Data
router.post("/progress", async (req, res) => {
    try {
        if (!dashboardCollection) {
            return res.status(500).json({ error: "Dashboard collection not initialized" });
        }

        const progressArray = req.body;
        if (!Array.isArray(progressArray)) {
            return res.status(400).json({ message: "Expected an array of progress records" });
        }

        const result = await dashboardCollection.insertMany(progressArray);
        res.status(201).json({ 
            message: "Progress records added successfully", 
            insertedCount: result.insertedCount 
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding progress", details: error.message });
    }
});

// ✅ GET: Notes Overview
router.get('/notes-overview', async (req, res) => {
    try {
        if (!notesCollection) {
            return res.status(500).json({ error: "Notes collection not initialized" });
        }

        const notesOverview = await notesCollection.find({}).toArray();
        res.status(200).json(notesOverview);
    } catch (err) {
        res.status(500).json({ error: "Error fetching notes overview", details: err.message });
    }
});

// ✅ POST: Add Notes Overview
router.post("/notes-overview", async (req, res) => {
    try {
        if (!notesCollection) {
            return res.status(500).json({ error: "Notes collection not initialized" });
        }

        const notesArray = req.body;
        if (!Array.isArray(notesArray)) {
            return res.status(400).json({ message: "Expected an array of notes" });
        }

        const result = await notesCollection.insertMany(notesArray);
        res.status(201).json({ 
            message: "Notes added successfully", 
            insertedCount: result.insertedCount 
        });
    } catch (error) {
        res.status(500).json({ error: "Error adding notes", details: error.message });
    }
});

// ✅ GET: Fetch Upcoming Exam Dates
router.get('/upcoming-exams', async (req, res) => {
    try {
        if (!dashboardCollection) {
            return res.status(500).json({ error: "Dashboard collection not initialized" });
        }

        const exams = await dashboardCollection.find({ type: "exam-date" }).toArray();
        if (!exams.length) {
            return res.status(404).json({ message: "No upcoming exams found" });
        }

        res.status(200).json(exams);
    } catch (err) {
        res.status(500).json({ error: "Error fetching exam dates", details: err.message });
    }
});

// ✅ Export the router and initializeCollections function
module.exports = { router, initializeCollections };
