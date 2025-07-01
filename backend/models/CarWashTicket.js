const mongoose = require("mongoose");

const carWashTicketSchema = new mongoose.Schema({
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: "CarWashService", required: true },
  client_name: { type: String },
  vehicle_info: { type: String },
  date: { type: Date, default: Date.now },
  payment_status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
  washer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
});

module.exports = mongoose.model("CarWashTicket", carWashTicketSchema);