const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb+srv://ishitatrivedi2401:ishitatrivedi061106@cluster0.j2rs8.mongodb.net/";
const dbName = "skill_scheduler";

// Middleware
app.use(express.json());
app.use(cors());

let db;

// Import Routes
const { router: dashboardRouter, initializeCollections: initializeDashboard } = require('./dashboard');
const { router: notesRouter, initializeCollections: initializeNotes } = require('./notes');
const { router: plannerRouter, initializeCollections: initializePlanner } = require('./planner');
const { router: quizzesRouter, initializeCollections: initializeQuizzes } = require('./quizz');

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Connected to MongoDB");

        db = client.db(dbName);

        // ✅ Initialize collections properly
        initializeDashboard(db);
        initializeNotes(db);
        initializePlanner(db);
        initializeQuizzes(db);

        // ✅ Register API routes
        app.use('/api/dashboard', dashboardRouter);
        app.use('/api/notes', notesRouter);
        app.use('/api/planner', plannerRouter);
        app.use("/api/quizz", quizzesRouter);

        // ✅ Start the server
        app.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("❌ Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

// ✅ Start Database Initialization
initializeDatabase();
