import mongoose, { Schema, model } from "mongoose";

const packageSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true // Puedes agregar maxlength si deseas limitarlo, o dejarlo libre para "texto largo"
  },
  imagenes: [
    {
      type: String,
      required: true
    }
  ], // URLs en Cloudinary
  precio: {
    type: Number,
    required: true
  },
  ubicacion: {
    type: String,
    required: true
  },
  calificacion: {
    type: Number,
    default: 0
  },
  reseñas: [
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
