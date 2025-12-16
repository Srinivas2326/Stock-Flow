const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    sku: {
      type: String,
      required: true,
      trim: true
    },

    quantity: {
      type: Number,
      default: 0,
      min: 0
    },

    costPrice: {
      type: Number,
      min: 0
    },

    sellingPrice: {
      type: Number,
      min: 0
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0
    }
  },
  { timestamps: true }
);

// Enforce SKU uniqueness per organization
productSchema.index({ organization: 1, sku: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);
