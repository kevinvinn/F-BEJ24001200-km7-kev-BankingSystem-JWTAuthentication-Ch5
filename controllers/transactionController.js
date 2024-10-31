const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createTransaction = async (req, res) => {
  const { sourceAccountId, destinationAccountId, amount } = req.body;
  try {
    const transaction = await prisma.transaction.create({
      data: { sourceAccountId, destinationAccountId, amount },
    });
    await prisma.bankAccount.update({
      where: { id: sourceAccountId },
      data: { balance: { decrement: amount } },
    });
    await prisma.bankAccount.update({
      where: { id: destinationAccountId },
      data: { balance: { increment: amount } },
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        sourceAccount: true,
        destinationAccount: true,
      },
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getTransactionById = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(transactionId) },
      include: {
        sourceAccount: true,
        destinationAccount: true,
      },
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { sourceAccountId, destinationAccountId, amount } = req.body;
  try {
    const updatedTransaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data: { sourceAccountId, destinationAccountId, amount },
    });
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTransaction = await prisma.transaction.delete({
      where: { id: Number(id) },
    });
    res.json(deletedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
