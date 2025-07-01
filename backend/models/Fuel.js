const mongoose = require("mongoose");

const fuelSchema = new mongoose.Schema({
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
  price_per_liter: { type: Number, required: true },
  last_updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Fuel", fuelSchema);