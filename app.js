const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.post("/api/v1/deposit", async (req, res) => {
  const { accountId, amount } = req.body;

  try {
    const updatedAccount = await prisma.bankAccount.update({
      where: { id: Number(accountId) },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    res.status(200).json(updatedAccount);
  } catch (error) {
    console.error("Error during deposit:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/v1/withdraw", async (req, res) => {
  const { accountId, amount } = req.body;

  try {
    const account = await prisma.bankAccount.findUnique({
      where: { id: Number(accountId) },
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (account.balance < amount) {
      return res.status(400).json({ error: "Saldo anda tidak mencukupi" });
    }

    const updatedAccount = await prisma.bankAccount.update({
      where: { id: Number(accountId) },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    res.status(200).json(updatedAccount);
  } catch (error) {
    console.error("Error during withdrawal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/v1/users", async (req, res) => {
  const { name, email, password, identityType, identityNumber, address } =
    req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        profile: {
          create: { identityType, identityNumber, address },
        },
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/v1/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/v1/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/v1/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, password },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/v1/users/:userId", async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, identityType, identityNumber, address } =
    req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        name,
        email,
        password,
        profile: {
          upsert: {
            update: {
              identityType,
              identityNumber,
              address,
            },
            create: {
              identityType,
              identityNumber,
              address,
            },
          },
        },
      },
      include: { profile: true },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/v1/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.profile.delete({
      where: {
        userId: Number(id),
      },
    });

    const deletedUser = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json(deletedUser);
  } catch (error) {
    console.error("Error deleting user or profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/v1/accounts", async (req, res) => {
  const { userId, bankName, bankAccountNumber, balance } = req.body;
  try {
    const newAccount = await prisma.bankAccount.create({
      data: { userId, bankName, bankAccountNumber, balance },
    });
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/v1/accounts", async (req, res) => {
  const accounts = await prisma.bankAccount.findMany({
    include: { user: true },
  });
  res.json(accounts);
});

app.get("/api/v1/accounts/:accountId", async (req, res) => {
  const { accountId } = req.params;

  try {
    const account = await prisma.bankAccount.findUnique({
      where: {
        id: Number(accountId),
      },
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
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/v1/accounts/:id", async (req, res) => {
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
});

app.delete("/api/v1/accounts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAccount = await prisma.bankAccount.delete({
      where: { id: Number(id) },
    });
    res.json(deletedAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/v1/transactions", async (req, res) => {
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
});

app.get("/api/v1/transactions", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        sourceAccount: true,
        destinationAccount: true,
      },
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/v1/transactions/:transactionId", async (req, res) => {
  const { transactionId } = req.params;

  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: Number(transactionId),
      },
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
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/v1/transactions/:id", async (req, res) => {
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
});

app.delete("/api/v1/transactions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTransaction = await prisma.transaction.delete({
      where: { id: Number(id) },
    });
    res.json(deletedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log(`Server berjalan di port 3000`));
