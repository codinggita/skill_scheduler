const { MongoClient } = require('mongodb');

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017";  // MongoDB connection URI
const dbName = "skill_scheduler";         // Database name

let db, dashboards;

// Connect to MongoDB and initialize collections
MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if DB connection fails
    }
    console.log("Connected to MongoDB");

    db = client.db(dbName);
    dashboards = db.collection("dashboards"); // The collection for dashboards
});

// CRUD Operations

// GET: List all dashboards
function getDashboards(req, res) {
    dashboards.find().toArray((err, allDashboards) => {
        if (err) {
            res.status(500).send("Error fetching dashboards: " + err.message);
        } else {
            res.status(200).json(allDashboards);
        }
    });
}

// POST: Add a new dashboard
function addDashboard(req, res) {
    const newDashboard = req.body; // Get the new dashboard data from request body
    dashboards.insertOne(newDashboard, (err, result) => {
        if (err) {
            res.status(500).send("Error adding dashboard: " + err.message);
        } else {
            res.status(201).send(`Dashboard added with ID: ${result.insertedId}`);
        }
    });
}

// PUT: Update a dashboard completely
function updateDashboard(req, res) {
    const userId = req.params.userId; // Get userId from request params
    const updatedDashboard = req.body; // Get updated data from the request body
    dashboards.replaceOne({ userId }, updatedDashboard, (err, result) => {
        if (err) {
            res.status(500).send("Error updating dashboard: " + err.message);
        } else {
            res.status(200).send(`${result.modifiedCount} document(s) updated`);
        }
    });
}

// PATCH: Partially update a dashboard
function patchDashboard(req, res) {
    const userId = req.params.userId; // Get userId from request params
    const updates = req.body;         // Get updates from the request body
    dashboards.updateOne({ userId }, { $set: updates }, (err, result) => {
        if (err) {
            res.status(500).send("Error partially updating dashboard: " + err.message);
        } else {
            res.status(200).send(`${result.modifiedCount} document(s) updated`);
        }
    });
}

// DELETE: Remove a dashboard
function deleteDashboard(req, res) {
    const userId = req.params.userId; // Get userId from request params
    dashboards.deleteOne({ userId }, (err, result) => {
        if (err) {
            res.status(500).send("Error deleting dashboard: " + err.message);
        } else {
            res.status(200).send(`${result.deletedCount} document(s) deleted`);
        }
    });
}

module.exports = {
    getDashboards,
    addDashboard,
    updateDashboard,
    patchDashboard,
    deleteDashboard
};
