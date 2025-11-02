const express = require("express");
const User = require("../schema/user");
const { jsonResponse } = require("../lib/jsonResponse");
const getUserInfo = require("../lib/getUserInfo");
const router = express.Router();

router.post("/", async function (req, res, next) {
  const { username, password } = req.body;

  try {
    // Buscar directamente al usuario
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).json(
        jsonResponse(401, {
          error: "Invalid username or password",
        })
      );
    }

    // Verificar contraseña
    const passwordCorrect = await user.isCorrectPassword(
      password,
      user.password
    );

    if (!passwordCorrect) {
      return res.status(401).json(
        jsonResponse(401, {
          error: "Invalid username or password",
        })
      );
    }

    // Obtener info consistente del usuario
    const userInfo = getUserInfo(user);

    // Crear tokens con la info estándar
    const accessToken = user.createAccessToken(userInfo);
    const refreshToken = await user.createRefreshToken(userInfo);

    console.log("Login exitoso:", { username, role: userInfo.role });

    return res.json(
      jsonResponse(200, {
        accessToken,
        refreshToken,
        user: userInfo,
      })
    );
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json(
      jsonResponse(500, {
        error: "Error logging in",
      })
    );
  }
});

module.exports = router;
