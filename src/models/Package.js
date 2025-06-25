import mongoose, { Schema, model } from "mongoose";

const packageSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  images: [
    {
      type: String,
      required: true
    }
  ], // URLs en Cloudinary
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
      },
      comment: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true
      }
    }
  ]
}, {
  timestamps: true
});

export default model("Paquete", packageSchema);