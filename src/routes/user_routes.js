import express from "express";
import { 
    registro, 
    login, 
    verificarCuenta,
    olvidoPassword,
  actualizarPassword 
} from "../controllers/user_controller.js";

const router = express.Router();

router.post("/registro", registro);
router.post("/login", login);
router.post("/verificar", verificarCuenta);
router.post("/olvido-password", olvidoPassword);
router.post("/actualizar-password", actualizarPassword);

export default router;
