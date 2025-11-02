// backend/routes/profile.js
const express = require("express");
const User = require("../schema/user");
const { jsonResponse } = require("../lib/jsonResponse");
const authenticateToken = require("../auth/authenticateToken");
const authorizeRole = require("../auth/authorizeRole");

const router = express.Router();

/**
 * GET /api/profile
 * Devuelve el perfil del usuario autenticado
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // excluye el password
    if (!user) {
      return res
        .status(404)
        .json(jsonResponse(404, { error: "Usuario no encontrado" }));
    }
    res.json(jsonResponse(200, { user }));
  } catch (err) {
    console.error("Error en GET /profile:", err.message);
    res
      .status(500)
      .json(jsonResponse(500, { error: "Error interno del servidor" }));
  }
});

/**
 * GET /api/profile/all
 * Devuelve todos los perfiles (solo administradores)
 */
router.get(
  "/all",
  authenticateToken,
  authorizeRole("administrador"),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(jsonResponse(200, { users }));
    } catch (err) {
      console.error("Error en GET /profile/all:", err.message);
      res
        .status(500)
        .json(jsonResponse(500, { error: "Error interno del servidor" }));
    }
  }
);

/**
 * PUT /api/profile/:id
 * Edita el perfil de un usuario (solo administradores)
 */
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("administrador"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Permitimos actualizar solo algunos campos
      const allowedUpdates = [
        "name",
        "username",
        "role",
        "edad",
        "fechaNacimiento",
        "correo",
        "carrera",
      ];

      const updates = {};
      allowedUpdates.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      const updatedUser = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!updatedUser) {
        return res
          .status(404)
          .json(jsonResponse(404, { error: "Usuario no encontrado" }));
      }

      res.json(
        jsonResponse(200, { message: "Perfil actualizado", user: updatedUser })
      );
    } catch (err) {
      console.error("Error en PUT /profile/:id:", err.message);
      res
        .status(500)
        .json(jsonResponse(500, { error: "Error interno del servidor" }));
    }
  }
);

module.exports = router;
