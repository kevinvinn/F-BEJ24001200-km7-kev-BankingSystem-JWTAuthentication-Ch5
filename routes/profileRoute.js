const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const verifyToken = require("../middleware/verifyToken");

router.put("/:userId", verifyToken, profileController.updateUserWithProfile);
router.delete("/:userId", verifyToken, profileController.deleteProfile);
router.get("/:userId", verifyToken, profileController.getProfileByUserId);

module.exports = router;
