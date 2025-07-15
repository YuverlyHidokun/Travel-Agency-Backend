import mongoose, { Schema, model } from "mongoose";

const packageSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  },
  imagenes: [
    {
      type: String,
      required: true
    }
  ],
  precio: {
    type: Number,
    required: true
  },
  ubicacion: {
    type: String,
    required: true
  },
  origen: {
    type: String,
    required: true
  },
  destino: {
    type: String,
    required: true
  },
  tipo: {
    type: String, // ejemplo: "Aventura", "Relax", "Cultural"
    required: true
  },
  clase: {
    type: String, // ejemplo: "Económica", "Premium", etc.
    default: "Económica"
  },
  maxPasajeros: {
    type: Number,
    default: 10
  },
  calificacion: {
    type: Number,
    default: 0
  },
  resenas: [
    {
      usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
      },
      comentario: {
        type: String,
        required: true
      },
      calificacion: {
        type: Number,
        required: true
      }
    }
  ]
}, {
  timestamps: true
});


export default model("Paquete", packageSchema);
