const express = require("express");
const { jsonResponse } = require("../lib/jsonResponse");
const log = require("../lib/trace");
const authenticateToken = require("../auth/authenticateToken");

const router = express.Router();

/**
 * GET /user
 * Devuelve la información del usuario autenticado
 */
router.get("/", authenticateToken, async function (req, res) {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json(jsonResponse(401, { error: "Usuario no autenticado" }));
    }

    log.info("Usuario autenticado:", req.user);

    res.json(
      jsonResponse(200, {
        id: req.user.id,
        username: req.user.username,
        name: req.user.name,
        role: req.user.role,
      })
    );
  } catch (error) {
    log.error("Error en /user:", error);
    res
      .status(500)
      .json(jsonResponse(500, { error: "Error interno del servidor" }));
  }
});

module.exports = router;
