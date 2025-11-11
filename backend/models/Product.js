// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    imagenes: {
      type: [String],
      required: true,
      validate: [
        {
          validator: function (arr) {
            return arr.length >= 3 && arr.length <= 5;
          },
          message: "Debes subir entre 3 y 5 imágenes.",
        },
        {
          validator: function (arr) {
            return arr.every((url) => url.includes("imgur.com"));
          },
          message: "Las imágenes deben ser enlaces de Imgur.",
        },
      ],
    },
    titulo: {
      type: String,
      required: [true, "El título es obligatorio."],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.every((tag) => tag.startsWith("#"));
        },
        message: "Todos los tags deben comenzar con #.",
      },
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria."],
      trim: true,
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio."],
      min: [1, "El precio debe ser mayor a 0."],
    },
    estado: {
      type: String,
      enum: ["pendiente", "aprobado", "rechazado"],
      default: "pendiente",
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
