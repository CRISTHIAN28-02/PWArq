// backend/services/coinbase.service.js
const axios = require("axios");
const crypto = require("crypto");

const COINBASE_API_KEY = process.env.COINBASE_API_KEY;
const COINBASE_USE_REAL = process.env.COINBASE_USE_REAL === "true";
const SIMULATION_HOST = process.env.SIMULATION_HOST;

// ===================================================
// 🪙 Crear checkout (real o simulado)
// ===================================================
exports.createCheckoutSession = async (
  amount,
  currency = "PEN", // Asumimos que la moneda de entrada es PEN, si no se especifica
  metadata = {}
) => {
  try {
    // 🟢 CORRECCIÓN CLAVE 1: Manejar la conversión de moneda (PEN a USD)
    // Asumimos una tasa de conversión para la API de Coinbase (si se usa PEN en el frontend)
    // Coinbase Commerce requiere USD para el local_price.
    let finalAmount = amount;
    let finalCurrency = currency;

    if (currency === "PEN") {
      const DOLLAR_EQUIVALENT_RATE = 3.8; // Usar una tasa aproximada para el ejemplo
      finalAmount = (Number(amount) / DOLLAR_EQUIVALENT_RATE).toFixed(2); // Convertir y redondear
      finalCurrency = "USD";
    }

    if (COINBASE_USE_REAL) {
      // 🔹 Modo real: crear checkout en Coinbase Commerce API
      const response = await axios.post(
        "https://api.commerce.coinbase.com/charges",
        {
          name: "Pago con Criptomonedas",
          description: "Compra en tu tienda",
          // Usamos el monto y moneda convertidos para la API
          local_price: { amount: finalAmount, currency: finalCurrency },
          pricing_type: "fixed_price",
          metadata,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CC-Api-Key": COINBASE_API_KEY,
            "X-CC-Version": "2018-03-22",
          },
        }
      );

      return response.data.data;
    } else {
      // 🔹 Simulación: sin conexión a Coinbase real
      return {
        id: "sim_" + Math.random().toString(36).substring(2, 10),
        // Si el SIMULATION_HOST no está definido, usar http://localhost:4000
        hosted_url: `${
          SIMULATION_HOST || "http://localhost:4000"
        }/simulated-checkout`,
        pricing: { local: { amount: finalAmount, currency: finalCurrency } },
        status: "pending",
      };
    }
  } catch (err) {
    // 🟢 CORRECCIÓN CLAVE 2: Mejorar el manejo de errores para lanzar el mensaje real.
    const errorMessage =
      err.response?.data?.error?.message ||
      err.message ||
      "Error desconocido en el servicio de Coinbase Commerce";

    // Mostramos el error detallado en el log del servidor
    console.error("❌ ERROR DETALLADO EN COINBASE SERVICE:", errorMessage);

    // Lanzamos el error con el mensaje detallado para que el controlador lo capture
    throw new Error(errorMessage);
  }
};

// ===================================================
// 🪝 Verificar firma de Webhook
// ===================================================
exports.verifyWebhookSignature = (rawBody, signature, secret) => {
  if (!signature || !secret) {
    // 💡 NOTA: En el controlador, si se llama a esta función con `rawBody` y `signature` vacíos,
    // el controlador debería manejarlo primero.
    // Aquí podemos simplemente devolver false o lanzar un error, si se espera que siempre estén presentes.
    throw new Error("Faltan datos de firma o secreto de Coinbase");
  }

  const computedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature, "utf8"),
    Buffer.from(computedSignature, "utf8")
  );
};
