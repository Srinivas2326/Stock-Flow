const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

// Protected product routes
router.post("/", protect, createProduct);
router.get("/", protect, getProducts);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
