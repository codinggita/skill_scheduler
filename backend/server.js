const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const session = require("express-session");
const authRoutes = require("./auth"); // Import authentication routes

const app = express();
const port = 3000;

// ✅ MongoDB connection URI
const uri = "mongodb+srv://ishitatrivedi2401:ishitatrivedi061106@cluster0.j2rs8.mongodb.net/skill_scheduler";

// ✅ Middleware
app.use(express.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend-domain.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

let db;

// ✅ Import Routes
const { router: authRouter, initializeCollections: initializeAuth } = require("./auth");
const { router: dashboardRouter, initializeCollections: initializeDashboard } = require("./dashboard");
const { router: notesRouter, initializeCollections: initializeNotes } = require("./notes");
const { router: plannerRouter, initializeCollections: initializePlanner } = require("./planner");
const { router: quizzeRouter, initializeCollections: initializeQuizzes } = require("./quizz");




// ✅ Connect to MongoDB and initialize collections
async function initializeDatabase() {
  try {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected to MongoDB");

    db = client.db();

    // ✅ Initialize Collections
    initializeAuth(db);
    initializeDashboard(db);
    initializeNotes(db);
    initializePlanner(db);
    initializeQuizzes(db);
    

    // ✅ Register API Routes
    app.use("/api/auth", authRouter); // 🔥 Authentication routes
    app.use("/api/dashboard", dashboardRouter);
    app.use("/api/notes", notesRouter);
    app.use("/api/planner", plannerRouter);
    app.use("/api/quizz", quizzeRouter);
   

    // ✅ Start the Server
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
