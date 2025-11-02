const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Verifica un Access Token y retorna el payload
 */
function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Normalizar siempre a { id, username, role }
    if (!decoded.id || !decoded.username || !decoded.role) {
      throw new Error("Token inválido: falta información de usuario");
    }

    return {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };
  } catch (err) {
    console.error("Error verificando access token:", err.message);
    throw new Error("Acceso denegado: token inválido o expirado");
  }
}

/**
 * Verifica un Refresh Token y retorna el payload
 * Ahora el refresh token solo debe contener el id
 */
function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded.id) {
      throw new Error("Refresh token inválido: falta id de usuario");
    }

    return { id: decoded.id };
  } catch (err) {
    console.error("Error verificando refresh token:", err.message);
    throw new Error("Refresh token inválido o expirado");
  }
}

module.exports = { verifyAccessToken, verifyRefreshToken };
