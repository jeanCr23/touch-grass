const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron"); // Import node-cron for scheduled tasks
require("dotenv").config(); // To load environment variables from a .env file

const User = require("./models/User"); // Import the User model

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for cross-origin requests

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Importing the userRoutes
const userRoutes = require("./routes/userRoutes");

// Use the userRoutes for any requests to /api/users
app.use("/api/users", userRoutes);

// Simple Route to Test
app.get("/", (req, res) => {
  res.send("Hello from Touch Grass Backend!");
});

// Daily Reset Job: Runs every day at midnight (00:00)
//finished testing by minute
cron.schedule("0 0 * * *", async () => {
  console.log("🌅 Daily reset job running...");

  try {
    await User.updateMany(
      {},
      {
        $set: {
          garden: [], // Clear the garden
          // Optionally reset streak or other fields if required
          // Example: streak: 1, // Uncomment if you wish to reset the streak to 1 every day
        },
      }
    );
    console.log("✅ Daily reset complete.");
  } catch (err) {
    console.error("❌ Error during daily reset:", err.message);
  }
});

// Start Server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
