// src/services/resourceService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ✅ Obtener todos los recursos aprobados desde el backend
export const getApprovedResources = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products/recursos`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener recursos aprobados:", error);
    throw error;
  }
};

// ✅ Obtener un recurso por ID
export const getResourceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/resources/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al obtener el recurso con ID ${id}:`, error);
    throw error;
  }
};

// ✅ Crear un nuevo recurso (solo para administradores o subida manual)
export const createResource = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/api/resources`, data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear recurso:", error);
    throw error;
  }
};

// ✅ Actualizar estado o datos de un recurso
export const updateResource = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/api/resources/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al actualizar el recurso con ID ${id}:`, error);
    throw error;
  }
};

// ✅ Eliminar recurso (solo admin)
export const deleteResource = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/api/resources/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al eliminar el recurso con ID ${id}:`, error);
    throw error;
  }
};
