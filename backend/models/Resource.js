import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
    },
    tipo: {
      type: String,
      enum: ["documento", "video", "imagen", "otro"],
      default: "documento",
    },
    enlace: {
      type: String,
      required: [true, "El enlace del recurso es obligatorio"],
    },
    tags: {
      type: [String],
      default: [],
    },
    estado: {
      type: String,
      enum: ["pendiente", "aprobado"],
      default: "pendiente",
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para búsquedas más rápidas por título o etiquetas
ResourceSchema.index({ titulo: "text", tags: 1 });

export default mongoose.model("Resource", ResourceSchema);
