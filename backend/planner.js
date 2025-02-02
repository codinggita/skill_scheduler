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
        res.status(500).send("Error fetching tasks: " + err.message);
    }
});

// ✅ POST: Add a New Task
router.post("/to-do", async (req, res) => {
    try {
        const task = { ...req.body, completed: false, createdAt: new Date() };
        const result = await plannerCollection.insertOne(task);
        res.status(201).json({ _id: result.insertedId, ...task });
    } catch (err) {
        res.status(500).send("Error adding task: " + err.message);
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
        res.status(500).send("Error updating task: " + err.message);
    }
});

// ✅ DELETE: Remove a Task
router.delete("/to-do/:id", async (req, res) => {
    try {
        await plannerCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).send("Error deleting task: " + err.message);
    }
});

/* -------------- Exam Dates, Subjects, and Pending Work -------------- */

// ✅ GET: Fetch All Exams
router.get("/exams", async (req, res) => {
    try {
        const exams = await examsCollection.find().toArray();
        res.status(200).json(exams);
    } catch (err) {
        res.status(500).send("Error fetching exams: " + err.message);
    }
});

// ✅ POST: Add an Exam
router.post("/exams", async (req, res) => {
    try {
        const exam = { ...req.body, createdAt: new Date() };
        const result = await examsCollection.insertOne(exam);
        res.status(201).json({ _id: result.insertedId, ...exam });
    } catch (err) {
        res.status(500).send("Error adding exam: " + err.message);
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
        res.status(500).send("Error updating exam: " + err.message);
    }
});

// ✅ DELETE: Remove an Exam
router.delete("/exams/:id", async (req, res) => {
    try {
        await examsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Exam deleted" });
    } catch (err) {
        res.status(500).send("Error deleting exam: " + err.message);
    }
});

/* -------------- Study Planner (Start Date, End Date, Subject-Wise Tasks) -------------- */

// ✅ GET: Fetch Study Plan for a Subject

router.get("/study-planner", async (req, res) => {
    const data = await studyPlannerCollection.find();
    res.status(200).json(await data.toArray());
    })
router.get("/study-plan/:id", async (req, res) => {
    try {
        const subjectPlan = await studyPlannerCollection.findOne({ subject: req.params.subject });
        if (!subjectPlan) return res.status(404).json({ message: "No study plan found for this subject" });
        res.status(200).json(subjectPlan);
    } catch (err) {
        res.status(500).send("Error fetching study plan: " + err.message);
    }
});

// ✅ POST: Add a Study Plan
router.post("/study-plan", async (req, res) => {
    try {
        const studyPlan = { ...req.body, createdAt: new Date() };
        const result = await studyPlannerCollection.insertOne(studyPlan);
        res.status(201).json({ _id: result.insertedId, ...studyPlan });
    } catch (err) {
        res.status(500).send("Error adding study plan: " + err.message);
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
        res.status(500).send("Error updating study plan: " + err.message);
    }
});

// ✅ DELETE: Remove a Study Plan
router.delete("/study-plan/:id", async (req, res) => {
    try {
        await studyPlannerCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Study plan deleted" });
    } catch (err) {
        res.status(500).send("Error deleting study plan: " + err.message);
    }
});

// Export the router and initialize function
module.exports = { router, initializeCollections };
