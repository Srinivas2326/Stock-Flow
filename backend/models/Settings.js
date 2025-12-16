// models/Settings.js
const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
    unique: true
  },
  defaultLowStockThreshold: {
    type: Number,
    default: 5
  }
});

module.exports = mongoose.model("Settings", settingsSchema);
