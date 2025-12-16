const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

const app = express();

/* ==============================
   DATABASE
================================ */
connectDB();

/* ==============================
   MIDDLEWARES
================================ */

// CORS (FIXED for Vercel + Render)
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        process.env.CLIENT_URL, // https://stock-flow-sand.vercel.app
      ];

      // allow requests with no origin (Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// IMPORTANT: handle preflight requests
app.options("*", cors());

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
   HEALTH CHECK
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
  res.status(500).json({
    success: false,
    message: err.message || "Server error",
  });
});

/* ==============================
   START SERVER
================================ */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
