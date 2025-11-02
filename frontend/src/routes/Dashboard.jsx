import { useEffect, useState } from "react";
import PortalLayout from "../layout/PortalLayout";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/authConstants";
import UsersList from "./UsersList";
import ProductosAdmin from "./ProductosAdmin"; // 👈 agregado
import ProductosColaborador from "./ProductosColaborador"; // 👈 agregado

export default function Dashboard() {
  const auth = useAuth();

  const [todos, setTodos] = useState([]);
  const [value, setValue] = useState("");
  const [activeTab, setActiveTab] = useState("todos"); // 👈 alternar vista

  async function getTodos() {
    const accessToken = auth.getAccessToken();
    if (!accessToken) {
      console.warn("⚠️ No se encontró token de acceso, redirigir al login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        setTodos(json);
      } else {
        console.error("❌ Error al obtener tareas:", response.status);
      }
    } catch (error) {
      console.error("❌ Error de red en getTodos:", error);
    }
  }

  async function createTodo() {
    const accessToken = auth.getAccessToken();
    if (!accessToken) {
      console.warn("⚠️ No se encontró token de acceso, redirigir al login");
      return;
    }

    if (value.length > 3) {
      try {
        const response = await fetch(`${API_URL}/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ title: value }),
        });

        if (response.ok) {
          const todo = await response.json();
          setTodos([...todos, todo]);
          setValue("");
        } else {
          console.error("❌ Error al crear tarea:", response.status);
        }
      } catch (error) {
        console.error("❌ Error de red en createTodo:", error);
      }
    }
  }

  useEffect(() => {
    if (activeTab === "todos") {
      getTodos();
    }
  }, [activeTab]);

  function handleSubmit(e) {
    e.preventDefault();
    createTodo();
  }

  const userRole = auth.getUser()?.role; // 👈 obtenemos rol

  return (
    <PortalLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#8C9985] mb-6">
          Dashboard de {auth.getUser()?.name ?? ""}
        </h1>

        {/* Tabs de navegación */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "todos"
                ? "text-white bg-[#8C9985] rounded-t-lg"
                : "text-gray-600 hover:text-[#8C9985]"
            }`}
            onClick={() => setActiveTab("todos")}
          >
            Tareas
          </button>

          {/* 👇 Solo admins ven este tab */}
          {userRole === "administrador" && (
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "users"
                  ? "text-white bg-[#8C9985] rounded-t-lg"
                  : "text-gray-600 hover:text-[#8C9985]"
              }`}
              onClick={() => setActiveTab("users")}
            >
              Usuarios
            </button>
          )}

          {/* 👇 Todos ven este tab */}
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "productos"
                ? "text-white bg-[#8C9985] rounded-t-lg"
                : "text-gray-600 hover:text-[#8C9985]"
            }`}
            onClick={() => setActiveTab("productos")}
          >
            Productos
          </button>
        </div>

        {/* Contenido dinámico */}
        {activeTab === "todos" && (
          <div>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Nueva tarea..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C9985] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#8C9985] text-white rounded-lg hover:bg-[#7B8875] transition"
              >
                Agregar
              </button>
            </form>

            <div className="space-y-3">
              {todos.map((post) => (
                <div
                  key={post._id || post.id} // 👈 usamos _id por consistencia con Mongo
                  className="p-4 bg-gray-50 rounded-lg shadow border border-gray-200"
                >
                  <h3 className="font-semibold text-[#8C9985]">{post.title}</h3>
                  <p className="text-sm text-gray-600">
                    {post.completed ? "✅ Completado" : "❌ Pendiente"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 👇 Solo admins pueden ver UsersList */}
        {activeTab === "users" && userRole === "administrador" && <UsersList />}

        {/* 👇 Productos: admin ve ProductosAdmin, colaborador ve ProductosColaborador */}
        {activeTab === "productos" && (
          <div>
            {userRole === "administrador" ? (
              <ProductosAdmin />
            ) : (
              <ProductosColaborador />
            )}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
