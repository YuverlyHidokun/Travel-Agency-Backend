import express from "express";
import {
  crearPaquete,
  obtenerPaquetes,
  obtenerPaquetePorId,
  actualizarPaquete,
  eliminarPaquete,
  agregarReseña,
  buscarPaquetes,
  eliminarReseña
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

// Agregar reseña
router.post("/:id/resenas", verificarAuth, agregarReseña);

router.delete('/:idPaquete/resenas/:idResena', verificarAuth, eliminarReseña);


// Buscar paquetes (esta debe ir antes que "/:id")
router.get("/buscar", buscarPaquetes);

// Obtener todos los paquetes
router.get("/", obtenerPaquetes);

// Obtener un paquete por ID (esta debe ir después)
router.get("/:id", obtenerPaquetePorId);

// Actualizar y eliminar paquete
// Actualizar paquete con imágenes (protegido)
router.put("/:id", verificarAuth, parser.array("imagen", 5), actualizarPaquete);
router.delete("/:id", verificarAuth, eliminarPaquete);


export default router;
