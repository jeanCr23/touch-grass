const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  grassPoints: {
    type: Number,
    default: 0, // Total points collected
  },
  streak: {
    type: Number,
    default: 0, // Number of consecutive days
  },
  lastActiveDate: {
    type: Date,
    default: null, // To track daily activity
  },
  garden: [
    {
      type: String, // e.g., 'grass', 'tree', 'flower', 'bird', etc.
      dateAdded: { type: Date, default: Date.now }, // Date when the item was added
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
