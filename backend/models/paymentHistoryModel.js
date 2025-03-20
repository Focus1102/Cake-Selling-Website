const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  color: String,
  size: String,
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  recipientName: { type: String, required: true },
  recipientAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
});

// Kiểm tra xem model đã tồn tại chưa để tránh lỗi OverwriteModelError
module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
