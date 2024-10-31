const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, accountController.createAccount);
router.get("/", verifyToken, accountController.getAccounts);
router.get("/:accountId", verifyToken, accountController.getAccountById);
router.put("/:id", verifyToken, accountController.updateAccount);
router.delete("/:id", verifyToken, accountController.deleteAccount);

module.exports = router;
