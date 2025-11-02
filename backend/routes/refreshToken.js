const express = require("express");
const { jsonResponse } = require("../lib/jsonResponse");
const log = require("../lib/trace");
const { verifyRefreshToken } = require("../auth/verify");
const { generateAccessToken } = require("../auth/sign");
const Token = require("../schema/token");
const User = require("../schema/user");
const getUserInfo = require("../lib/getUserInfo"); // 🔥 usar la misma función para mantener consistencia

const router = express.Router();

router.post("/", async function (req, res, next) {
  log.info("POST /api/refresh-token");

  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    log.error("No se proporcionó token de actualización");
    return res
      .status(401)
      .json(
        jsonResponse(401, { error: "Token de actualización no proporcionado" })
      );
  }

  try {
    // Verificar que el refreshToken exista en la BD
    const tokenDocument = await Token.findOne({ token: refreshToken });

    if (!tokenDocument) {
      log.error("Token de actualización no encontrado en la base de datos");
      return res
        .status(403)
        .json(jsonResponse(403, { error: "Token de actualización inválido" }));
    }

    // Verificar la firma del refreshToken
    const payload = verifyRefreshToken(tokenDocument.token);

    // Buscar el usuario en la base de datos con el id del payload
    const user = await User.findById(payload.id);
    if (!user) {
      log.error("Usuario no encontrado al refrescar token");
      return res
        .status(404)
        .json(jsonResponse(404, { error: "Usuario no encontrado" }));
    }

    // Obtener info limpia del usuario
    const userInfo = getUserInfo(user);

    // Generar un nuevo accessToken con los datos consistentes
    const accessToken = generateAccessToken(userInfo);

    // Devolvemos nuevo accessToken + el mismo refreshToken
    res.json(
      jsonResponse(200, {
        accessToken,
        refreshToken: tokenDocument.token,
        user: userInfo, // 🔥 opcional: devolver el usuario para el frontend
      })
    );
  } catch (error) {
    log.error("Error al validar refresh token:", error.message);
    return res
      .status(403)
      .json(jsonResponse(403, { error: "Token de actualización inválido" }));
  }
});

module.exports = router;
