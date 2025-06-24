const express = require("express");
const cors = require("cors");
import usuarioRoutes from "./routes/user_routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get("/", (req, res) => {
  res.send("🌎 API Travel Agency funcionando");
});

app.use("/travel/usuarios", usuarioRoutes);

module.exports = app;
