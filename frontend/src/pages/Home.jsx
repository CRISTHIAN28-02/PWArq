import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
// ❌ Eliminadas: importaciones de THREE, Canvas, R3F, Drei

export default function Home() {
  const handleNavigation = (section) => {
    console.log(`Navegando a: ${section}`);
    // Ejemplo: navigate(`/${section.toLowerCase()}`);
  };
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
        {/* Suposición: Header se importa correctamente y usa Tailwind */}
        <Header onNavigate={handleNavigation} />

        <main className="pt-24">
          <section className="max-w-7xl mx-auto px-6 py-16 text-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight">
                Diseña el
                <span className="bg-gradient-to-r from-[#8C9985] to-[#514124] bg-clip-text text-transparent">
                  {" "}
                  Futuro
                </span>
              </h1>
            </div>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mt-8">
              Plataforma integral para arquitectos profesionales. Accede a
              recursos especializados, herramientas avanzadas y servicios
              premium para transformar tus ideas en realidad.
            </p>

            {/* --- REEMPLAZO DEL VISOR 3D con contenido relevante --- */}
            <div className="w-full flex justify-center items-center my-12">
              <div className="w-full md:w-2/3 bg-white rounded-3xl shadow-2xl overflow-hidden text-left p-10 md:p-16 border-t-8 border-[#8C9985]">
                <h2 className="text-4xl font-bold text-slate-800 mb-6 flex items-center">
                  <span className="text-5xl mr-3">🏠</span>
                  Nuestra Visión Arquitectónica
                </h2>
                <div className="grid md:grid-cols-2 gap-8 text-slate-600">
                  <div>
                    <h3 className="text-xl font-semibold text-[#514124] mb-3">
                      Innovación Sostenible
                    </h3>
                    <p className="mb-4">
                      Creemos en la arquitectura que no solo es estéticamente
                      superior, sino también **responsable con el planeta**.
                      Nuestra plataforma te conecta con los materiales y las
                      prácticas más innovadoras y sostenibles del mercado.
                    </p>
                    <h3 className="text-xl font-semibold text-[#514124] mb-3">
                      Colaboración Global
                    </h3>
                    <p>
                      Rompe las barreras geográficas. Usa nuestras herramientas
                      para **colaborar con equipos internacionales** en tiempo
                      real, llevando tus proyectos a una escala global con
                      máxima eficiencia.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-xl shadow-inner border border-gray-200">
                    <h3 className="text-xl font-semibold text-[#514124] mb-3">
                      El Ecosistema Completo
                    </h3>
                    <ul className="space-y-2 list-inside list-disc text-slate-700">
                      <li>Modelado BIM avanzado.</li>
                      <li>Gestión documental automática.</li>
                      <li>Renderización en la nube de alta velocidad.</li>
                      <li>Integración con proveedores de materiales.</li>
                    </ul>
                    <p className="mt-4 text-sm text-slate-500 italic">
                      "Transformamos la forma en que los profesionales
                      construyen el futuro."
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* --- Fin del reemplazo --- */}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <button
                onClick={() => navigate("/productos")}
                className="bg-[#8C9985] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Explorar Productos
              </button>
              <button
                onClick={() => navigate("/servicios")}
                className="border-2 border-slate-700 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-slate-700 hover:text-white"
              >
                Ver Servicios
              </button>
            </div>
          </section>

          {/* Características */}
          <section className="bg-white/80 backdrop-blur-sm py-20">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-center text-slate-800 mb-16">
                ¿Por qué elegirnos?
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "📐",
                    title: "Herramientas Profesionales",
                    description:
                      "Accede a las mejores herramientas de diseño y modelado 3D especializadas para arquitectura moderna.",
                  },
                  {
                    icon: "🏗️",
                    title: "Recursos Especializados",
                    description:
                      "Biblioteca completa de materiales, texturas, modelos y documentación técnica siempre actualizada.",
                  },
                  {
                    icon: "👥",
                    title: "Comunidad Profesional",
                    description:
                      "Conecta con arquitectos de todo el mundo, comparte proyectos y colabora en tiempo real.",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center group"
                  >
                    <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Estadísticas */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                {[
                  { number: "10K+", label: "Arquitectos Activos" },
                  { number: "25K+", label: "Proyectos Completados" },
                  { number: "99%", label: "Satisfacción Cliente" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl"
                  >
                    <div className="text-4xl font-bold text-[#8C9985] mb-2">
                      {stat.number}
                    </div>
                    <div className="text-slate-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA final */}
          <section className="bg-gradient-to-r from-[#363835] to-[#5C5E59] py-20 text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold mb-6">¿Listo para comenzar?</h2>
              <p className="text-xl text-slate-300 mb-8">
                Únete a miles de arquitectos que ya confían en nuestra
                plataforma
              </p>
              <button
                onClick={() => handleNavigation("login")}
                className="px-8 py-4 rounded-xl font-semibold text-lg bg-[#8C9985] hover:bg-[#847a6d] shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105"
              >
                Comenzar Ahora
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Suposición: Footer se importa correctamente y usa Tailwind */}
      <Footer />
    </>
  );
}
