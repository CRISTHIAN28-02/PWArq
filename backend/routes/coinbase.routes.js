// backend/routes/coinbase.routes.js
const express = require("express");
const router = express.Router();
const coinbaseController = require("../controllers/coinbase.controller");

// Crear checkout (llamado desde el frontend)
router.post("/create-checkout", coinbaseController.createCheckout);

// Webhook público (Coinbase llamará aquí)
router.post("/webhook", coinbaseController.handleWebhook);

// (Opcional) consultar estado de pago mock
router.get("/status/:id", async (req, res) => {
  // En simulación solo devolvemos info mínima. En producción consulta tu BD.
  const { id } = req.params;
  return res.json({
    success: true,
    payment: {
      id,
      status: "simulated", // o pending/paid/failed según tu BD
      provider: "coinbase_simulated",
    },
  });
});

module.exports = router;
