const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createAccount = async (req, res) => {
  const { userId, bankName, bankAccountNumber, balance } = req.body;
  try {
    const newAccount = await prisma.bankAccount.create({
      data: { userId, bankName, bankAccountNumber, balance },
    });
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAccounts = async (req, res) => {
  try {
    const accounts = await prisma.bankAccount.findMany({
      include: { user: true },
    });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAccountById = async (req, res) => {
  const { accountId } = req.params;
  try {
    const account = await prisma.bankAccount.findUnique({
      where: { id: Number(accountId) },
      include: {
        user: true,
        transactionsSource: true,
        transactionsDestination: true,
      },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateAccount = async (req, res) => {
  const { id } = req.params;
  const { bankName, bankAccountNumber, balance } = req.body;
  try {
    const updatedAccount = await prisma.bankAccount.update({
      where: { id: Number(id) },
      data: { bankName, bankAccountNumber, balance },
    });
    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAccount = await prisma.bankAccount.delete({
      where: { id: Number(id) },
    });
    res.json(deletedAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
};
