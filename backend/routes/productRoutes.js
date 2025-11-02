const express = require("express");
const {
  createProduct,
  getPendingProducts,
  approveProduct,
  rejectProduct,
  getApprovedProducts,
  getAllProducts, // 👈 nuevo controlador
} = require("../controllers/productController.js");

// ✅ Middleware de autenticación
const { protect } = require("../auth/authMiddleware.js");

// ✅ Middleware de roles
const authorizeRole = require("../auth/authorizeRole.js");

const router = express.Router();

// 📌 Subir producto (solo Colaborador)
router.post("/", protect, authorizeRole("colaborador"), createProduct);

// 📌 Ver productos pendientes (solo Admin)
router.get(
  "/pendientes",
  protect,
  authorizeRole("administrador"),
  getPendingProducts
);

// 📌 Ver TODOS los productos (pendientes + aprobados) (solo Admin)
router.get("/all", protect, authorizeRole("administrador"), getAllProducts);

// 📌 Aprobar producto (solo Admin)
router.patch(
  "/:id/aprobar",
  protect,
  authorizeRole("administrador"),
  approveProduct
);

// 📌 Rechazar producto (solo Admin)
router.delete(
  "/:id/rechazar",
  protect,
  authorizeRole("administrador"),
  rejectProduct
);

// 📌 Ver productos aprobados (público)
router.get("/", getApprovedProducts);

module.exports = router;
