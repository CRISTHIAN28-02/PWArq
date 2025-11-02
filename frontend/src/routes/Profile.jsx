// frontend/pages/Profile.jsx
import { useEffect, useState } from "react";
import PortalLayout from "../layout/PortalLayout";
import { API_URL } from "../auth/authConstants";
import { useAuth } from "../auth/AuthProvider";

export default function Profile() {
  const auth = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let token = auth.getAccessToken();
        const refreshToken = localStorage.getItem("refreshToken");

        if (!token) {
          setError("No se encontró el token de acceso");
          setLoading(false);
          return;
        }

        let response = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ⚡ Si falla por token inválido o expirado, intentamos refrescar
        if (response.status === 403 && refreshToken) {
          const refreshRes = await fetch(`${API_URL}/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            token = refreshData.body.accessToken;
            localStorage.setItem("accessToken", token);

            response = await fetch(`${API_URL}/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } else {
            throw new Error("No se pudo refrescar el token");
          }
        }

        if (!response.ok) {
          throw new Error("Error al obtener el perfil");
        }

        const data = await response.json();
        const userData = data.body?.user || data.user || null;

        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [auth]);

  return (
    <PortalLayout>
      <div className="flex justify-center items-center min-h-[80vh] bg-[#f9faf9] p-6">
        {loading ? (
          <p className="text-[#8C9985] font-medium">Cargando perfil...</p>
        ) : error ? (
          <p className="text-red-500 font-semibold">{error}</p>
        ) : user ? (
          <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl border border-[#8C9985]/30 p-8">
            <h1 className="text-2xl font-bold text-[#8C9985] mb-6 text-center">
              Mi Perfil
            </h1>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-500">Usuario</p>
                <p className="text-lg text-gray-800">{user.username}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Nombre completo
                </p>
                <p className="text-lg text-gray-800">{user.name}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Correo electrónico
                </p>
                <p className="text-lg text-gray-800">
                  {user.correo || "No registrado"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Edad</p>
                  <p className="text-lg text-gray-800">
                    {user.edad || "No especificada"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Fecha de nacimiento
                  </p>
                  <p className="text-lg text-gray-800">
                    {user.fechaNacimiento
                      ? new Date(user.fechaNacimiento).toLocaleDateString()
                      : "No registrada"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">Carrera</p>
                <p className="text-lg text-gray-800">
                  {user.carrera || "No registrada"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">Rol</p>
                <span className="inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full bg-[#8C9985]/20 text-[#8C9985]">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No se encontró información de perfil.</p>
        )}
      </div>
    </PortalLayout>
  );
}
