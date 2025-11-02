const express = require("express");
const request = require("request");
const router = express.Router();
require("dotenv").config();

// Credenciales de PayPal del archivo .env
const CLIENT = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // O 'https://api-m.paypal.com' para producción

const auth = { user: CLIENT, pass: SECRET };

/**
 * Endpoint para crear una orden de PayPal
 * POST /api/paypal/crear-orden
 */
router.post("/crear-orden", (req, res) => {
  const { amount } = req.body;

  // Se usa USD y se convierte el monto para asegurar compatibilidad en Sandbox.
  const currency_code = "USD";
  const DOLLAR_EQUIVALENT_RATE = 3;
  const value = (parseFloat(amount) / DOLLAR_EQUIVALENT_RATE).toFixed(2);

  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency_code,
          value: value,
        },
      },
    ],
    application_context: {
      brand_name: `menu principal`,
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: `http://localhost:4000/api/paypal/ejecutar-pago`,
      cancel_url: `http://localhost:4000/api/paypal/cancelar-pago`,
    },
  };

  request.post(
    `${PAYPAL_API}/v2/checkout/orders`,
    {
      auth,
      body,
      json: true,
    },
    (err, response) => {
      if (err) {
        console.error("Error al crear la orden de PayPal:", err);
        return res
          .status(500)
          .json({ error: "Error al crear la orden de PayPal." });
      }
      res.json(response.body);
    }
  );
});

/**
 * Endpoint para ejecutar un pago después de la aprobación del usuario
 * GET /api/paypal/ejecutar-pago
 */
router.get("/ejecutar-pago", (req, res) => {
  const token = req.query.token;

  request.post(
    `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
    {
      auth,
      body: {},
      json: true,
    },
    (err, response) => {
      res.redirect("http://localhost:4000/pago-exitoso");
    }
  );
});

/**
 * Endpoint para manejar la cancelación del pago
 * GET /api/paypal/cancelar-pago
 */
router.get("/cancelar-pago", (req, res) => {
  res.redirect("http://localhost:4000/pago-cancelado");
});

module.exports = router;
