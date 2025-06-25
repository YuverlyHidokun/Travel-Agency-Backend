import express from "express";
import { 
    registro,
    login,
    verificarCuenta,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    actualizarPassword
} from "../controller/user_controller.js";

const router = express.Router();

router.post("/registro", registro);
router.post("/login", login);

router.get("/verificar/:token", verificarCuenta);

// Nueva ruta para solicitar recuperación de contraseña (envía token al email)
router.post("/recuperar-password", recuperarPassword);

// Ruta para comprobar token recibido por email (validar que es correcto)
router.get("/recuperar-password/:token", comprobarTokenPasword);

// Ruta para enviar la nueva contraseña con token válido
router.post("/recuperar-password/:token", nuevoPassword);

router.post("/actualizar-password", actualizarPassword);


export default router;
