const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

// MongoDB connection (initialized in server.js)
let db;
let plannerCollection;
let examsCollection;
let studyPlannerCollection;

// Function to initialize collections
const initializeCollections = (database) => {
    db = database;
    plannerCollection = db.collection("planner");
    examsCollection = db.collection("exams");
    studyPlannerCollection = db.collection("studyPlanner");
};

/* -------------- TODO List -------------- */

// ✅ GET: Fetch All Tasks
router.get("/pending-work", async (req, res) => {
    try {
        const tasks = await plannerCollection.find().toArray();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Error fetching tasks", message: err.message });
    }
});

// ✅ POST: Add a New Task
router.post("/to-do", async (req, res) => {
    try {
        const task = { ...req.body, completed: false, createdAt: new Date() };
        const result = await plannerCollection.insertOne(task);
        res.status(201).json({ _id: result.insertedId, ...task });
    } catch (err) {
        res.status(500).json({ error: "Error adding task", message: err.message });
    }
});

// ✅ PUT: Update Task (Mark as Complete)
router.put("/to-do/:id", async (req, res) => {
    try {
        const { completed } = req.body;
        const result = await plannerCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { completed } }
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Error updating task", message: err.message });
    }
});

// ✅ DELETE: Remove a Task
router.delete("/to-do/:id", async (req, res) => {
    try {
        await plannerCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting task", message: err.message });
    }
});

/* -------------- Exam Dates, Subjects, and Pending Work -------------- */

// ✅ GET: Fetch All Exams
router.get("/exams", async (req, res) => {
    const limit = parseInt(req.query.limit);
    
    try {
        if (isNaN(limit)) {
            const exams = await examsCollection.find().sort({ date: 1 }).toArray();
            res.status(200).json(exams);
        } else {
            const firstExams = await examsCollection.find({})
                .sort({ date: 1 })
                .limit(limit)
                .toArray();
            res.status(200).json(firstExams);
        }
    } catch (err) {
        res.status(500).json({ error: "Error fetching exams", message: err.message });
    }
});

// ✅ POST: Add an Exam
router.post("/exams", async (req, res) => {
    try {
        const exam = { ...req.body, createdAt: new Date() };
        const result = await examsCollection.insertOne(exam);
        res.status(201).json({ _id: result.insertedId, ...exam });
    } catch (err) {
        res.status(500).json({ error: "Error adding exam", message: err.message });
    }
});

// ✅ PUT: Update Exam Details
router.put("/exams/:id", async (req, res) => {
    try {
        const updatedExam = req.body;
        const result = await examsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedExam }
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Error updating exam", message: err.message });
    }
});

// ✅ DELETE: Remove an Exam
router.delete("/exams/:id", async (req, res) => {
    try {
        await examsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Exam deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting exam", message: err.message });
    }
});

/* -------------- Study Planner (Start Date, End Date, Subject-Wise Tasks) -------------- */

// ✅ GET: Fetch All Study Plans
router.get("/study-planner", async (req, res) => {
    try {
        const data = await studyPlannerCollection.find().toArray();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: "Error fetching study plans", message: err.message });
    }
});

// ✅ GET: Fetch Study Plan for a Subject by ID
router.get("/study-plan/:id", async (req, res) => {
    try {
        const subjectPlan = await studyPlannerCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!subjectPlan) {
            return res.status(404).json({ message: "No study plan found" });
        }
        res.status(200).json(subjectPlan);
    } catch (err) {
        res.status(500).json({ error: "Error fetching study plan", message: err.message });
    }
});

// ✅ POST: Add a Study Plan
router.post("/study-plan", async (req, res) => {
    try {
        const studyPlan = { ...req.body, createdAt: new Date() };
        const result = await studyPlannerCollection.insertOne(studyPlan);
        res.status(201).json({ _id: result.insertedId, ...studyPlan });
    } catch (err) {
        res.status(500).json({ error: "Error adding study plan", message: err.message });
    }
});

// ✅ PUT: Update Study Plan
router.put("/study-plan/:id", async (req, res) => {
    try {
        const updatedPlan = req.body;
        const result = await studyPlannerCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedPlan }
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Error updating study plan", message: err.message });
    }
});

// ✅ DELETE: Remove a Study Plan
router.delete("/study-plan/:id", async (req, res) => {
    try {
        await studyPlannerCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Study plan deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting study plan", message: err.message });
    }
});

// Export the router and initialize function
module.exports = { router, initializeCollections };
