import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Inicializar desde localStorage si existe
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Error parseando cart desde localStorage:", e);
      return [];
    }
  });

  // Persistir en localStorage cada vez que cambie el carrito
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Error guardando cart en localStorage:", e);
    }
  }, [cart]);

  const addToCart = (product) => {
    // Product debe venir con { _id?, titulo, precio, imagen }
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (id) => {
    // filtrar por _id o id (seguridad)
    setCart((prev) => prev.filter((item) => (item._id || item.id) !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
