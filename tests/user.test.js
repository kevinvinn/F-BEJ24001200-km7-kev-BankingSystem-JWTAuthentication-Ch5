const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

describe("uji API Pengguna", () => {
  it("ini harusnya buat user baru", async () => {
    const res = await request(app).post("/api/v1/users").send({
      name: "tes user",
      email: "tes@gmail.com",
      password: "tes123",
      identityType: "KTP",
      identityNumber: "123456789",
      address: "Jl. Contoh No. 1",
    });

    console.log("Response:", res.body);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("tes user");
  });

  it("harusnya gagal karena tanpa email", async () => {
    const res = await request(app).post("/api/v1/users").send({
      name: "tes user",
      password: "tes123",
      identityType: "KTP",
      identityNumber: "123456789",
      address: "Jl. Contoh No. 1",
    });

    console.log("Response:", res.body);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("harusnya muncul semua user", async () => {
    const res = await request(app).get("/api/v1/users");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("harusnya gagal karena user tidak ada", async () => {
    const res = await request(app).get("/api/v1/users/999");

    console.log("Response:", res.body);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error");
  });

  it("harusnya update user", async () => {
    const res = await request(app).put("/api/v1/users/1").send({
      name: "tes baru",
      email: "tesbaru@gmail.com",
      password: "passwordbaru123",
    });

    console.log("Response:", res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe("tes baru");
  });

  it("harusnya gagal update user karena id tidak ada", async () => {
    const res = await request(app).put("/api/v1/users/999").send({
      name: "tes baru",
    });

    console.log("Response:", res.body);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error");
  });
});
