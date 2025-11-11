import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Servicios from "./pages/Servicios";
import Carrito from "./pages/Carrito";
import Recursos from "./pages/Recursos";

import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Dashboard from "./routes/Dashboard";
import Profile from "./routes/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";

import { AuthProvider } from "./auth/AuthProvider";
import { CartProvider } from "./components/CartContext";
import FloatingCartButton from "./components/FloatingCartButton";
// import Chatbot from "./components/Chatbot";
import "./index.css";
//import N8nChatbot from "./components/n8ncb"; // 👉 Ruta añadida del chatbot n8n
import ChatbotGemini from "./components/ChatbotGemini"; // ✅ Nuevo chatbot con Google Generative AI

// 👇 Layout global que envuelve cada página
const AppLayout = () => {
  return (
    <div className="relative">
      <Outlet /> {/* Aquí se renderizan las páginas */}
      {/* <N8nChatbot /> {/* ✅ Chatbot flotante agregado */}
      <FloatingCartButton /> {/* Botón dentro del contexto del Router */}
      {/* <Chatbot /> {/* Componente del chatbot */}
      <ChatbotGemini />{" "}
      {/* ✅ Nuevo chatbot flotante con Google Generative AI */}
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <AppLayout />, // 👈 Todas las rutas usan este layout
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/productos",
        element: <Productos />,
      },
      {
        path: "/servicios",
        element: <Servicios />,
      },
      {
        path: "/recursos",
        element: <Recursos />,
      },
      {
        path: "/carrito",
        element: <Carrito />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/me",
            element: <Profile />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
