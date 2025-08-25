const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const { swaggerDocs } = require("./src/utils/swagger.js");
const { router } = require("./src/routes/index.js");
const dotenv= require("dotenv");

dotenv.config();

//CONFIG APP
const PORT = 3003;
const app = express();
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
//DATABASE
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));
//ROUTES
app.use(router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.listen(PORT, () =>
  console.log(`Server: 🚀 Servidor corriendo en http://localhost:${PORT}`,
    `|| Swagger: 🚀 http://localhost:${PORT}/api-docs`
  ),
);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

