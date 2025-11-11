import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:4000"; // 🚨 URL de tu Backend

function SuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      axios
        .get(`${API_URL}/order-status/${orderId}`)
        .then((response) => {
          setOrder(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error al obtener el estado de la orden:", err);
          setError("No se pudo cargar el detalle de la orden.");
          setLoading(false);
        });
    } else {
      setError("ID de orden no proporcionado.");
      setLoading(false);
    }
  }, [orderId]);

  if (loading)
    return (
      <div className="text-center mt-5">Cargando estado de la orden... 🔄</div>
    );
  if (error)
    return <div className="text-center mt-5 text-danger">Error: {error}</div>;
  if (!order || !order.ok)
    return (
      <div className="text-center mt-5 text-danger">
        Detalle de orden no disponible.
      </div>
    );

  const paidStatus = order.paid
    ? "pagada ✅"
    : "pendiente 🔄 (CoinGate puede tardar unos minutos)";

  return (
    <div className="container text-center" style={{ padding: "60px" }}>
      <h1 className="text-success mb-3">¡Gracias por tu compra!</h1>
      <p className="lead">
        Orden <strong>{orderId}</strong> registrada como {paidStatus}
      </p>
      <div className="card mx-auto mt-4 shadow" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          <h5 className="card-title">Detalle de la Orden</h5>
          <ul className="list-group list-group-flush mb-3">
            {order.items.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  {item.title} x {item.quantity}
                </span>
                <span className="fw-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Monto total: <strong>${order.price.toFixed(2)}</strong>
          </p>
          <p>Método: {order.method}</p>
          <p>Estado: {paidStatus}</p>
          <a href="/" className="btn btn-primary mt-3">
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
