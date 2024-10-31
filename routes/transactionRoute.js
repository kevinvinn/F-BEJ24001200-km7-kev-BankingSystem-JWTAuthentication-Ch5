const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const depositController = require("../controllers/depositController");
const withdrawController = require("../controllers/withdrawController");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, transactionController.createTransaction);
router.get("/", verifyToken, transactionController.getTransactions);
router.get(
  "/:transactionId",
  verifyToken,
  transactionController.getTransactionById
);
router.put("/:id", verifyToken, transactionController.updateTransaction);
router.delete("/:id", verifyToken, transactionController.deleteTransaction);

router.post("/deposit", verifyToken, depositController.deposit);
router.post("/withdraw", verifyToken, withdrawController.withdraw);

module.exports = router;
