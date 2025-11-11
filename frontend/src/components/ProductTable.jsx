import React from "react";

const ProductTable = ({ products, onApprove, onReject, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-[#8C9985] text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Título
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Precio
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Estado
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="px-6 py-4 text-center text-gray-500 italic"
              >
                No hay productos o recursos disponibles
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                {/* Tipo */}
                <td className="px-6 py-4 text-sm capitalize">
                  {product.tipo || "producto"}
                </td>

                {/* Título */}
                <td className="px-6 py-4 text-sm">{product.titulo}</td>

                {/* Descripción */}
                <td className="px-6 py-4 text-sm">{product.descripcion}</td>

                {/* Precio */}
                <td className="px-6 py-4 text-sm">
                  {product.tipo === "recurso"
                    ? product.precio === 0
                      ? "Gratis"
                      : `S/ ${product.precio?.toFixed(2) || "0.00"}`
                    : `S/ ${product.precio?.toFixed(2) || "0.00"}`}
                </td>

                {/* Estado */}
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.estado === "aprobado"
                        ? "bg-green-100 text-green-700"
                        : product.estado === "rechazado"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {product.estado || "pendiente"}
                  </span>
                </td>

                {/* Acciones */}
                <td className="px-6 py-4 text-sm flex gap-2 justify-center">
                  {product.estado !== "aprobado" && (
                    <button
                      onClick={() => onApprove(product._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs"
                    >
                      Aprobar
                    </button>
                  )}
                  {product.estado !== "rechazado" && (
                    <button
                      onClick={() => onReject(product._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs"
                    >
                      Rechazar
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(product._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
