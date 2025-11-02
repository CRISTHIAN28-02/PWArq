function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user || !user.role) {
        return res.status(403).json({
          success: false,
          message: "Acceso denegado. Usuario no autenticado.",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Acceso denegado. No tienes permisos suficientes.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error en la autorización",
        error: error.message,
      });
    }
  };
}

module.exports = authorizeRole;
