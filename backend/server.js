const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

/* ==============================
   CORS (FIXED)
================================ */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://stock-flow-sand.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// IMPORTANT: preflight
app.options("*", cors());

app.use(express.json());

// DB connection
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
  res.json({ status: "OK" });
});

/* ==============================
   START SERVER
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
