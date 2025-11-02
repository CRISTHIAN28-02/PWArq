// src/routes/ProductosColaborador.jsx
import React, { useState } from "react";
import PortalLayout from "../layout/PortalLayout";
import ProductForm from "../components/ProductForm";
import { createProduct } from "../services/productService";
import { useAuth } from "../auth/AuthProvider";

const ProductosColaborador = () => {
  const { user } = useAuth(); // Para obtener token del usuario logueado
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleProductSubmit = async (productData) => {
    setMessage("");
    setError("");
    try {
      const response = await createProduct(productData, user?.token);
      setMessage("✅ Producto enviado para revisión.");
      console.log("Producto creado:", response);
    } catch (err) {
      setError("❌ Error al enviar el producto.");
      console.error(err);
    }
  };

  return (
    <>
      <main className="pt-20 min-h-screen bg-gray-50">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center my-8 text-[#8C9985]">
            Subir Producto
          </h1>

          {message && (
            <p className="text-center text-green-600 font-medium">{message}</p>
          )}
          {error && (
            <p className="text-center text-red-500 font-medium">{error}</p>
          )}

          {/* Formulario para subir producto */}
          <ProductForm onSubmit={handleProductSubmit} />
        </section>
      </main>
    </>
  );
};

export default ProductosColaborador;
