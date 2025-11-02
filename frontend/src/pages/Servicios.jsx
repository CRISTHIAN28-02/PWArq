import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Servicios = () => {
  return (
    <>
      <Header />

      <main className="pt-24 min-h-screen flex justify-center items-center bg-[#f7f7f5] px-4">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 border border-[#999285]/30">
          <h2 className="text-3xl font-bold text-center text-[#999285] mb-6">
            Solicita nuestros servicios
          </h2>

          <form className="space-y-5">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-[#555] mb-2">
                Nombre
              </label>
              <input
                type="text"
                placeholder="Escribe tu nombre"
                className="w-full px-4 py-2 border border-[#999285]/40 rounded-lg focus:ring-2 focus:ring-[#999285] focus:outline-none"
              />
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-[#555] mb-2">
                Correo
              </label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-2 border border-[#999285]/40 rounded-lg focus:ring-2 focus:ring-[#999285] focus:outline-none"
              />
            </div>

            {/* Número */}
            <div>
              <label className="block text-sm font-medium text-[#555] mb-2">
                Número
              </label>
              <input
                type="tel"
                placeholder="+51 999 999 999"
                className="w-full px-4 py-2 border border-[#999285]/40 rounded-lg focus:ring-2 focus:ring-[#999285] focus:outline-none"
              />
            </div>

            {/* Especialidad */}
            <div>
              <label className="block text-sm font-medium text-[#555] mb-2">
                Especialidad
              </label>
              <select className="w-full px-4 py-2 border border-[#999285]/40 rounded-lg focus:ring-2 focus:ring-[#999285] focus:outline-none">
                <option value="">Selecciona una opción</option>
                <option value="arquitecto">Arquitecto(a)</option>
                <option value="interiores">Diseñador(a) de interiores</option>
                <option value="web">Desarrollador web</option>
              </select>
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-sm font-medium text-[#555] mb-2">
                Mensaje
              </label>
              <textarea
                rows="5"
                placeholder="Escribe tu mensaje aquí..."
                className="w-full px-4 py-2 border border-[#999285]/40 rounded-lg focus:ring-2 focus:ring-[#999285] focus:outline-none resize-none"
              ></textarea>
            </div>

            {/* Botón */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full md:w-auto bg-[#999285] hover:bg-[#7f7b6e] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
              >
                Enviar mensaje
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Servicios;
