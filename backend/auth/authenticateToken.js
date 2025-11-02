const log = require("../lib/trace");
const validateToken = require("./validateToken");
const { verifyAccessToken } = require("./verify");

function authenticateToken(req, res, next) {
  let token = null;
  log.info("Headers recibidos", req.headers);

  // Validar que se haya enviado el token
  try {
    token = validateToken(req.headers);
  } catch (error) {
    log.error(error.message);

    if (error.message === "Token not provided") {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    if (error.message === "Token format invalid") {
      return res.status(401).json({ error: "Token mal formado" });
    }

    return res.status(401).json({ error: "Error en la validación del token" });
  }

  // Verificar el Access Token
  try {
    const decoded = verifyAccessToken(token);

    // Guardamos solo lo que firmamos en el token
    req.user = {
      id: decoded.id,
      role: decoded.role,
      // username solo si lo incluyes en el payload del accessToken
      ...(decoded.username && { username: decoded.username }),
    };

    next();
  } catch (err) {
    log.error("Token inválido o expirado", err.message);
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
}

module.exports = authenticateToken;
