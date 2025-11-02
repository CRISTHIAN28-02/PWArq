const express = require("express");
const User = require("../schema/user");
const { jsonResponse } = require("../lib/jsonResponse");
const router = express.Router();

router.post("/", async function (req, res) {
  const { username, password, name, role } = req.body;

  // Validación de campos requeridos
  if (!username || !password || !name) {
    return res.status(400).json(
      jsonResponse(400, {
        error: "username, password y name son requeridos",
      })
    );
  }

  // Validar rol
  const validRoles = ["administrador", "colaborador"];
  const userRole = validRoles.includes(role) ? role : "colaborador";

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json(
        jsonResponse(409, {
          error: "El username ya existe",
        })
      );
    }

    // Crear nuevo usuario con rol
    const newUser = new User({ username, password, name, role: userRole });
    await newUser.save(); // esperamos que se guarde

    return res.status(201).json(
      jsonResponse(201, {
        message: "Usuario creado exitosamente",
        user: {
          id: newUser._id,
          username: newUser.username,
          name: newUser.name,
          role: newUser.role,
        },
      })
    );
  } catch (err) {
    console.error("Error en signup:", err.message);

    return res.status(500).json(
      jsonResponse(500, {
        error: "Error interno al crear usuario",
      })
    );
  }
});

module.exports = router;
