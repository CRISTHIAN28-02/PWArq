// backend/auth/sign.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

function sign(payload, isAccessToken) {
  const secret = isAccessToken
    ? process.env.ACCESS_TOKEN_SECRET
    : process.env.REFRESH_TOKEN_SECRET;

  const expiresIn = isAccessToken
    ? process.env.ACCESS_TOKEN_EXPIRATION || "1h" // Acceso
    : process.env.REFRESH_TOKEN_EXPIRATION || "7d"; // Refresh

  // 🔴 IMPORTANTE: firmamos el payload PLANO, SIN envolver en { user: ... }
  return jwt.sign(payload, secret, {
    expiresIn,
    algorithm: "HS256",
  });
}

// Generar token de acceso (payload PLANO con al menos id y role)
function generateAccessToken(userInfo) {
  // userInfo debe ser { id, username, name, role }
  return sign(
    {
      id: userInfo.id,
      username: userInfo.username,
      name: userInfo.name,
      role: userInfo.role,
    },
    true
  );
}

// Generar token de refresco (basta con el id)
function generateRefreshToken(userInfo) {
  return sign(
    {
      id: userInfo.id, // mínimo requerido para /refresh-token
    },
    false
  );
}

module.exports = { generateAccessToken, generateRefreshToken };
