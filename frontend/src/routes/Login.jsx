import { useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import { useAuth } from "../auth/AuthProvider";
import { Navigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState("");

  const auth = useAuth();

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const json = await response.json();

      if (response.ok && json.body.accessToken && json.body.refreshToken) {
        // 🔑 Guardar tokens en localStorage
        localStorage.setItem("accessToken", json.body.accessToken);
        localStorage.setItem("refreshToken", json.body.refreshToken);

        // ✅ Guardamos usuario y rol en el AuthProvider
        auth.saveUser({
          user: json.body.user,
          role: json.body.role,
          accessToken: json.body.accessToken,
          refreshToken: json.body.refreshToken,
        });
      } else {
        setErrorResponse(json.body?.error || "Error desconocido");
      }
    } catch (error) {
      console.log("Error en login:", error);
      setErrorResponse("Error de conexión al servidor");
    }
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <DefaultLayout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
        >
          <h1
            className="text-3xl font-bold text-center mb-6"
            style={{ color: "#8C9985" }}
          >
            Login
          </h1>
          {!!errorResponse && (
            <div className="bg-red-100 text-red-600 p-2 mb-4 rounded-md text-sm">
              {errorResponse}
            </div>
          )}

          <label className="block text-gray-700 font-medium mb-1">
            Username
          </label>
          <input
            name="username"
            type="text"
            onChange={handleChange}
            value={username}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{ focusRingColor: "#8C9985" }}
          />

          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={password}
            className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{ focusRingColor: "#8C9985" }}
          />

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg text-white font-semibold shadow-md transition duration-300"
            style={{ backgroundColor: "#8C9985" }}
          >
            Login
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
}
