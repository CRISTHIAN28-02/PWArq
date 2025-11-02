import { Link } from "react-router-dom";
import React from "react";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/authConstants";

export default function PortalLayout({ children }) {
  const auth = useAuth();

  async function handleSignOut(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/signout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getRefreshToken()}`,
        },
      });
      if (response.ok) {
        auth.signout();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF9]">
      {/* Header */}
      <header className="bg-[#8C9985] shadow-md">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-white text-xl font-bold tracking-wide">Portal</h1>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link
                to="/dashboard"
                className="text-white font-medium hover:bg-[#7B8875] px-3 py-2 rounded-lg transition"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/me"
                className="text-white font-medium hover:bg-[#7B8875] px-3 py-2 rounded-lg transition"
              >
                Profile
              </Link>
            </li>
            <li>
              <span className="text-white font-semibold">
                {auth.getUser()?.username ?? ""}
              </span>
            </li>
            <li>
              <a
                href="#"
                onClick={handleSignOut}
                className="text-white font-medium hover:bg-[#7B8875] px-3 py-2 rounded-lg transition"
              >
                Sign out
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10">{children}</main>

      {/* Footer */}
      <footer className="bg-[#8C9985] text-white text-center py-4 mt-8">
        <p className="text-sm">
          © {new Date().getFullYear()} Portal de usuarios
        </p>
      </footer>
    </div>
  );
}
