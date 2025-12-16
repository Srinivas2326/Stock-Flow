const Product = require("../models/Product");

// @desc    Get dashboard summary
// @route   GET /api/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const products = await Product.find({
      organization: req.user.organization._id
    });

    const totalProducts = products.length;

    const totalQuantity = products.reduce(
      (sum, product) => sum + product.quantity,
      0
    );

    const lowStock = products.filter(
      product => product.quantity <= product.lowStockThreshold
    );

    res.json({
      totalProducts,
      totalQuantity,
      lowStock
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};
