const mongoose = require("mongoose");

const tireSaleSchema = new mongoose.Schema({
  tire_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tire", required: true },
  quantity: { type: Number, required: true },
  total_amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fitter_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("TireSale", tireSaleSchema);