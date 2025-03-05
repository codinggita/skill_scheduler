const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { ObjectId } = require("mongodb");

const router = express.Router();

let db;
let usersCollection;

// Function to initialize collections
const initializeCollections = (database) => {
  db = database;
  usersCollection = db.collection("users");
};

// ✅ User Registration Route
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await usersCollection.insertOne({ username, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully", userId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Error registering user: " + err.message });
  }
});

// ✅ User Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Store user info in session
    req.session.user = { id: user._id, username: user.username };

    res.status(200).json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    res.status(500).json({ error: "Error logging in: " + err.message });
  }
});

// ✅ Get User Profile Route
router.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.status(200).json({ user: req.session.user });
});

// ✅ User Logout Route
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: "Logged out successfully" });
});

// ✅ Export both the router and initializeCollections
module.exports = { router, initializeCollections };
