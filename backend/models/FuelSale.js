const mongoose = require("mongoose");

const fuelSaleSchema = new mongoose.Schema({
  fuel_id: { type: mongoose.Schema.Types.ObjectId, ref: "Fuel", required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  pump_attendant_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  client_name: { type: String },
});

module.exports = mongoose.model("FuelSale", fuelSaleSchema);