const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["employee", "manager", "admin"], default: "employee" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);