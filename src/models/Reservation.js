const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  travelPackage: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
  passengers: Number,
  travelDate: Date,
  status: { type: String, enum: ["confirmada", "cancelada", "pendiente"], default: "confirmada" },
}, { timestamps: true });

module.exports = mongoose.model("Reservation", reservationSchema);