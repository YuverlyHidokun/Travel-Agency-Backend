import express from "express";
import {
  crearReserva,
  obtenerReservas,
  obtenerMisReservas,
  obtenerReservaPorId,
  actualizarReserva,
  eliminarReserva
} from "../controller/reservation_controller.js";
import verificarAuth  from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verificarAuth, crearReserva);
router.get("/", verificarAuth, obtenerReservas);
router.get("/mis-reservas", verificarAuth, obtenerMisReservas);
router.get("/:id", verificarAuth, obtenerReservaPorId);
router.put("/:id", verificarAuth, actualizarReserva);
router.delete("/:id", verificarAuth, eliminarReserva);

export default router;
