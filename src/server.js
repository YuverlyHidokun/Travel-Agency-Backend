import express from "express";
import cors from "cors";

import userRoutes from "./routes/user_routes.js";
import paqueteRoutes from "./routes/package_routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 3000);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("🌎 API Travel Agency funcionando");
});

// Rutas
app.use("/travel/usuarios", userRoutes);
app.use("/travel/paquetes", paqueteRoutes);

// Ruta 404 para endpoints no encontrados
app.use((req, res) => res.status(404).send("🚫 Endpoint no encontrado - 404"));

export default app;
