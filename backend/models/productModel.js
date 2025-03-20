const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  images: [String],
  type: String,
  brand: String,
  colors: [String],
  sizes: [String],
  stock: { type: Number, required: true },
  sold: { type: Number, default: 0 },
});

// Kiểm tra xem model đã tồn tại chưa để tránh lỗi OverwriteModelError
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
