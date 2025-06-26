import express from "express";
import {
  crearPaquete,
  obtenerPaquetes,
  obtenerPaquetePorId,
  actualizarPaquete,
  eliminarPaquete,
  agregarReseña
} from "../controller/package_controller.js";
import verificarAuth  from "../middlewares/authMiddleware.js";
import parser from "../config/multer.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(`📥 Petición recibida: ${req.method} ${req.originalUrl}`);
  next();
});

// Crear nuevo paquete con subida de imágenes (protegido)
router.post("/", verificarAuth, parser.array("imagen", 5), crearPaquete);

router.post("/:id/resenas", verificarAuth, agregarReseña);

// Las demás rutas…
router.get("/", obtenerPaquetes);
router.get("/:id", obtenerPaquetePorId);
router.put("/:id", verificarAuth, actualizarPaquete);
router.delete("/:id", verificarAuth, eliminarPaquete);

console.log("📦 RUTAS DE PAQUETES CARGADAS");

export default router;
