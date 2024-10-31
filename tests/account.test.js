const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
afterAll(async () => {
  await prisma.$disconnect();
});

describe("uji API Akun", () => {
  it("harusnya buat akun baru", async () => {
    const res = await request(app).post("/api/v1/accounts").send({
      userId: 16,
      bankName: "Bank TESTING",
      bankAccountNumber: "987654321",
      balance: 1500000,
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.balance).toBe(1500000);
  });

  it("harusnya gagal karena tanpa userId", async () => {
    const res = await request(app).post("/api/v1/accounts").send({
      bankName: "Bank ABC",
      bankAccountNumber: "123456789",
      balance: 1000000,
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "userId harus diisi");
  });

  it("harusnya muncul semua akun", async () => {
    const res = await request(app).get("/api/v1/accounts");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("harusnya gagal karena akun tidak ada", async () => {
    const res = await request(app).get("/api/v1/accounts/999");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error", "Account not found");
  });

  it("harusnya gagal update akun karena id tidak ada", async () => {
    const res = await request(app).put("/api/v1/accounts/999").send({
      bankName: "Bank XYZ",
      bankAccountNumber: "987654321",
      balance: 2000000,
    });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error", "Account not found");
  });
});
