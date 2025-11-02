const express = require("express");
const router = express.Router();
const Todo = require("../schema/todo");
const authenticateToken = require("../auth/authenticateToken");
const authorizeRole = require("../auth/authorizeRole");

// 🔹 Obtener todos los todos del usuario autenticado (colaborador o admin)
router.get(
  "/",
  authenticateToken,
  authorizeRole("colaborador", "admin"),
  async (req, res) => {
    try {
      // req.user.id siempre será string gracias a verify.js
      const items = await Todo.find({ idUser: req.user.id });
      return res.json(items);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al obtener los todos" });
    }
  }
);

// 🔹 Crear un nuevo todo (colaborador o admin)
router.post(
  "/",
  authenticateToken,
  authorizeRole("colaborador", "admin"),
  async (req, res) => {
    if (!req.body.title) {
      return res.status(400).json({ error: "Title is required" });
    }

    try {
      const todo = new Todo({
        idUser: req.user.id, // 👈 siempre string
        title: req.body.title,
        completed: false,
      });
      const todoInfo = await todo.save();
      console.log({ todoInfo });
      res.json(todoInfo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear el todo" });
    }
  }
);

// 🔹 (Opcional) Obtener todos los todos de TODOS los usuarios → Solo admin
router.get(
  "/all",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const items = await Todo.find();
      return res.json(items);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Error al obtener todos los todos" });
    }
  }
);

module.exports = router;
