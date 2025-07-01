const mongoose = require("mongoose");

const butcheryProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price_per_kg: { type: Number, required: true },
  stock_quantity_kg: { type: Number, default: 0 },
  category: { type: String },
});

module.exports = mongoose.model("ButcheryProduct", butcheryProductSchema);