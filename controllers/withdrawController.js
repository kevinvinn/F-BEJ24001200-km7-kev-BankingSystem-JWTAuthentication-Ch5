const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.withdraw = async (req, res) => {
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
};
