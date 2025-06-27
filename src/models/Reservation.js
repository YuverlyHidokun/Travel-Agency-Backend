import mongoose, { Schema, model } from "mongoose";

const reservaSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  paquete: {
    type: Schema.Types.ObjectId,
    ref: "Paquete",
    required: true
  },
  pasajeros: {
    type: Number,
    required: true,
    min: 1
  },
  fechaViaje: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ["confirmada", "cancelada", "pendiente"],
    default: "confirmada"
  }
}, {
  timestamps: true
});

export default model("Reserva", reservaSchema);
