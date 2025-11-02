import { useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("colaborador"); // rol por defecto
  const [errorResponse, setErrorResponse] = useState("");

  const auth = useAuth();
  const goTo = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name, role }),
      });

      if (response.ok) {
        const json = await response.json();
        console.log(json);
        setUsername("");
        setPassword("");
        setName("");
        setRole("colaborador");
        goTo("/");
      } else {
        const json = await response.json();
        setErrorResponse(json.body?.error || "Error desconocido");
      }
    } catch (error) {
      console.log(error);
      setErrorResponse("Error de conexión al servidor");
    }
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <DefaultLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Create Account
          </h1>

          {!!errorResponse && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">
              {errorResponse}
            </div>
          )}

          <label className="block text-gray-700 text-sm font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />

          <label className="block text-gray-700 text-sm font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />

          <label className="block text-gray-700 text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />

          <label className="block text-gray-700 text-sm font-medium mb-4">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="colaborador">Colaborador</option>
            <option value="administrador">Administrador</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
}
