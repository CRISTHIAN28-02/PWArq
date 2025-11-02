import Product from "../models/Product.js";

// 📌 Crear un producto (solo Colaborador)
export const createProduct = async (req, res) => {
  try {
    const { imagenes, titulo, tags, descripcion, precio } = req.body;

    // Validar campos obligatorios
    if (!imagenes || !titulo || !descripcion || !precio) {
      return res
        .status(400)
        .json({ msg: "Todos los campos son obligatorios." });
    }

    // Crear producto en estado "pendiente"
    const product = new Product({
      imagenes,
      titulo,
      tags,
      descripcion,
      precio,
      creadoPor: req.user.id, // viene del middleware de autenticación
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
export const getPendingProducts = async (req, res) => {
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
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("creadoPor", "nombre email");
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener todos los productos." });
  }
};

// 📌 Aprobar un producto (solo Admin)
export const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ msg: "Producto no encontrado." });
    }

    product.estado = "aprobado";
    await product.save();

    res.json({ msg: "Producto aprobado con éxito.", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al aprobar el producto." });
  }
};

// 📌 Rechazar un producto (solo Admin → eliminarlo)
export const rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ msg: "Producto no encontrado." });
    }

    await product.deleteOne();

    res.json({ msg: "Producto rechazado y eliminado con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al rechazar el producto." });
  }
};

// 📌 Obtener productos aprobados (público)
export const getApprovedProducts = async (req, res) => {
  try {
    const products = await Product.find({ estado: "aprobado" });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los productos aprobados." });
  }
};
