const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Create a new user
router.post("/create", async (req, res) => {
  const { username } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get user data
router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update grass points, streak, and garden
router.put("/update", async (req, res) => {
  const { username, grassPoints, gardenItem } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate if today is a new day compared to the lastActiveDate
    const today = new Date().setHours(0, 0, 0, 0); // Start of today
    const lastActive = user.lastActiveDate
      ? new Date(user.lastActiveDate).setHours(0, 0, 0, 0)
      : null;

    if (lastActive !== today) {
      if (lastActive === new Date(today - 86400000)) {
        // If last active was yesterday, increment streak
        user.streak += 1;
      } else {
        // If last active was not yesterday, reset streak
        user.streak = 1;
      }
      // Clear garden for the new day
      user.garden = [];
    }

    // Update grass points and last active date
    user.grassPoints = (user.grassPoints || 0) + grassPoints;
    user.lastActiveDate = new Date();

    // Add a garden item if provided (e.g., "tree" or "flower")
    if (gardenItem) {
      user.garden.push({ type: gardenItem });
    }

    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
