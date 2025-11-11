import React, { useState } from "react";
import { useCart } from "../components/CartContext";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { openCulqi } from "../pagos/Culqi";

export default function Carrito({ onClose = () => {} }) {
  const { cart, removeFromCart, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const navigate = useNavigate();

  const total = cart.reduce((sum, it) => sum + Number(it.precio || 0), 0);

  const handleClose = () => {
    onClose();
    navigate("/productos");
  };

  const handlePago = async () => {
    try {
      // 🟢 1️⃣ Culqi
      if (selectedPayment === "culqi") {
        const token = await openCulqi({
          amount: total,
          email: "cliente@demo.com",
        });

        const res = await fetch("http://localhost:4000/api/pagos/pagar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: token.id,
            amount: total,
            email: "cliente@demo.com",
          }),
        });

        const data = await res.json();
        console.log("📦 Respuesta del backend (Culqi):", data);

        if (data.object === "charge" && data.outcome.type === "venta_exitosa") {
          alert("✅ Pago con Culqi exitoso. ID: " + data.id);
          clearCart();
          navigate("/productos");
        } else if (
          data.object === "charge" &&
          data.outcome.type === "venta_denegada"
        ) {
          alert(
            "❌ Pago con Culqi denegado. Motivo: " + data.outcome.user_message
          );
        } else {
          alert(
            "❌ Error en el pago con Culqi: " +
              (data.error ? data.error.merchant_message : "Error desconocido.")
          );
        }
      }

      // 🟡 2️⃣ PayPal
      else if (selectedPayment === "paypal") {
        const res = await fetch(
          "http://localhost:4000/api/paypal/crear-orden",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: total }),
          }
        );

        const order = await res.json();
        console.log("✅ Orden de PayPal creada:", order);

        if (order.id && order.links) {
          const approvalLink = order.links.find(
            (link) => link.rel === "approve"
          ).href;
          window.location.href = approvalLink;
        } else {
          throw new Error(
            "No se pudo crear la orden de PayPal o no se encontró el enlace de aprobación."
          );
        }
      }

      // 💳 4️⃣ Stripe
      else if (selectedPayment === "stripe") {
        console.log("💳 Creando sesión de pago Stripe...");
        const res = await fetch(
          "http://localhost:4000/api/essential/create-checkout",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cartItems: cart.map((item) => ({
                title: item.titulo,
                price: item.precio,
                quantity: 1,
              })),
              method: "card",
            }),
          }
        );

        const data = await res.json();
        console.log("💳 Stripe session:", data);

        if (data.ok && data.checkoutUrl) {
          alert("✅ Redirigiendo al checkout de Stripe...");
          clearCart();
          window.location.href = data.checkoutUrl;
        } else {
          throw new Error(data.error || "Error creando sesión de Stripe.");
        }
      }

      // 🪙 5️⃣ CoinGate (Crypto)
      else if (selectedPayment === "coingate") {
        console.log("🪙 Iniciando pago con CoinGate...");
        const res = await fetch(
          "http://localhost:4000/api/essential/create-checkout",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cartItems: cart.map((item) => ({
                title: item.titulo,
                price: item.precio,
                quantity: 1,
              })),
              method: "crypto",
            }),
          }
        );

        const data = await res.json();
        console.log("🪙 CoinGate session:", data);

        if (data.ok && data.checkoutUrl) {
          alert("✅ Redirigiendo al checkout de CoinGate...");
          clearCart();
          window.location.href = data.checkoutUrl;
        } else {
          throw new Error(data.error || "Error creando orden en CoinGate.");
        }
      } else {
        alert("⚠️ Selecciona un método de pago antes de continuar.");
      }
    } catch (err) {
      console.error("Error al procesar pago:", err);
      alert(`❌ Error: ${err.message || err}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white w-[90%] max-w-5xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X size={28} />
        </button>

        {/* Métodos de pago */}
        <div className="w-full md:w-1/3 border-r p-6 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Métodos de Pago
          </h2>

          {/* Culqi */}
          <label
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setSelectedPayment("culqi")}
          >
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPayment === "culqi"
                  ? "border-[#8C9985] bg-[#8C9985]"
                  : "border-gray-400"
              }`}
            ></span>
            <span className="text-lg text-gray-700 font-semibold">Culqi</span>
          </label>

          {/* PayPal */}
          <label
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setSelectedPayment("paypal")}
          >
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPayment === "paypal"
                  ? "border-[#8C9985] bg-[#8C9985]"
                  : "border-gray-400"
              }`}
            ></span>
            <span className="text-lg text-gray-700 font-semibold">PayPal</span>
          </label>

          {/* Stripe */}
          <label
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setSelectedPayment("stripe")}
          >
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPayment === "stripe"
                  ? "border-[#8C9985] bg-[#8C9985]"
                  : "border-gray-400"
              }`}
            ></span>
            <span className="text-lg text-gray-700 font-semibold">
              Tarjeta (Stripe)
            </span>
          </label>

          {/* CoinGate */}
          <label
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setSelectedPayment("coingate")}
          >
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPayment === "coingate"
                  ? "border-[#8C9985] bg-[#8C9985]"
                  : "border-gray-400"
              }`}
            ></span>
            <span className="text-lg text-gray-700 font-semibold">
              CoinGate (Crypto)
            </span>
          </label>

          {/* Total y botones */}
          <div className="mt-auto">
            <div className="text-lg font-semibold mb-2">
              Total: S/ {total.toFixed(2)}
            </div>
            <button
              onClick={handlePago}
              disabled={selectedPayment === null}
              className={`w-full py-3 rounded-lg mb-2 transition ${
                selectedPayment
                  ? "bg-[#8C9985] text-white hover:opacity-90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Pagar
            </button>
            <button
              onClick={() => clearCart()}
              className="w-full border border-gray-300 py-2 rounded-lg text-gray-700"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        {/* Productos */}
        <div className="w-full md:w-2/3 p-6 relative">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-between">
            Carrito de Compras
          </h2>
          {cart.length === 0 ? (
            <p className="text-gray-600">Tu carrito está vacío.</p>
          ) : (
            <ul className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
              {cart.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 p-4 border rounded-lg shadow-sm"
                >
                  <img
                    src={
                      item.imagen ||
                      item.imagenUrl ||
                      "https://via.placeholder.com/80"
                    }
                    alt={item.titulo || "Producto"}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 flex flex-col">
                    <span className="text-lg font-semibold text-gray-800">
                      {item.titulo || "Producto sin nombre"}
                    </span>
                    <span className="text-gray-600">
                      S/ {Number(item.precio || 0)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => removeFromCart(item._id || item.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
