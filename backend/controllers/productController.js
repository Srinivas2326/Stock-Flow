const Product = require("../models/Product");

// @desc    Create product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { name, sku, quantity, costPrice, sellingPrice, lowStockThreshold } = req.body;

    if (!name || !sku) {
      return res.status(400).json({ message: "Name and SKU are required" });
    }

    const product = await Product.create({
      name,
      sku,
      quantity,
      costPrice,
      sellingPrice,
      lowStockThreshold,
      organization: req.user.organization._id
    });

    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "SKU already exists" });
    }
    res.status(500).json({ message: "Failed to create product" });
  }
};

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      organization: req.user.organization._id
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        organization: req.user.organization._id
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      organization: req.user.organization._id
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};
