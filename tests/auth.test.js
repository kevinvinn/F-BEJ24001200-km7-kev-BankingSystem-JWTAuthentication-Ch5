const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

describe("uji API Akun dengan Autentikasi JWT", () => {
  let token;

  beforeAll(async () => {
    token = jwt.sign({ userId: 16 }, "secretKey", { expiresIn: "1h" });
  });

  it("harusnya buat akun baru dengan token yang valid", async () => {
    const res = await request(app)
      .post("/api/v1/accounts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: 16,
        bankName: "Bank TESTING",
        bankAccountNumber: "987654321",
        balance: 1500000,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.balance).toBe(1500000);
  });

  it("harusnya gagal karena tanpa token", async () => {
    const res = await request(app).post("/api/v1/accounts").send({
      userId: 16,
      bankName: "Bank ABC",
      bankAccountNumber: "123456789",
      balance: 1000000,
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Unauthorized");
  });

  it("harusnya muncul semua akun dengan token yang valid", async () => {
    const res = await request(app)
      .get("/api/v1/accounts")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("harusnya gagal karena akun tidak ada", async () => {
    const res = await request(app)
      .get("/api/v1/accounts/999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error", "Account not found");
  });

  it("harusnya gagal update akun karena id tidak ada", async () => {
    const res = await request(app)
      .put("/api/v1/accounts/999")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bankName: "Bank XYZ",
        bankAccountNumber: "987654321",
        balance: 2000000,
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error", "Account not found");
  });
});
