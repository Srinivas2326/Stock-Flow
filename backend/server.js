const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

/* ==============================
   MIDDLEWARES
================================ */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL, // https://stock-flow-sand.vercel.app
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* ==============================
   DATABASE
================================ */
connectDB();

/* ==============================
   ROUTES
================================ */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));

/* ==============================
   HEALTH CHECK
================================ */

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* ==============================
   GLOBAL ERROR HANDLER
================================ */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

/* ==============================
   START SERVER
================================ */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
