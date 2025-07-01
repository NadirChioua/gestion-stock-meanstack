const mongoose = require("mongoose");

const tireSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  size: { type: String, required: true },
  type: { type: String },
  price: { type: Number, required: true },
  stock_quantity: { type: Number, default: 0 },
});

module.exports = mongoose.model("Tire", tireSchema);