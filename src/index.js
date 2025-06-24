const dotenv = require("dotenv");
const connectDB = require("./database");
const server = require("./server");

// Configuración de variables de entorno
dotenv.config();

// Conectar base de datos
connectDB();

// Iniciar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
