const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI || "mongodb+srv://ishitatrivedi2401:ishitatrivedi061106@cluster0.j2rs8.mongodb.net/skill_scheduler";

// ✅ Middleware
app.use(express.json());
app.use(cors());

let db;

// ✅ Import Routes
const { router: dashboardRouter, initializeCollections: initializeDashboard } = require("./dashboard");
const { router: notesRouter, initializeCollections: initializeNotes } = require("./notes");
const { router: plannerRouter, initializeCollections: initializePlanner } = require("./planner");
const { router: quizzeRouter, initializeCollections: initializeQuizzes } = require("./quizz");

// ✅ Connect to MongoDB and initialize collections
async function initializeDatabase() {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("✅ Connected to MongoDB");
    
    db = client.db();
    const collections = await db.listCollections().toArray();
    console.log("Available Collections:", collections.map(c => c.name));

    // ✅ Initialize Collections
    initializeDashboard(db);
    initializeNotes(db);
    initializePlanner(db);
    initializeQuizzes(db);

    // ✅ Register API Routes
    app.use("/api/dashboard", dashboardRouter);
    app.use("/api/notes", notesRouter);
    app.use("/api/planner", plannerRouter);
    app.use("/api/quizz", quizzeRouter);

    // ✅ Start the Server
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
}

// ✅ Start Database Initialization
initializeDatabase();