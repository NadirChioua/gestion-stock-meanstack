const mongoose = require("mongoose");

const fuelEntrySchema = new mongoose.Schema({
  fuel_id: { type: mongoose.Schema.Types.ObjectId, ref: "Fuel", required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("FuelEntry", fuelEntrySchema);