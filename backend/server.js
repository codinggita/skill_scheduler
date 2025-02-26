const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

// ✅ MongoDB connection details (Added DB name)
const uri = "mongodb+srv://ishitatrivedi2401:ishitatrivedi061106@cluster0.j2rs8.mongodb.net/skill_scheduler";

// Middleware
app.use(express.json());
app.use(cors());

let db;

// ✅ Import Routes
const { router: dashboardRouter, initializeCollections: initializeDashboard } = require('./dashboard');
const { router: notesRouter, initializeCollections: initializeNotes } = require('./notes');
const { router: plannerRouter, initializeCollections: initializePlanner } = require('./planner');
const { router: quizzeRouter, initializeCollections: initializeQuizzes } = require('./quizz');

// ✅ Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Connected to MongoDB");

        db = client.db(); // ✅ Use the connected DB

        // ✅ Ensure all collections are initialized
        initializeDashboard(db);
        initializeNotes(db);
        initializePlanner(db);
        initializeQuizzes(db);

        // ✅ Register API routes after DB is initialized
        app.use('/api/dashboard', dashboardRouter);
        app.use('/api/notes', notesRouter);
        app.use('/api/planner', plannerRouter);
        app.use("/api/quizz", quizzeRouter);

        // ✅ Start the server only if MongoDB connection is successful
        app.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("❌ Error connecting to MongoDB:", err);
        process.exit(1); // ✅ Exit if connection fails
    }
}

// ✅ Start Database Initialization
initializeDatabase();
