// backend/controllers/coinbase.controller.js
const coinbaseService = require("../services/coinbase.service");
const trace = require("../lib/trace"); // si lo tienes en tu proyecto; si no, solo console.log
// const jsonResponse = require("../lib/jsonResponse"); // opcional helper

/**
 * POST /api/coinbase/create-checkout
 * Body esperado: { amount, currency, metadata }
 * - Retorna JSON con { success: true, checkout, url: <link-de-redireccion> }
 */
async function createCheckout(req, res) {
  try {
    const { amount, currency = "PEN", metadata = {} } = req.body || {};

    if (!amount || isNaN(Number(amount))) {
      return res.status(400).json({ success: false, error: "amount inválido" });
    }

    const checkout = await coinbaseService.createCheckoutSession(
      Number(amount),
      currency,
      metadata
    );

    // 🟢 CORRECCIÓN CLAVE: Mapear hosted_url a 'url' para que el frontend lo reconozca.
    // El objeto de respuesta de Coinbase Commerce tiene 'hosted_url'.
    return res.status(201).json({
      success: true,
      checkout,
      url: checkout.hosted_url, // Enviamos la URL de redirección al frontend
    });
  } catch (err) {
    // 🟢 CORRECCIÓN: Mejorar el log de error para que veas el mensaje detallado del servicio.
    console.error("❌ createCheckout error:", err.message);
    return (
      res
        .status(500)
        // Devolvemos el mensaje de error para que el frontend pueda mostrarlo.
        .json({
          success: false,
          error: err.message || "Error interno del servidor al crear checkout",
        })
    );
  }
}

/**
 * POST /api/coinbase/webhook
 * Coinbase enviará el evento aquí. Debes verificar la firma.
 * Requiere que tu express guarde el rawBody en req.rawBody (configurado en app.js).
 */
async function handleWebhook(req, res) {
  try {
    const signatureHeader =
      req.headers["x-cc-webhook-signature"] ||
      req.headers["x-cc-signature"] ||
      req.headers["x-cc-hook-signature"] ||
      req.headers["signature"];

    // El raw body ya debería estar disponible en req.rawBody gracias al middleware en app.js.
    const raw = req.rawBody;

    // Verificación de existencia del raw body antes de continuar
    if (!raw) {
      console.warn(
        "Webhook recibido sin raw body. Posible configuración incorrecta."
      );
      return res
        .status(400)
        .json({ success: false, message: "raw_body_missing" });
    }

    const secret = process.env.COINBASE_WEBHOOK_SECRET;

    // 💡 NOTA: La función verifyWebhookSignature del servicio debe estar actualizada
    // para manejar los parámetros correctos.
    const verified = coinbaseService.verifyWebhookSignature(
      raw,
      signatureHeader,
      secret
    );

    if (!verified) {
      console.warn("Webhook signature no verificada. Headers:", {
        signatureHeader,
      });
      return res
        .status(400)
        .json({ success: false, message: "signature_invalid" });
    }

    // Parse payload: si tienes req.body ya parseado, úsalo; si no, parsea raw
    let payload;
    try {
      // Intentamos usar req.body primero, si no, parseamos el raw body
      payload =
        req.body && Object.keys(req.body).length > 0
          ? req.body
          : JSON.parse(raw.toString("utf8"));
    } catch (e) {
      console.warn("No se pudo parsear payload del webhook:", e);
      payload = null;
    }

    // Aquí procesas el evento.
    const eventType = payload?.event?.type || payload?.type || "unknown";
    console.log("📬 Webhook recibido - event:", eventType);

    // Implementar la lógica para actualizar el estado del pedido en tu BD

    // responde 200 para aceptar el webhook
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error en webhook:", err.message);
    return res
      .status(500)
      .json({ success: false, error: err.message || "internal_error" });
  }
}

module.exports = {
  createCheckout,
  handleWebhook,
};
