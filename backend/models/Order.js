const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  table_number: { type: String },
  order_date: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
  total_amount: { type: Number, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Order", orderSchema);