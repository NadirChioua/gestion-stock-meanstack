const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  stock_quantity: { type: Number, default: 0 },
});

module.exports = mongoose.model("MenuItem", menuItemSchema);