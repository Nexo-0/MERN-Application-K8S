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
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Node.js server is running",
  });
});

// GET - Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);

    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// POST - Create new user
app.post("/api/users", async (req, res) => {
  try {
    const { name, age, city } = req.body;

    // Validation
    if (!name || !age || !city) {
      return res.status(400).json({
        message: "Name, age and city are required",
      });
    }

    const newUser = new User({
      name,
      age,
      city,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);

    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
});

// DELETE - Delete user
app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);

    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

// Start server
async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

startServer();

