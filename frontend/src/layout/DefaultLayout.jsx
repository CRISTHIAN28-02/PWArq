import { Link } from "react-router-dom";
import React from "react";

export default function DefaultLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF9]">
      {/* Header */}
      <header className="bg-[#8C9985] shadow-md">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-white text-xl font-bold tracking-wide">Mi App</h1>
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/"
                className="text-white font-medium hover:bg-[#7B8875] px-3 py-2 rounded-lg transition"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="text-white font-medium hover:bg-[#7B8875] px-3 py-2 rounded-lg transition"
              >
                Signup
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10">{children}</main>

      {/* Footer opcional */}
      <footer className="bg-[#8C9985] text-white text-center py-4 mt-8">
        <p className="text-sm">
          © {new Date().getFullYear()} Mi App. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
