// src/routes/ProductosAdmin.jsx
import React, { useEffect, useState } from "react";
import ProductTable from "../components/ProductTable";
import {
  getAllProducts,
  approveProduct,
  rejectProduct,
  deleteProduct,
} from "../services/productService";

const ProductosAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos al iniciar
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Aprobar producto
  const handleApprove = async (id) => {
    try {
      await approveProduct(id);
      fetchProducts();
    } catch (error) {
      console.error("Error al aprobar producto:", error);
    }
  };

  // Rechazar producto
  const handleReject = async (id) => {
    try {
      await rejectProduct(id);
      fetchProducts();
    } catch (error) {
      console.error("Error al rechazar producto:", error);
    }
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#8C9985] mb-6">
        Gestión de Productos
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando productos...</p>
      ) : (
        <ProductTable
          products={products}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ProductosAdmin;
