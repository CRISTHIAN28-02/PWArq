import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { FiDownload, FiSearch } from "react-icons/fi";

const Recursos = () => {
  const recursos = [
    {
      id: 1,
      titulo: "Plano de Casa Minimalista",
      descripcion: "Archivo DWG y PDF con detalles arquitectónicos.",
      tipo: "Plano",
    },
    {
      id: 2,
      titulo: "Render Interior Sala",
      descripcion: "Render fotorrealista de sala moderna.",
      tipo: "Render",
    },
    {
      id: 3,
      titulo: "Modelo 3D SketchUp",
      descripcion: "Proyecto en formato SKP editable.",
      tipo: "3D",
    },
  ];

  return (
    <>
      <Header />

      {/* Contenido principal */}
      <main className="pt-24 min-h-screen bg-gradient-to-b from-[#8C9985] via-[#A5B29D] to-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Encabezado */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              Recursos Gratuitos de Arquitectura
            </h1>
            <p className="mt-4 text-lg text-gray-100">
              Encuentra planos, renders y modelos 3D compartidos por estudiantes
              y profesionales.
            </p>
          </div>

          {/* Buscador */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center bg-white rounded-full shadow-lg w-full md:w-2/3 lg:w-1/2 px-4 py-2">
              <FiSearch className="text-gray-500 text-xl mr-2" />
              <input
                type="text"
                placeholder="Buscar recursos..."
                className="w-full outline-none text-gray-700"
              />
            </div>
          </div>

          {/* Grid de recursos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recursos.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="px-3 py-1 text-sm rounded-full bg-[#8C9985] text-white">
                    {item.tipo}
                  </span>
                  <h2 className="text-xl font-bold mt-4 text-gray-800">
                    {item.titulo}
                  </h2>
                  <p className="mt-2 text-gray-600 text-sm">
                    {item.descripcion}
                  </p>
                </div>
                <button className="mt-6 flex items-center justify-center gap-2 bg-[#8C9985] text-white py-2 px-4 rounded-xl shadow hover:bg-[#7B8874] transition">
                  <FiDownload />
                  Descargar
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Recursos;
