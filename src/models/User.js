import mongoose, {Schema, model} from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  numero: { 
    type: Number, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    trim: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  rol: {
    type: String,
    enum: ["usuario", "admin"],
    default: "usuario"
  },
  token: { 
    type: String, 
    default: null 
  },
  confirmEmail: { type: Boolean, 
    default: false 
  },
  imagenUrl: { 
    type: String 
  },
  imagenPublicId: { 
    type: String, 
    required: false 
  }

},{
  timestamps: true
})

// Métodos del modelo
userSchema.methods.encrypPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generarToken = function() {
  const tokenGenerado = this.token = Math.random().toString(36).slice(2);
  return tokenGenerado;
};

export default model("Usuario", userSchema);