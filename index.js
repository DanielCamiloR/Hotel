const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const { swaggerDocs } = require("./src/utils/swagger.js");
const { router } = require("./src/routes/index.js");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

// CONFIG APP
const PORT = 3003;
const app = express();

app.use(cors({
  origin: ['http://localhost:3003', 'http://3.139.12.126:3003'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SERVIR ARCHIVOS ESTÁTICOS (CSS, JS, IMÁGENES)
app.use(express.static(path.join(__dirname, 'src', 'pagina')));

// DATABASE
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

// ROUTES API
app.use("/api", router); // ← AÑADE "/api" AQUÍ

// SWAGGER
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// SERVIR EL HTML PRINCIPAL - ESTO ES CLAVE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pagina', 'index.html'));
});

// SERVER - escuchar en todas las interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://[TU_IP_LOCAL]:${PORT}`);
  console.log(`📚 API: http://[TU_IP_LOCAL]:${PORT}/api/hotel/get-bookings`);
});
