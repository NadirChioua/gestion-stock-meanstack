const mongoose = require("mongoose");

const accessorySaleSchema = new mongoose.Schema({
  accessory_id: { type: mongoose.Schema.Types.ObjectId, ref: "Accessory", required: true },
  quantity: { type: Number, required: true },
  total_amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("AccessorySale", accessorySaleSchema);