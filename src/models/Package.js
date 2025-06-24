const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String], // URLs en Cloudinary
  price: Number,
  location: String,
  rating: { type: Number, default: 0 },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: String,
      rating: Number,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Package", packageSchema);