// src/components/ProductForm.jsx
import React, { useState } from "react";

const ProductForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    tags: "",
    imagenes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.titulo || !formData.descripcion || !formData.tags) {
      alert("⚠️ Por favor completa los campos obligatorios.");
      return;
    }

    // Normalizar datos antes de enviarlos al backend
    const normalizedData = {
      titulo: formData.titulo.trim(),
      descripcion: formData.descripcion.trim(),
      precio: formData.precio ? Number(formData.precio) : null,
      tags: formData.tags
        .split(",")
        .map((tag) =>
          tag.trim().startsWith("#") ? tag.trim() : `#${tag.trim()}`
        )
        .filter((tag) => tag !== ""),
      imagenes: formData.imagenes
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url !== ""),
    };

    onSubmit(normalizedData);

    // Reset form
    setFormData({
      titulo: "",
      descripcion: "",
      precio: "",
      tags: "",
      imagenes: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4 border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-[#8C9985] text-center">
        Subir Nuevo Producto
      </h2>

      {/* Título */}
      <div>
        <label className="block text-gray-700 font-medium">Título *</label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          placeholder="Ej. Proyecto de Arquitectura"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8C9985] outline-none"
          required
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-gray-700 font-medium">Descripción *</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Describe el recurso o proyecto..."
          rows="4"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8C9985] outline-none"
          required
        ></textarea>
      </div>

      {/* Precio */}
      <div>
        <label className="block text-gray-700 font-medium">Precio *</label>
        <input
          type="number"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          placeholder="Ej. 50.00"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8C9985] outline-none"
          min="1"
          step="0.01"
          required
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-gray-700 font-medium">
          Tags (separados por coma) *
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Ej. arquitectura, planos, render"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8C9985] outline-none"
          required
        />
      </div>

      {/* Imágenes */}
      <div>
        <label className="block text-gray-700 font-medium">
          URLs de Imágenes (mínimo 3, separadas por coma) *
        </label>
        <input
          type="text"
          name="imagenes"
          value={formData.imagenes}
          onChange={handleChange}
          placeholder="https://imgur.com/abc, https://imgur.com/def"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8C9985] outline-none"
          required
        />
      </div>

      {/* Botón */}
      <button
        type="submit"
        className="w-full bg-[#8C9985] text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:opacity-90 hover:scale-[1.02]"
      >
        Guardar Producto
      </button>
    </form>
  );
};

export default ProductForm;
