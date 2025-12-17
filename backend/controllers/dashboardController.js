const Product = require("../models/Product");
const Settings = require("../models/Settings");


exports.getDashboard = async (req, res) => {
  try {
    // 1. Fetch all products for the organization
    const products = await Product.find({
      organization: req.user.organization._id
    });

    // 2. Fetch global settings (default low-stock threshold)
    const settings = await Settings.findOne({
      organization: req.user.organization._id
    });

    const defaultLowStockThreshold =
      settings?.defaultLowStockThreshold ?? 5;

    // 3. Calculate dashboard metrics
    const totalProducts = products.length;

    const totalQuantity = products.reduce(
      (sum, product) => sum + product.quantity,
      0
    );

    // 4. Determine low-stock products
    const lowStock = products.filter(product => {
      const threshold =
        product.lowStockThreshold ?? defaultLowStockThreshold;
      return product.quantity <= threshold;
    });

    // 5. Send response
    res.json({
      totalProducts,
      totalQuantity,
      lowStock
    });
  } catch (error) {
    console.error("Dashboard Error:", error.message);

    res.status(500).json({
      message: "Failed to load dashboard data"
    });
  }
};
