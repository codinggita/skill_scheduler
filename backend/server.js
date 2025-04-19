const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI || "mongodb+srv://ishitatrivedi2401:ishitatrivedi061106@cluster0.j2rs8.mongodb.net/skill_scheduler";

// Enhanced CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173", "https://skill-scheduler.onrender.com"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions)); // Apply CORS with options
app.options("*", cors(corsOptions)); // Enable pre-flight for all routes

let db;
let client; // Store the client for proper shutdown

// Import Routes
const { router: dashboardRouter, initializeCollections: initializeDashboard } = require("./dashboard");
const { router: notesRouter, initializeCollections: initializeNotes } = require("./notes");
const { router: plannerRouter, initializeCollections: initializePlanner } = require("./planner");
const { router: quizzRouter, initializeCollections: initializeQuizzes } = require("./quizz");

// Database connection and server startup
async function initializeDatabase() {
  try {
    client = new MongoClient(uri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Fail fast if can't connect
    });
    
    await client.connect();
    console.log("✅ Connected to MongoDB");
    
    db = client.db();
    
    // Verify collections exist or create them
    const requiredCollections = ["quizzes", "performance", "notes", "planner"];
    const existingCollections = (await db.listCollections().toArray()).map(c => c.name);
    
    for (const collection of requiredCollections) {
      if (!existingCollections.includes(collection)) {
        await db.createCollection(collection);
        console.log(`Created collection: ${collection}`);
      }
    }

    // Initialize collections for each module
    initializeDashboard(db);
    initializeNotes(db);
    initializePlanner(db);
    initializeQuizzes(db);

    // Register API Routes
    app.use("/api/dashboard", dashboardRouter);
    app.use("/api/notes", notesRouter);
    app.use("/api/planner", plannerRouter);
    app.use("/api/quizz", quizzRouter);

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.status(200).json({ status: "OK", db: db ? "connected" : "disconnected" });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error("Server error:", err);
      res.status(500).json({ error: "Internal server error" });
    });

    // Start server
    const server = app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      await client.close();
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });

  } catch (err) {
    console.error("❌ Error initializing application:", err.message);
    process.exit(1);
  }
}

initializeDatabase();