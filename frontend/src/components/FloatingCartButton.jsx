import React from "react";
import { useCart } from "./CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import carritoIcon from "../assets/carrito.png";

const FloatingCartButton = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Rutas donde NO se mostrará el carrito
  const hiddenRoutes = ["/login", "/signup", "/dashboard", "/me"];
  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <div
      onClick={() => navigate("/carrito")}
      className="fixed bottom-14 right-4 w-15 h-15 sm:w-15 sm:h-15 md:w-28 md:h-28 
                 bg-white rounded-full shadow-lg flex items-center justify-center 
                 cursor-pointer hover:scale-110 transition-transform duration-300"
      style={{ zIndex: 1000 }}
    >
      {/* Ícono del carrito (usa tu .png aquí) */}
      <img
        src={carritoIcon} // cámbialo a la ruta de tu imagen
        alt="Carrito"
        className="w-2/3 h-2/3 object-contain"
      />

      {/* Badge rojo con cantidad */}
      {cart.length > 0 && (
        <span
          className="absolute top-4 right-4 bg-red-600 text-white text-xs 
                         font-bold rounded-full w-6 h-6 flex items-center 
                         justify-center shadow-md"
        >
          {cart.length}
        </span>
      )}
    </div>
  );
};

export default FloatingCartButton;
