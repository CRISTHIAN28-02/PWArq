const express = require("express");
const {
  // 🛒 Productos
  createProduct,
  getPendingProducts,
  getAllProducts,
  approveProduct,
  rejectProduct,
  getApprovedProducts,

  // 📚 Recursos
  createResource,
  getPendingResources,
  getAllResources,
  approveResource,
  rejectResource,
  getApprovedResources,
} = require("../controllers/productController.js");

const { protect } = require("../auth/authMiddleware.js");
const authorizeRole = require("../auth/authorizeRole.js");

const router = express.Router();

//
// 🛒 PRODUCTOS
//

// 📌 Crear producto (solo Colaborador)
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

// 📌 ✅ Alias en inglés para compatibilidad con el frontend actual
router.patch(
  "/:id/approve",
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

// 📌 ✅ Alias en inglés para compatibilidad
router.delete(
  "/:id/reject",
  protect,
  authorizeRole("administrador"),
  rejectProduct
);

// 📌 Ver productos aprobados (público)
router.get("/", getApprovedProducts);

//
// 📚 RECURSOS
//

// 📌 Crear recurso (solo Colaborador)
router.post("/recursos", protect, authorizeRole("colaborador"), createResource);

// 📌 Ver recursos pendientes (solo Admin)
router.get(
  "/recursos/pendientes",
  protect,
  authorizeRole("administrador"),
  getPendingResources
);

// 📌 Ver TODOS los recursos (pendientes + aprobados) (solo Admin)
router.get(
  "/recursos/all",
  protect,
  authorizeRole("administrador"),
  getAllResources
);

// 📌 Aprobar recurso (solo Admin)
router.patch(
  "/recursos/:id/aprobar",
  protect,
  authorizeRole("administrador"),
  approveResource
);

// 📌 ✅ Alias en inglés para compatibilidad
router.patch(
  "/recursos/:id/approve",
  protect,
  authorizeRole("administrador"),
  approveResource
);

// 📌 Rechazar recurso (solo Admin)
router.delete(
  "/recursos/:id/rechazar",
  protect,
  authorizeRole("administrador"),
  rejectResource
);

// 📌 ✅ Alias en inglés para compatibilidad
router.delete(
  "/recursos/:id/reject",
  protect,
  authorizeRole("administrador"),
  rejectResource
);

// 📌 Ver recursos aprobados (público)
router.get("/recursos", getApprovedResources);

module.exports = router;
