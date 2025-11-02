import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-slate-800">
            IntSis
          </Link>

          {/* Panel de navegación */}
          <nav className="hidden md:flex">
            <ul className="flex items-center space-x-8">
              <li>
                <Link
                  to="/recursos"
                  className="text-slate-700 hover:text-[#999285] font-medium transition-all duration-300 relative group"
                >
                  Recursos
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8C9985] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/productos"
                  className="text-slate-700 hover:text-[#8C9985] font-medium transition-all duration-300 relative group"
                >
                  Productos
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8C9985] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/servicios"
                  className="text-slate-700 hover:text-[#999285] font-medium transition-all duration-300 relative group"
                >
                  Servicios
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8C9985] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-full font-semibold text-white bg-[#8C9985] hover:bg-[#847a6d] shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105"
                >
                  Login
                </Link>
              </li>
            </ul>
          </nav>

          {/* Menú móvil */}
          <div className="md:hidden">
            <button className="text-slate-700 hover:text-blue-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
