// backend/routes/pagos.js
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const router = express.Router();

// Ruta para procesar el pago con Culqi
router.post("/pagar", async (req, res) => {
  const { token, amount, email } = req.body;

  if (!token || !amount) {
    return res.status(400).json({ error: "Faltan datos: token o amount" });
  }

  try {
    const response = await fetch("https://api.culqi.com/v2/charges", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CULQI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // convertir a céntimos
        currency_code: "PEN",
        email: email || "cliente@demo.com",
        source_id: token,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data,
        message: "Error al procesar el pago con Culqi",
      });
    }

    // Se corrigió esta línea para devolver el objeto de datos completo de Culqi
    res.json(data);
  } catch (err) {
    console.error("Error en Culqi:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
