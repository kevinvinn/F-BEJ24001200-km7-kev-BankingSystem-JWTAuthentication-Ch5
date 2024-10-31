const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.deposit = async (req, res) => {
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
};
