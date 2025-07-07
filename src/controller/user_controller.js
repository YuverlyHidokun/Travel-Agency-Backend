import Usuario from "../models/User.js";
import { sendMailToRegister, sendMailToRecoveryPassword } from "../config/nodemailer.js";
import generarJWT from "../utils/generateToken.js";
import { v2 as cloudinary } from 'cloudinary';

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
    password
  });

  // Si hay imagen cargada
  if (req.file) {
    nuevoUsuario.imagenUrl = req.file.path;
    nuevoUsuario.imagenPublicId = req.file.filename;
  }

  const tokenGenerado = nuevoUsuario.generarToken();
  nuevoUsuario.token = tokenGenerado;

  nuevoUsuario.password = await nuevoUsuario.encrypPassword(password);
  await nuevoUsuario.save();

  await sendMailToRegister(email, nuevoUsuario.token);

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

  const token = generarJWT(usuarioBDD._id); // <- Este es el token que necesitas

  res.status(200).json({
    id: usuarioBDD._id,
    nombre: usuarioBDD.nombre,
    email: usuarioBDD.email,
    rol: usuarioBDD.rol,
    token  // ← JWT válido
  });
};


const verificarCuenta = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({ token });

  if (!usuario) {
    return res.status(404).json({ msg: "Token inválido o expirado" });
  }

  usuario.confirmEmail = true;
  usuario.token = null;
  await usuario.save();

  res.status(200).json({ msg: "Cuenta verificada correctamente. Ya puedes iniciar sesión." });
};

// Recuperar contraseña por olvido
const recuperarPassword = async (req, res) => {
  const { email } = req.body;
  if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });

  const propietarioBDD = await Usuario.findOne({ email });
  if (!propietarioBDD) return res.status(404).json({ msg: "Lo sentimos, el email no se encuentra registrado" });

  const token = propietarioBDD.generarToken();
  propietarioBDD.token = token;
  await propietarioBDD.save();

  await sendMailToRecoveryPassword(email, token);

  res.status(200).json({ msg: "Revisa tu correo electrónico para recuperar tu contraseña" });
};

const comprobarTokenPasword = async (req, res) => {
  const { token } = req.params;
  if (!token) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" });

  const propietarioBDD = await Usuario.findOne({ token });
  if (!propietarioBDD || propietarioBDD.token !== token) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" });

  res.status(200).json({ msg: "Hemos verificado tu correo, por favor rellena los campos para tu nueva contraseña" });
};

const nuevoPassword = async (req, res) => {
  const { password, confirmpassword } = req.body;
  const { token } = req.params;

  if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
  if (password !== confirmpassword) return res.status(404).json({ msg: "Lo sentimos, las contraseñas no coinciden" });

  const propietarioBDD = await Usuario.findOne({ token });
  if (!propietarioBDD || propietarioBDD.token !== token) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" });

  propietarioBDD.token = null;
  propietarioBDD.password = await propietarioBDD.encrypPassword(password);
  await propietarioBDD.save();

  res.status(200).json({ msg: "Felicitaciones, ya puedes iniciar sesión con tu nueva contraseña" });
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

const obtenerPerfil = (req, res) => {
  const usuario = req.usuario;
  res.json(usuario);
};

const actualizarPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const { nombre, apellido, numero, email } = req.body;

    usuario.nombre = nombre || usuario.nombre;
    usuario.apellido = apellido || usuario.apellido;
    usuario.numero = numero || usuario.numero;
    usuario.email = email || usuario.email;

    await usuario.save();
    res.json({ msg: "Perfil actualizado", usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar el perfil" });
  }
};

const actualizarImagenPerfil = async (req, res) => {
  const usuarioId = req.usuario._id;

  try {
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Eliminar la anterior imagen si existe
    if (usuario.imagenPublicId) {
      await cloudinary.uploader.destroy(usuario.imagenPublicId);
    }

    // Subir nueva
    const file = req.file;

    if (!file || !file.path && !file.secure_url) {
      return res.status(400).json({ msg: "No se recibió ninguna imagen válida" });
    }

    usuario.imagenUrl = file.path || file.secure_url;
    usuario.imagenPublicId = file.filename || file.public_id;

    await usuario.save();

    res.status(200).json({
      msg: "Imagen de perfil actualizada correctamente",
      usuario: {
        nombre: usuario.nombre,
        imagenUrl: usuario.imagenUrl
      }
    });

    console.log("Archivo recibido:", file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar imagen de perfil" });
  }
};

export {
  registro,
  login,
  verificarCuenta,
  recuperarPassword,
  comprobarTokenPasword,
  nuevoPassword,
  actualizarPassword,
  obtenerPerfil,
  actualizarPerfil,
  actualizarImagenPerfil
};