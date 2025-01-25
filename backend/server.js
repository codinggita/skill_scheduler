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
let db, dashboards;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        dashboards = db.collection("dashboards");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// CRUD Routes for Dashboards

// GET: List all dashboards
app.get('/dashboards', (req, res) => {
    dashboards.find().toArray((err, allDashboards) => {
        if (err) {
            res.status(500).send("Error fetching dashboards: " + err.message);
        } else {
            res.status(200).json(allDashboards);
        }
    });
});

// POST: Add a new dashboard
app.post('/dashboards', (req, res) => {
    const newDashboard = req.body; // Get the new dashboard data from request body
    dashboards.insertOne(newDashboard, (err, result) => {
        if (err) {
            res.status(500).send("Error adding dashboard: " + err.message);
        } else {
            res.status(201).send(`Dashboard added with ID: ${result.insertedId}`);
        }
    });
});

// PUT: Update a dashboard completely
app.put('/dashboards/:userId', (req, res) => {
    const userId = req.params.userId; // Get userId from request params
    const updatedDashboard = req.body; // Get updated data from the request body
    dashboards.replaceOne({ userId }, updatedDashboard, (err, result) => {
        if (err) {
            res.status(500).send("Error updating dashboard: " + err.message);
        } else {
            res.status(200).send(`${result.modifiedCount} document(s) updated`);
        }
    });
});

// PATCH: Partially update a dashboard
app.patch('/dashboards/:userId', (req, res) => {
    const userId = req.params.userId; // Get userId from request params
    const updates = req.body;         // Get updates from the request body
    dashboards.updateOne({ userId }, { $set: updates }, (err, result) => {
        if (err) {
            res.status(500).send("Error partially updating dashboard: " + err.message);
        } else {
            res.status(200).send(`${result.modifiedCount} document(s) updated`);
        }
    });
});

// DELETE: Remove a dashboard
app.delete('/dashboards/:userId', (req, res) => {
    const userId = req.params.userId; // Get userId from request params
    dashboards.deleteOne({ userId }, (err, result) => {
        if (err) {
            res.status(500).send("Error deleting dashboard: " + err.message);
        } else {
            res.status(200).send(`${result.deletedCount} document(s) deleted`);
        }
    });
});
