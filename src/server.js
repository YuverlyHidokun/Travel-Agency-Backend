import express from "express"
import cors from 'cors';

import userRoutes from "./routes/user_routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.set('port', process.env.PORT || 3000);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("🌎 API Travel Agency funcionando");
});

app.use("/travel/usuarios", userRoutes);
app.use((req, res) => res.status(404).send('🚫 Endpoint no encontrado - 404'));

export default app;
