import Usuario from "../models/User.js";
import { sendMailToVerifyMovilUser } from "../config/nodemailer.js";

const registro = async (req, res) => {
  const { nombre, apellido, numero, email, password, acepta_terminos } = req.body;

  if ([nombre, apellido, numero, email, password].includes("")) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  if (acepta_terminos === "false") {
    return res.status(400).json({ msg: "Debe aceptar los términos y condiciones" });
  }

  const existeUsuario = await Usuario.findOne({ email });
  if (existeUsuario) {
    return res.status(400).json({ msg: "Este email ya está registrado" });
  }

  const nuevoUsuario = new Usuario({
    nombre,
    apellido,
    numero,
    email,
    password,
    token: Usuario.prototype.generarToken()
  });

  nuevoUsuario.password = await nuevoUsuario.encrypPassword(password);
  await nuevoUsuario.save();

  await sendMailToVerifyMovilUser(email, nuevoUsuario.token);

  res.status(201).json({
    msg: "Cuenta creada. Verifica tu correo electrónico.",
    id_usuario: nuevoUsuario._id,
    token: nuevoUsuario.token
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].includes("")) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  const usuarioBDD = await Usuario.findOne({ email });
  if (!usuarioBDD) {
    return res.status(404).json({ msg: "Usuario no encontrado" });
  }

  const passwordValido = await usuarioBDD.matchPassword(password);
  if (!passwordValido) {
    return res.status(401).json({ msg: "Contraseña incorrecta" });
  }

  if (!usuarioBDD.confirmEmail) {
    return res.status(403).json({ msg: "Debes confirmar tu cuenta antes de iniciar sesión" });
  }

  res.status(200).json({
    id: usuarioBDD._id,
    nombre: usuarioBDD.nombre,
    email: usuarioBDD.email,
    rol: usuarioBDD.rol
  });
};

const verificarCuenta = async (req, res) => {
  const { id_usuario, token } = req.body;

  const usuario = await Usuario.findById(id_usuario);
  if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

  if (usuario.token !== token) {
    return res.status(400).json({ msg: "Token incorrecto, verifica tu correo" });
  }

  usuario.confirmEmail = true;
  usuario.token = null;
  await usuario.save();

  res.status(200).json({ msg: "Cuenta verificada correctamente" });
};

// Recuperar contraseña por olvido
const olvidoPassword = async (req, res) => {
  const { email, nuevopassword, confirmarpassword } = req.body;

  if (!email || !nuevopassword || !confirmarpassword) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    return res.status(404).json({ msg: `No existe un usuario con el correo ${email}` });
  }

  if (nuevopassword !== confirmarpassword) {
    return res.status(400).json({ msg: "Las contraseñas no coinciden" });
  }

  usuario.password = await usuario.encrypPassword(nuevopassword);
  await usuario.save();

  res.status(200).json({ msg: "Contraseña actualizada correctamente" });
};

// Actualizar contraseña desde perfil
const actualizarPassword = async (req, res) => {
  const { id, nuevopassword, confirmarpassword } = req.body;

  const usuario = await Usuario.findById(id);
  if (!usuario) {
    return res.status(404).json({ msg: "Usuario no encontrado" });
  }

  if (nuevopassword !== confirmarpassword) {
    return res.status(400).json({ msg: "Las contraseñas no coinciden" });
  }

  usuario.password = await usuario.encrypPassword(nuevopassword);
  await usuario.save();

  res.status(200).json({ msg: "Contraseña actualizada correctamente" });
};

export {
  registro,
  login,
  verificarCuenta,
  olvidoPassword,
  actualizarPassword,
};
