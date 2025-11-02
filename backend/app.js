// Importa dotenv y cárgalo al inicio
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authenticateToken = require("./auth/authenticateToken");
const log = require("./lib/trace"); // Si no usas log/trace, puedes quitar esta línea
const profileRoutes = require("./routes/profile");

const app = express();
const port = process.env.PORT || 4000;

// ===================================================
// 🪝 Middleware especial para Coinbase Webhook
// ===================================================
// 🚨 IMPORTANTE: Este middleware DEBE ir antes de 'app.use(express.json())'
// para poder acceder al cuerpo RAW, necesario para verificar la firma del webhook.
app.use(
  "/api/coinbase/webhook",
  bodyParser.raw({ type: "*/*" }),
  (req, res, next) => {
    req.rawBody = req.body; // Guarda el raw body (Buffer) para verificar la firma
    next();
  }
);

// ===================================================
// 📦 Middlewares globales
// ===================================================
app.use(cors());
// Middleware para parsear bodies JSON en todas las demás rutas
app.use(express.json());

// ===================================================
// 🔗 Conexión a la base de datos
// ===================================================
main().catch((err) => {
  console.error(
    "❌ Error conectando a la base de datos (fuera de main):",
    err.message
  );
  process.exit(1); // Detener si no se puede conectar a la DB
});

async function main() {
  try {
    // 🟢 CORRECCIÓN: Se eliminaron las opciones deprecated de Mongoose
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("✅ Conectado a la base de datos");
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
}

// ===================================================
// 🚦 Rutas
// ===================================================

// ✅ Rutas de perfil
app.use("/api/profile", profileRoutes);

// ✅ Rutas de autenticación
app.use("/api/signup", require("./routes/signup"));
app.use("/api/login", require("./routes/login"));
app.use("/api/signout", require("./routes/logout"));

// ✅ Ruta para renovar token
app.use("/api/refresh-token", require("./routes/refreshToken"));

// ✅ Rutas de posts protegidas
app.use("/api/posts", authenticateToken, require("./routes/posts"));

// ✅ Rutas de usuario
app.use("/api/user", authenticateToken, require("./routes/user"));

// ✅ Rutas de productos
app.use("/api/products", require("./routes/productRoutes"));

// ✅ Pagos con Culqi
app.use("/api/pagos", require("./routes/pagos"));

// ✅ Pagos con PayPal
app.use("/api/paypal", require("./services/Paypal"));

// ✅ Pagos con Coinbase Commerce
const coinbaseRoutes = require("./routes/coinbase.routes");
app.use("/api/coinbase", coinbaseRoutes);

// ===================================================
// 🚀 Servidor
// ===================================================
app.listen(port, () => {
  console.log(`🚀 Server is up on port ${port}`);
});

module.exports = app;
