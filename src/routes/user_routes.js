import express from "express";
import { 
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
} from "../controller/user_controller.js";
import verificarAuth  from "../middlewares/authMiddleware.js";
import parser from "../config/multer.js";

const router = express.Router();

router.post("/registro", parser.single("imagen"), registro);
router.post("/login", login);

router.get("/verificar/:token", verificarCuenta);

// Nueva ruta para solicitar recuperación de contraseña (envía token al email)
router.post("/recuperar-password", recuperarPassword);

// Ruta para comprobar token recibido por email (validar que es correcto)
router.get("/recuperar-password/:token", comprobarTokenPasword);

// Ruta para enviar la nueva contraseña con token válido
router.post("/recuperar-password/:token", nuevoPassword);

router.post("/actualizar-password", actualizarPassword);

router.get("/perfil", verificarAuth, obtenerPerfil);
router.put('/perfil', verificarAuth, parser.single('imagen'), actualizarPerfil);

router.put("/actualizar-foto", verificarAuth, parser.single("imagen"), actualizarImagenPerfil);


export default router;
