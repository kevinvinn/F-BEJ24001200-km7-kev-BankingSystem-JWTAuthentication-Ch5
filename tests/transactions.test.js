const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

describe("uji API Transaksi", () => {
  it("harusnya buat transaksi transfer baru", async () => {
    const res = await request(app).post("/api/v1/transactions").send({
      sourceAccountId: 1,
      destinationAccountId: 2,
      amount: 500000,
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.amount).toBe(500000);
  });

  it("harusnya gagal karena tanpa sourceAccountId", async () => {
    const res = await request(app).post("/api/v1/transactions").send({
      destinationAccountId: 2,
      amount: 500000,
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("harusnya gagal karena tanpa destinationAccountId", async () => {
    const res = await request(app).post("/api/v1/transactions").send({
      sourceAccountId: 1,
      amount: 500000,
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("harusnya gagal karena akun sumber tidak ada", async () => {
    const res = await request(app).post("/api/v1/transactions").send({
      sourceAccountId: 999,
      destinationAccountId: 2,
      amount: 500000,
    });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error");
  });

  it("harusnya gagal karena akun tujuan tidak ada", async () => {
    const res = await request(app).post("/api/v1/transactions").send({
      sourceAccountId: 1,
      destinationAccountId: 999,
      amount: 500000,
    });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error");
  });
});
