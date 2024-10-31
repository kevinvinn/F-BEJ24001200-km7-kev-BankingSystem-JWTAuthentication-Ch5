const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.updateUserWithProfile = async (req, res) => {
  const { userId } = req.params;
  const { identityType, identityNumber, address } = req.body;
  try {
    const updatedProfile = await prisma.profile.upsert({
      where: { userId: Number(userId) },
      update: { identityType, identityNumber, address },
      create: { identityType, identityNumber, address, userId: Number(userId) },
    });
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedProfile = await prisma.profile.delete({
      where: { userId: Number(userId) },
    });
    res.status(200).json(deletedProfile);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getProfileByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: Number(userId) },
    });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
