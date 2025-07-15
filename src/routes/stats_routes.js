import express from "express";
import { obtenerEstadisticas } from "../controller/stats_controller.js";
import verificarAuth  from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verificarAuth, obtenerEstadisticas);

export default router;
