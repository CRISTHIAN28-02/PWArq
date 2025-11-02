import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

/**
 * ProtectedRoute controla el acceso a rutas según autenticación y rol.
 * @param {Array} allowedRoles - Array opcional de roles permitidos. Ej: ["administrador"]
 */
export default function ProtectedRoute({ allowedRoles }) {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    // Usuario no autenticado
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.getUser()?.role)) {
    // Usuario autenticado pero sin rol permitido
    return <Navigate to="/unauthorized" replace />;
  }

  // Usuario autenticado y con rol permitido
  return <Outlet />;
}
