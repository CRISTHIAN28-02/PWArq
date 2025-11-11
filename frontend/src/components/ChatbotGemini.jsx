import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"; // ✅ para renderizar HTML embebido
import { openCulqi } from "../pagos/Culqi"; // 🔹 Asegúrate de tener este helper configurado

const ChatbotGemini = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://localhost:4000/api/essential/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

      const data = await res.json();
      let replyText = data.reply || "No se pudo generar respuesta.";

      const lastUserMsg = userMsg.text.toLowerCase().trim();
      if (replyText.toLowerCase().includes(lastUserMsg)) {
        replyText = replyText.replace(lastUserMsg, "").trim();
      }

      let botMsg = { role: "bot", text: replyText };

      // 🔍 Detectar bloques JSON (acciones)
      const actionMatch = botMsg.text.match(/```json([\s\S]*?)```/);
      if (actionMatch) {
        try {
          const actionData = JSON.parse(actionMatch[1]);
          botMsg.action = actionData;
          botMsg.text = botMsg.text.replace(/```json([\s\S]*?)```/, "");
        } catch (err) {
          console.warn("Error al parsear el JSON:", err);
        }
      }

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Error enviando mensaje:", err);
      const errorMsg = {
        role: "bot",
        text: "⚠️ Hubo un problema al conectar con el servidor. Intenta de nuevo.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  // 💳 Procesamiento de pagos
  const handlePayment = async (planId, metodo) => {
    try {
      // 🟢 Culqi
      if (metodo === "culqi") {
        const token = await openCulqi({
          amount: 50, // monto de ejemplo
          email: "cliente@demo.com",
        });

        const res = await fetch("http://localhost:4000/api/pagos/pagar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: token.id,
            amount: 50,
            email: "cliente@demo.com",
          }),
        });

        const data = await res.json();
        if (data.object === "charge" && data.outcome.type === "venta_exitosa") {
          alert("✅ Pago con Culqi exitoso. ID: " + data.id);
        } else {
          alert("❌ Error en el pago con Culqi.");
        }
      }

      // 🟡 PayPal
      else if (metodo === "paypal") {
        const res = await fetch(
          "http://localhost:4000/api/paypal/crear-orden",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 50 }),
          }
        );

        const order = await res.json();
        if (order.id && order.links) {
          const approvalLink = order.links.find(
            (link) => link.rel === "approve"
          ).href;
          window.location.href = approvalLink;
        } else {
          throw new Error("No se pudo crear la orden de PayPal.");
        }
      }

      // 💳 Stripe o 🪙 CoinGate
      else if (metodo === "card" || metodo === "crypto") {
        const res = await fetch(
          "http://localhost:4000/api/essential/create-checkout",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cartItems: [
                { title: planId || "Plan ARQUITEC", price: 50, quantity: 1 },
              ],
              method: metodo,
            }),
          }
        );

        const data = await res.json();
        if (data.ok && data.checkoutUrl) {
          alert("✅ Redirigiendo al checkout...");
          window.location.href = data.checkoutUrl;
        } else {
          throw new Error(data.error || "Error creando sesión de pago.");
        }
      } else {
        alert("⚠️ Selecciona un método de pago válido.");
      }
    } catch (err) {
      console.error("Error al procesar pago:", err);
      alert(`❌ Error: ${err.message || err}`);
    }
  };

  // 🧩 Tarjeta visual de producto
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col w-full max-w-xs mx-auto">
      <div className="h-40 w-full overflow-hidden">
        <img
          src={
            Array.isArray(product.imagenes) && product.imagenes.length > 0
              ? product.imagenes[0]
              : "https://via.placeholder.com/300x200.png?text=Producto"
          }
          alt={product.titulo}
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
            {product.titulo}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-2">
            {product.descripcion}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-base font-bold text-[#8C9985]">
            S/ {product.precio}
          </span>
          <button className="bg-[#8C9985] text-white px-3 py-1 rounded-lg hover:bg-[#7A8574] transition-colors text-sm">
            Ver
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="bg-white shadow-lg rounded-2xl w-80 h-[30rem] flex flex-col">
          {/* Encabezado */}
          <div className="bg-teal-600 text-white p-3 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-semibold text-sm">Asistente IA 💬</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-white font-bold"
            >
              ×
            </button>
          </div>

          {/* Cuerpo del chat */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-teal-100 text-right"
                    : "bg-gray-100 text-left"
                }`}
              >
                <div className="prose prose-sm max-w-none text-gray-800">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>

                {/* Productos dinámicos */}
                {msg.action?.productos &&
                  Array.isArray(msg.action.productos) && (
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      {msg.action.productos.map((prod, idx) => (
                        <ProductCard key={idx} product={prod} />
                      ))}
                    </div>
                  )}

                {/* Botones de pago */}
                {msg.action?.accion === "comprar" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => handlePayment(msg.action.planId, "card")}
                      className="bg-teal-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-teal-600"
                    >
                      💳 Tarjeta
                    </button>
                    <button
                      onClick={() => handlePayment(msg.action.planId, "crypto")}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-yellow-600"
                    >
                      🪙 Crypto
                    </button>
                    <button
                      onClick={() => handlePayment(msg.action.planId, "culqi")}
                      className="bg-green-600 text-white px-2 py-1 rounded-lg text-xs hover:bg-green-700"
                    >
                      🟢 Culqi
                    </button>
                    <button
                      onClick={() => handlePayment(msg.action.planId, "paypal")}
                      className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs hover:bg-blue-700"
                    >
                      🟡 PayPal
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 flex border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 border rounded-lg px-2 text-sm"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-teal-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-teal-600"
            >
              Enviar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white rounded-full p-5 shadow-lg text-xl"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatbotGemini;
