const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/authenticate", verifyToken, authController.authenticate);
router.get("/dashboard", verifyToken, (req, res) => {
  res.render("dashboard", { user: req.user });
});

module.exports = router;
