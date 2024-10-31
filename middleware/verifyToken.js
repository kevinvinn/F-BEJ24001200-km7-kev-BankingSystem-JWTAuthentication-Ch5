const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"] || "";

  const jwtToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

  if (!jwtToken) {
    return res.status(403).json({ message: "Masukkan token dulu ya😁" });
  }

  jwt.verify(jwtToken, "your_jwt_secret_key", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    req.user = {
      id: decoded.userId,
      name: decoded.name,
    };

    next();
  });
};

module.exports = verifyToken;
