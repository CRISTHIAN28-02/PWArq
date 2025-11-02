import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Imagen del producto */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={
            Array.isArray(product.imagenes) && product.imagenes.length > 0
              ? product.imagenes[0] // primera imagen del array
              : "https://via.placeholder.com/300x200.png?text=Producto"
          }
          alt={product.titulo}
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Información del producto */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
            {product.titulo}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-2">
            {product.descripcion}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-[#8C9985]">
            S/ {product.precio}
          </span>
          <button className="bg-[#8C9985] text-white px-4 py-2 rounded-lg hover:bg-[#7A8574] transition-colors">
            Ver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
