const mongoose = require("mongoose");

const carWashServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
});

module.exports = mongoose.model("CarWashService", carWashServiceSchema);