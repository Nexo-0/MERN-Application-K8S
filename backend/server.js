require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Check MongoDB URI
if (!MONGO_URI) {
  console.error("MONGO_URI is not defined");
  process.exit(1);
}

// MongoDB Schema
const userSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    city: String
  },
  {
    collection: "users"
  }
);

const User = mongoose.model("User", userSchema);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Node.js server is running"
  });
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);

    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message
    });
  }
});

// Start server
async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB replica set");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

startServer();
