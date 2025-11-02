function validateToken(header) {
  if (!header || !header["authorization"]) {
    console.error("No se encontró el header de autorización:", header);
    throw new Error("Token not provided");
  }

  const [bearer, token] = header["authorization"].split(" ");

  if (bearer !== "Bearer" || !token) {
    console.error("Formato de autorización inválido:", header["authorization"]);
    throw new Error("Token format invalid");
  }

  return token;
}

module.exports = validateToken;
