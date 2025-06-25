import express from "express";
import {
  crearPaquete,
  obtenerPaquetes,
  obtenerPaquetePorId,
  actualizarPaquete,
  eliminarPaquete,
  agregarReseña
} from "../controller/package_controller.js";

const router = express.Router();

// Crear nuevo paquete
router.post("/", crearPaquete);

// Obtener todos los paquetes
router.get("/", obtenerPaquetes);

// Obtener un paquete específico por ID
router.get("/:id", obtenerPaquetePorId);

// Actualizar un paquete por ID
router.put("/:id", actualizarPaquete);

// Eliminar un paquete por ID
router.delete("/:id", eliminarPaquete);

// Agregar reseña a un paquete por ID
router.post("/:id/reviews", agregarReseña);

export default router;
