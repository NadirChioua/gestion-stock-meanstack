const mongoose = require("mongoose");

const accessorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock_quantity: { type: Number, default: 0 },
  sku: { type: String, unique: true },
});

module.exports = mongoose.model("Accessory", accessorySchema);