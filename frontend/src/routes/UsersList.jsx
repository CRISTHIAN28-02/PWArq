// frontend/routes/UsersList.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function UsersList() {
  const { getAccessToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  // Cargar todos los usuarios
  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = getAccessToken();
        const response = await fetch("http://localhost:4000/api/profile/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(data.body.users || []);
        } else {
          setError(data.body?.error || "Error al obtener usuarios");
        }
      } catch (err) {
        setError("Error de conexión al servidor");
      }
    }
    fetchUsers();
  }, [getAccessToken]);

  // Abrir modal con la información de un usuario
  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // Editar campos del usuario
  const handleChange = (e) => {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value,
    });
  };

  // Guardar cambios en el usuario
  const handleSave = async () => {
    try {
      const token = getAccessToken();
      const response = await fetch(
        `http://localhost:4000/api/profile/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedUser),
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Actualizar lista en frontend
        setUsers((prev) =>
          prev.map((u) => (u._id === selectedUser._id ? data.body.user : u))
        );
        handleCloseModal();
      } else {
        alert(data.body?.error || "Error al actualizar usuario");
      }
    } catch (err) {
      alert("Error de conexión al servidor");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#4A5645]">
        Gestión de Perfiles
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border border-gray-200">
          <thead className="bg-[#8C9985] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Rol</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.username}</td>
                <td className="px-4 py-3 capitalize">{user.role}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleOpenModal(user)}
                    className="px-4 py-2 bg-[#8C9985] text-white rounded-lg hover:bg-[#6f7a69] transition"
                  >
                    Ver / Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <h2 className="text-2xl font-semibold mb-4 text-[#4A5645]">
              Editar Perfil
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="name"
                value={selectedUser.name || ""}
                onChange={handleChange}
                placeholder="Nombre completo"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#8C9985]"
              />
              <input
                type="text"
                name="username"
                value={selectedUser.username || ""}
                onChange={handleChange}
                placeholder="Usuario"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#8C9985]"
              />
              {/*<input
                  type="email"
                  name="correo"
                  value={selectedUser.correo || ""}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#8C9985]"
                />*/}
              <input
                type="number"
                name="edad"
                value={selectedUser.edad || ""}
                onChange={handleChange}
                placeholder="Edad"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#8C9985]"
              />
              <input
                type="date"
                name="fechaNacimiento"
                value={
                  selectedUser.fechaNacimiento
                    ? selectedUser.fechaNacimiento.split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#8C9985]"
              />
              <input
                type="text"
                name="carrera"
                value={selectedUser.carrera || ""}
                onChange={handleChange}
                placeholder="Carrera"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#8C9985]"
              />
              <select
                name="role"
                value={selectedUser.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#8C9985]"
              >
                <option value="colaborador">Colaborador</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#8C9985] text-white rounded-lg hover:bg-[#6f7a69] transition"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
