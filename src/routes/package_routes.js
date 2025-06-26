import express from "express";
import {
  crearPaquete,
  obtenerPaquetes,
  obtenerPaquetePorId,
  actualizarPaquete,
  eliminarPaquete,
  agregarReseña
} from "../controller/package_controller.js";

import verificarAuth from "../middlewares/authMiddleware.js"; // asegúrate de que sea un export ES module

const router = express.Router();

router.get("/", obtenerPaquetes);

router.get("/:id", obtenerPaquetePorId);

router.post("/", verificarAuth, crearPaquete);

// Actualizar un paquete por ID (protegido)
router.put("/:id", verificarAuth, actualizarPaquete);

// Eliminar un paquete por ID (protegido)
router.delete("/:id", verificarAuth, eliminarPaquete);

// Agregar reseña a un paquete por ID (protegido)
router.post("/:id/reseñas", verificarAuth, agregarReseña);

export default router;
