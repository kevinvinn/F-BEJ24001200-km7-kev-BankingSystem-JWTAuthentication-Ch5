const express = require("express");
const session = require("express-session");
const passport = require("./lib/passportOauth");
const { PrismaClient } = require("@prisma/client");
const accountRoutes = require("./routes/accountRoute");
const transactionRoutes = require("./routes/transactionRoute");
const userRoutes = require("./routes/userRoute");
const profileRoutes = require("./routes/profileRoute");
const authRoutes = require("./routes/authRoute");
const oauthRoutes = require("./routes/oauthRoute");
const verifyToken = require("./middleware/verifyToken");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");

const app = express();
const prisma = new PrismaClient();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/dashboard", verifyToken, (req, res) => {
  res.render("dashboard", { userId: req.userId });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/accounts", accountRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/profiles", profileRoutes);
app.use("/auth", oauthRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => console.log(`Server berjalan di port 3000`));
}

module.exports = app;
