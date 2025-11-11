// src/services/productService.js
import axios from "axios";
import requestNewAccessToken from "../auth/requestNewAccessToken.js";

// 🌐 URL base del backend (solo productos)
const API_URL = "http://localhost:4000/api/products";

// 🧩 Instancia de axios con interceptores
const api = axios.create({
  baseURL: API_URL,
});

// ✅ Interceptor: inyectar token en cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor: manejar errores 401/403 (token vencido o inválido)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.error("❌ No refreshToken disponible en localStorage");
        return Promise.reject(error);
      }

      try {
        // 🔄 Solicitar nuevo accessToken
        const newAccessToken = await requestNewAccessToken(refreshToken);

        if (newAccessToken) {
          console.log("✅ Nuevo accessToken obtenido:", newAccessToken);
          localStorage.setItem("accessToken", newAccessToken);

          // Reintentar la request original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } else {
          console.error("❌ No se pudo renovar el accessToken");
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error("❌ Error al intentar refrescar el token:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

//
// 🛒 PRODUCTOS
//

// 📌 Obtener productos aprobados (público)
export const getApprovedProducts = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener productos aprobados:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 📌 Obtener TODOS los productos (solo Admin)
export const getAllProducts = async () => {
  try {
    const response = await api.get("/all");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener todos los productos:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 📌 Obtener productos pendientes (solo Admin)
export const getPendingProducts = async () => {
  try {
    const response = await api.get("/pendientes");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener productos pendientes:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 📌 Crear un nuevo producto (solo Colaborador)
export const createProduct = async (productData) => {
  try {
    const payload = {
      imagenes: productData.imagenes || [],
      titulo: productData.titulo,
      tags: productData.tags || [],
      descripcion: productData.descripcion,
      precio: Number(productData.precio),
    };

    const response = await api.post("/", payload);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al crear producto:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 📌 Aprobar producto (solo Admin)
export const approveProduct = async (id) => {
  try {
    const response = await api.patch(`/${id}/aprobar`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error al aprobar producto con id ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// 📌 Rechazar producto (solo Admin)
export const rejectProduct = async (id) => {
  try {
    const response = await api.delete(`/${id}/rechazar`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error al rechazar producto con id ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// 📌 Eliminar producto definitivamente (solo Admin)
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error al eliminar producto con id ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// 📌 Obtener un producto por ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error al obtener producto con id ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
