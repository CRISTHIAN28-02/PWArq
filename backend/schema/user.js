const Mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../auth/sign");
const Token = require("./token"); // corregí la ruta a ./token para mantener consistencia

const UserSchema = new Mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["administrador", "colaborador"], // roles permitidos
      default: "colaborador", // por defecto será colaborador
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
  }
);

// Middleware para encriptar password antes de guardar
UserSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    const document = this;

    bcrypt.hash(document.password, 10, (err, hash) => {
      if (err) {
        next(err);
      } else {
        document.password = hash;
        next();
      }
    });
  } else {
    next();
  }
});

// Métodos personalizados
UserSchema.methods.usernameExists = async function (username) {
  const result = await Mongoose.model("User").find({ username: username });
  return result.length > 0;
};

UserSchema.methods.isCorrectPassword = async function (password, hash) {
  const same = await bcrypt.compare(password, hash);
  return same;
};

// Generar accessToken con id, username, name y role
UserSchema.methods.createAccessToken = function () {
  return generateAccessToken({
    id: this._id,
    username: this.username,
    name: this.name,
    role: this.role,
  });
};

// Generar refreshToken con los mismos datos
UserSchema.methods.createRefreshToken = async function () {
  const refreshToken = generateRefreshToken({
    id: this._id,
    username: this.username,
    name: this.name,
    role: this.role,
  });

  try {
    await new Token({ token: refreshToken }).save();
    console.log("Token saved", refreshToken);
    return refreshToken;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating refresh token");
  }
};

module.exports = Mongoose.model("User", UserSchema);
