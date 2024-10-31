const express = require("express");
const passport = require("../lib/passportOauth");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.send("yeyy oauth nya berhasil");
  }
);

module.exports = router;
