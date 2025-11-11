// backend/routes/essential.js
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const Stripe = require("stripe");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");
// NOTA: NO conectar de nuevo a MongoDB aquí (la conexión se realiza en app.js)
// const mongoose = require("mongoose");

const router = express.Router();

// Intentar importar el modelo Product existente (soporta export default)
let Product;
try {
  // Si tu models/Product.js exporta por default (ESM), require(...) devolverá { default: Model }
  const imported = require("../models/Product");
  Product = imported.default || imported;
} catch (err) {
  console.warn(
    "⚠️ No se pudo importar Product desde ../models/Product. Asegúrate de que el archivo exista y exporte el modelo.",
    err.message
  );
  Product = null;
}

// --- CONFIGURACIÓN DE MIDDLEWARE Y CORS ---
router.use(
  cors({
    origin: "https://integraciondesistemas.netlify.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

router.use(bodyParser.json());

// --- CONFIGURACIÓN DE CLAVES ---
const STRIPE_SECRET = process.env.STRIPE_SECRET || "";
const stripe = new Stripe(STRIPE_SECRET);

const COINGATE_TOKEN = process.env.COINGATE_TOKEN_SANDBOX || "";
const COINGATE_API = "https://api-sandbox.coingate.com/v2/orders";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://integraciondesistemas.netlify.app";

// Simulación de base de datos (en memoria)
const ORDERS = {};

// --- RUTAS DE LA API PARA CREAR-ORDEN / CHECKOUT / STATUS / WEBHOOK ---

// POST /create-order
router.post("/create-order", async (req, res) => {
  const { title, price, method, planId } = req.body;
  const orderId = `TEST_${Date.now()}`;
  ORDERS[orderId] = { id: orderId, title, price, method, paid: false };

  try {
    if (method === "crypto") {
      const body = {
        order_id: orderId,
        price_amount: price,
        price_currency: "USD",
        receive_currency: "BTC",
        title,
        callback_url: `${FRONTEND_URL}/webhook/coingate`,
        success_url: `${FRONTEND_URL}/success?order_id=${orderId}`,
        cancel_url: `${FRONTEND_URL}/cancel?order_id=${orderId}`,
      };

      const r = await fetch(COINGATE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${COINGATE_TOKEN}`,
        },
        body: JSON.stringify(body),
      });
      const j = await r.json();
      ORDERS[orderId].coingate = j;
      return res.json({
        ok: true,
        checkoutUrl: j.payment_url,
        order_id: orderId,
      });
    } else if (method === "card") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: title },
              unit_amount: Math.round(price * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${FRONTEND_URL}/success?order_id=${orderId}`,
        cancel_url: `${FRONTEND_URL}/cancel?order_id=${orderId}`,
      });
      return res.json({ ok: true, checkoutUrl: session.url });
    }

    res.status(400).json({ ok: false, error: "Método inválido" });
  } catch (e) {
    console.error("Error en create-order:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// POST /create-checkout
router.post("/create-checkout", async (req, res) => {
  const { cartItems, method } = req.body;
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ ok: false, error: "El carrito está vacío." });
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orderId = `CART_${Date.now()}`;
  const title = `Compra de ${
    cartItems.length
  } planos (Total: $${totalPrice.toFixed(2)})`;

  ORDERS[orderId] = {
    id: orderId,
    title,
    price: totalPrice,
    method,
    paid: false,
    items: cartItems,
  };

  try {
    if (method === "crypto") {
      const body = {
        order_id: orderId,
        price_amount: totalPrice,
        price_currency: "USD",
        receive_currency: "BTC",
        title,
        callback_url: `${FRONTEND_URL}/webhook/coingate`,
        success_url: `${FRONTEND_URL}/success?order_id=${orderId}`,
        cancel_url: `${FRONTEND_URL}/cancel?order_id=${orderId}`,
      };

      const r = await fetch(COINGATE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${COINGATE_TOKEN}`,
        },
        body: JSON.stringify(body),
      });
      const j = await r.json();
      ORDERS[orderId].coingate = j;
      return res.json({
        ok: true,
        checkoutUrl: j.payment_url,
        order_id: orderId,
      });
    } else if (method === "card") {
      const line_items = cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.title },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items,
        success_url: `${FRONTEND_URL}/success?order_id=${orderId}`,
        cancel_url: `${FRONTEND_URL}/cancel?order_id=${orderId}`,
      });
      return res.json({ ok: true, checkoutUrl: session.url });
    }

    res.status(400).json({ ok: false, error: "Método inválido" });
  } catch (e) {
    console.error("Error en create-checkout:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /order-status/:id
router.get("/order-status/:id", (req, res) => {
  const order = ORDERS[req.params.id];
  if (!order)
    return res.status(404).json({ ok: false, error: "Orden no encontrada." });
  res.json({
    ok: true,
    paid: order.paid,
    title: order.title,
    price: order.price,
    method: order.method,
    items: order.items || [
      { title: order.title, quantity: 1, price: order.price },
    ],
  });
});

// POST /webhook/coingate
router.post("/webhook/coingate", (req, res) => {
  try {
    const { order_id, status } = req.body || {};
    if (order_id && status === "paid" && ORDERS[order_id]) {
      ORDERS[order_id].paid = true;
      console.log(`✅ Orden ${order_id} marcada como pagada por CoinGate.`);
    }
  } catch (e) {
    console.error("Error en webhook/coingate:", e);
  }
  res.status(200).send("OK");
});

// --- CHAT IA ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // Obtener productos usando el modelo central (si está disponible)
    let products = [];
    if (Product) {
      products = await Product.find({ estado: "aprobado" }).limit(50).lean();
    }

    const context = `
      Eres el asistente oficial de ARQUITEC 🏗️.
      Ayuda a los usuarios a elegir planos de nuestra base de datos MongoDB.
      Si mencionas productos, usa sus nombres exactos.
      Usa un tono profesional y amigable con algunos emojis.
      Si el usuario menciona que quiere comprar, responde con el siguiente JSON:
      {"accion":"comprar","planId":<ID_DEL_PRODUCTO>,"metodo":"card|crypto"}
      Lista de productos actuales:
      ${JSON.stringify(products, null, 2)}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([context, message]);
    const text = result.response.text();

    res.json({ reply: text });
  } catch (e) {
    console.error("Error en chat Gemini:", e);
    res.status(500).json({
      reply:
        "Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta más tarde. 🚧",
    });
  }
});

module.exports = router;
