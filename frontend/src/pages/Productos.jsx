import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ProductCard from "../components/ProductCard";
import { getApprovedProducts } from "../services/productService";
import { X, ChevronLeft, ChevronRight } from "lucide-react"; // flechas y cerrar
import { useCart } from "../components/CartContext";

const Productos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getApprovedProducts();
        setProducts(data);
      } catch (err) {
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 🛒 Agregar producto al carrito — usa addToCart del contexto
  const handleAddToCart = (product) => {
    const productToAdd = {
      _id: product._id,
      titulo: product.titulo,
      precio: product.precio,
      imagen:
        product.imagenes && product.imagenes.length > 0
          ? product.imagenes[0]
          : "",
    };

    addToCart(productToAdd);
    // ya se persistirá en localStorage desde CartContext (useEffect)
    // Mensaje UX (puedes reemplazar por un toast)
    alert("Producto agregado al carrito 🛒");
  };

  // Cambiar imagen con flechas
  const handlePrevImage = () => {
    if (selectedProduct) {
      setCurrentImage((prev) =>
        prev === 0 ? selectedProduct.imagenes.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedProduct) {
      setCurrentImage((prev) =>
        prev === selectedProduct.imagenes.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setCurrentImage(0);
  };

  return (
    <>
      <Header />

      <main className="pt-20 min-h-screen bg-gray-50">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center my-10 text-[#8C9985]">
            Productos disponibles
          </h1>

          {loading && (
            <p className="text-center text-gray-600">Cargando productos...</p>
          )}

          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && products.length === 0 && (
            <p className="text-center text-gray-600">
              No hay productos disponibles por el momento.
            </p>
          )}

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => setSelectedProduct(product)}
                className="cursor-pointer"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* 🔥 Modal de producto */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col md:flex-row overflow-hidden">
            {/* Botón cerrar */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X size={28} />
            </button>

            {/* Imágenes con navegación */}
            <div className="relative w-full md:w-2/3 h-96 bg-black flex items-center justify-center">
              {selectedProduct.imagenes &&
              selectedProduct.imagenes.length > 0 ? (
                <img
                  src={selectedProduct.imagenes[currentImage]}
                  alt={selectedProduct.titulo}
                  className="h-full object-contain max-h-96"
                />
              ) : (
                <img
                  src="https://via.placeholder.com/600x400.png?text=Producto"
                  alt="Producto"
                  className="h-full object-contain"
                />
              )}

              {/* Flechas navegación */}
              {selectedProduct.imagenes &&
                selectedProduct.imagenes.length > 1 && (
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

            {/* Info producto */}
            <div className="w-full md:w-1/3 p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedProduct.titulo}
                </h2>
                <p className="text-lg text-gray-700 font-semibold mb-2">
                  S/ {selectedProduct.precio}
                </p>
                <p className="text-gray-600 mb-4">
                  {selectedProduct.descripcion}
                </p>
              </div>

              <button
                onClick={() => {
                  handleAddToCart(selectedProduct);
                }}
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

export default Productos;
