const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

/* ==============================
   MIDDLEWARES
================================ */

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",          // Local frontend
      process.env.CLIENT_URL            // Vercel frontend
    ],
    credentials: true,
  })
);

// Body parser
app.use(express.json());

/* ==============================
   ROUTES
================================ */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));

/* ==============================
   HEALTH CHECK (RENDER)
================================ */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
  });
});

/* ==============================
   GLOBAL ERROR HANDLER
================================ */

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
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
