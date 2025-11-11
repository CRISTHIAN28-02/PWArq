import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react"; // ícono moderno de menú

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoverActive, setHoverActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🧠 Abrir sidebar al pasar el mouse por la izquierda
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientX < 60) {
        setHoverActive(true);
      } else if (!sidebarOpen) {
        setHoverActive(false);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Header superior */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Botón menú lateral */}
          <button
            onClick={toggleSidebar}
            className="text-[#999285] hover:text-[#7f776b] transition-all duration-300"
          >
            <Menu size={28} />
          </button>

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-slate-800">
            Integracion...
          </Link>
        </div>
      </header>

      {/* Sidebar dinámico */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#999285] text-white shadow-2xl transform transition-transform duration-500 z-40 ${
          sidebarOpen || hoverActive ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="px-6 py-5 text-2xl font-semibold border-b border-white/30">
              Menú
            </div>
            <nav className="mt-6">
              <ul className="flex flex-col space-y-3 px-6">
                <li>
                  <Link
                    to="/recursos"
                    onClick={() => setSidebarOpen(false)}
                    className="block py-2 font-medium hover:bg-white/20 rounded-md transition-all duration-300"
                  >
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/productos"
                    onClick={() => setSidebarOpen(false)}
                    className="block py-2 font-medium hover:bg-white/20 rounded-md transition-all duration-300"
                  >
                    Productos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/servicios"
                    onClick={() => setSidebarOpen(false)}
                    className="block py-2 font-medium hover:bg-white/20 rounded-md transition-all duration-300"
                  >
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    onClick={() => setSidebarOpen(false)}
                    className="block py-3 text-center bg-white text-[#999285] font-semibold rounded-full hover:bg-slate-100 transition-all duration-300 mt-3"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="text-center py-4 text-sm opacity-80">
            © {new Date().getFullYear()} IntSis
          </div>
        </div>
      </div>

      {/* Fondo semitransparente al abrir menú (solo clic, no hover) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
        ></div>
      )}
    </>
  );
};

export default Header;
