function getUserInfo(user) {
  return {
    id: user._id ? user._id.toString() : user.id, // 👈 siempre string
    username: user.username,
    name: user.name,
    role: user.role || "user", // ✅ rol siempre presente
  };
}

module.exports = getUserInfo;
