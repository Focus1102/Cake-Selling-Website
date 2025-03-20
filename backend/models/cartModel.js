const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantId: { type: String, required: true },
  name: { type: String, required: true },
  size: String,
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  image: String,
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now },
});

// Kiểm tra xem model đã tồn tại chưa để tránh lỗi OverwriteModelError
module.exports = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
