const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017";
const dbName = "skill_scheduler";

// Middleware
app.use(express.json());
app.use(cors());

let db;

// Import Dashboard Routes
const { router: dashboardRouter, initializeCollections: initializeDashboard } = require('./dashboard');

// Import Notes Routes
const { router: notesRouter, initializeCollections: initializeNotes } = require('./notes');

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("✅ Connected to MongoDB");

        db = client.db(dbName);

        // Initialize collections in dashboard.js and notes.js
        initializeDashboard(db);
        initializeNotes(db);

        // Register routes
        app.use('/api/dashboard', dashboardRouter);
        app.use('/api/notes', notesRouter);

        // Start the server
        app.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("❌ Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

// Start Database Initialization
initializeDatabase();
