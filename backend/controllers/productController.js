const Product = require("../models/Product.js");
const Resource = require("../models/Resource.js").default; // ✅ Corregido: sin .default

// ======================================================
// ==================== PRODUCTOS ========================
// ======================================================

// 📌 Crear un producto (solo Colaborador)
const createProduct = async (req, res) => {
  try {
    const { imagenes, titulo, tags, descripcion, precio } = req.body;

    if (!imagenes || !titulo || !descripcion || !precio) {
      return res
        .status(400)
        .json({ msg: "Todos los campos son obligatorios." });
    }

    const product = new Product({
      imagenes,
      titulo,
      tags,
      descripcion,
      precio,
      creadoPor: req.user.id,
    });

    await product.save();

    res.status(201).json({
      msg: "Producto creado y pendiente de aprobación.",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear el producto." });
  }
};

// 📌 Obtener productos pendientes (solo Admin)
const getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ estado: "pendiente" }).populate(
      "creadoPor",
      "nombre email"
    );
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los productos pendientes." });
  }
};

// 📌 Obtener TODOS los productos (solo Admin)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("creadoPor", "nombre email");
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener todos los productos." });
  }
};

// 📌 Aprobar un producto (solo Admin)
const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ msg: "Producto no encontrado." });

    product.estado = "aprobado";
    await product.save();

    res.json({ msg: "Producto aprobado con éxito.", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al aprobar el producto." });
  }
};

// 📌 Rechazar un producto (solo Admin)
const rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ msg: "Producto no encontrado." });

    await product.deleteOne();
    res.json({ msg: "Producto rechazado y eliminado con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al rechazar el producto." });
  }
};

// 📌 Obtener productos aprobados (público)
const getApprovedProducts = async (req, res) => {
  try {
    const products = await Product.find({ estado: "aprobado" });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los productos aprobados." });
  }
};

// ======================================================
// ==================== RECURSOS ========================
// ======================================================

// 📘 Crear un recurso (solo Colaborador)
const createResource = async (req, res) => {
  try {
    const { imagenes, titulo, tags, descripcion, precio } = req.body;

    if (!imagenes || !titulo || !descripcion || !precio) {
      return res
        .status(400)
        .json({ msg: "Todos los campos son obligatorios." });
    }

    const resource = new Resource({
      imagenes,
      titulo,
      tags,
      descripcion,
      precio,
      creadoPor: req.user.id,
    });

    await resource.save();

    res.status(201).json({
      msg: "Recurso creado y pendiente de aprobación.",
      resource,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear el recurso." });
  }
};

// 📘 Obtener recursos pendientes (solo Admin)
const getPendingResources = async (req, res) => {
  try {
    const resources = await Resource.find({ estado: "pendiente" }).populate(
      "creadoPor",
      "nombre email"
    );
    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los recursos pendientes." });
  }
};

// 📘 Obtener TODOS los recursos (solo Admin)
const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate(
      "creadoPor",
      "nombre email"
    );
    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener todos los recursos." });
  }
};

// 📘 Aprobar un recurso (solo Admin)
const approveResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findById(id);
    if (!resource)
      return res.status(404).json({ msg: "Recurso no encontrado." });

    resource.estado = "aprobado";
    await resource.save();

    res.json({ msg: "Recurso aprobado con éxito.", resource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al aprobar el recurso." });
  }
};

// 📘 Rechazar un recurso (solo Admin)
const rejectResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findById(id);
    if (!resource)
      return res.status(404).json({ msg: "Recurso no encontrado." });

    await resource.deleteOne();
    res.json({ msg: "Recurso rechazado y eliminado con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al rechazar el recurso." });
  }
};

// 📘 Obtener recursos aprobados (público)
const getApprovedResources = async (req, res) => {
  try {
    const resources = await Resource.find({ estado: "aprobado" });
    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los recursos aprobados." });
  }
};

// ======================================================
// ==================== EXPORTACIONES ===================
// ======================================================

module.exports = {
  // Productos
  createProduct,
  getPendingProducts,
  getAllProducts,
  approveProduct,
  rejectProduct,
  getApprovedProducts,

  // Recursos
  createResource,
  getPendingResources,
  getAllResources,
  approveResource,
  rejectResource,
  getApprovedResources,
};
