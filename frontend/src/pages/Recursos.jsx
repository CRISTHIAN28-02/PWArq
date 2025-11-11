// src/pages/Recursos.jsx
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ProductCard from "../components/ProductCard";
import { getApprovedResources } from "../services/resourceService";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "../components/CartContext";

const Recursos = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedResource, setSelectedResource] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  const { addToCart } = useCart();

  // 🔹 Cargar recursos aprobados desde el backend
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getApprovedResources();
        // Asegurar que solo se muestren recursos válidos y aprobados
        const approvedResources = Array.isArray(data)
          ? data.filter(
              (item) => item.estado === "aprobado" && item.tipo === "recurso"
            )
          : [];
        setResources(approvedResources);
      } catch (err) {
        console.error("❌ Error al cargar recursos:", err);
        setError("No se pudieron cargar los recursos.");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // 🔹 Agregar recurso al carrito
  const handleAddToCart = (resource) => {
    const resourceToAdd = {
      _id: resource._id,
      titulo: resource.titulo,
      precio: resource.precio || 0,
      tipo: "recurso",
      imagen:
        resource.imagenes?.length > 0
          ? resource.imagenes[0]
          : "https://via.placeholder.com/400x300.png?text=Recurso",
    };

    addToCart(resourceToAdd);
    alert("📚 Recurso agregado al carrito correctamente");
  };

  // 🔹 Navegación entre imágenes del modal
  const handlePrevImage = () => {
    if (selectedResource?.imagenes?.length) {
      setCurrentImage((prev) =>
        prev === 0 ? selectedResource.imagenes.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedResource?.imagenes?.length) {
      setCurrentImage((prev) =>
        prev === selectedResource.imagenes.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleCloseModal = () => {
    setSelectedResource(null);
    setCurrentImage(0);
  };

  return (
    <>
      <Header />

      <main className="pt-20 min-h-screen bg-gray-50">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center my-10 text-[#8C9985]">
            Recursos disponibles
          </h1>

          {loading && (
            <p className="text-center text-gray-600">Cargando recursos...</p>
          )}

          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && resources.length === 0 && (
            <p className="text-center text-gray-600">
              No hay recursos disponibles por el momento.
            </p>
          )}

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {resources.map((resource) => (
              <div
                key={resource._id}
                onClick={() => setSelectedResource(resource)}
                className="cursor-pointer"
              >
                <ProductCard product={resource} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* 🔹 Modal para ver detalles del recurso */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col md:flex-row overflow-hidden">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X size={28} />
            </button>

            {/* Carrusel de imágenes */}
            <div className="relative w-full md:w-2/3 h-96 bg-black flex items-center justify-center">
              {selectedResource.imagenes?.length > 0 ? (
                <img
                  src={selectedResource.imagenes[currentImage]}
                  alt={selectedResource.titulo}
                  className="h-full w-full object-contain max-h-96"
                />
              ) : (
                <img
                  src="https://via.placeholder.com/600x400.png?text=Recurso"
                  alt="Recurso"
                  className="h-full w-full object-contain"
                />
              )}

              {selectedResource.imagenes?.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/70"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/70"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}
            </div>

            {/* Información del recurso */}
            <div className="w-full md:w-1/3 p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedResource.titulo}
                </h2>
                <p className="text-lg text-gray-700 font-semibold mb-2">
                  S/ {selectedResource.precio}
                </p>
                <p className="text-gray-600 mb-4">
                  {selectedResource.descripcion}
                </p>
              </div>

              <button
                onClick={() => handleAddToCart(selectedResource)}
                className="bg-[#8C9985] text-white py-3 rounded-xl font-semibold hover:bg-[#7A8574] transition-colors"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Recursos;
