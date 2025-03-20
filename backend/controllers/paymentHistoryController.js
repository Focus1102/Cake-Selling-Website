const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose"); // Thêm mongoose để kiểm tra ObjectId
const Order = require("../models/paymentHistoryModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

exports.getPaymentHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const history = await Order.find({ userId }).populate("items.productId");
  res.status(200).json(history);
});

exports.addOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    date,
    recipientName,
    recipientAddress,
    phoneNumber,
    items,
    totalAmount,
    paymentMethod,
  } = req.body;

  // Kiểm tra các trường bắt buộc
  if (
    !recipientName ||
    !recipientAddress ||
    !phoneNumber ||
    !totalAmount ||
    !paymentMethod
  ) {
    res.status(400);
    throw new Error(
      "Vui lòng cung cấp đầy đủ thông tin: tên người nhận, địa chỉ, số điện thoại, tổng tiền, và phương thức thanh toán."
    );
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("Danh sách sản phẩm không được để trống.");
  }

  // Kiểm tra productId trong items
  for (const item of items) {
    if (!mongoose.Types.ObjectId.isValid(item.productId)) {
      res.status(400);
      throw new Error(`productId không hợp lệ: ${item.productId}`);
    }
    if (!item.name || !item.quantity || !item.price) {
      res.status(400);
      throw new Error("Mỗi sản phẩm phải có tên, số lượng và giá.");
    }
  }

  const orderData = {
    userId,
    date: date || new Date(),
    recipientName,
    recipientAddress,
    phoneNumber,
    items,
    totalAmount,
    paymentMethod,
  };

  try {
    // Tạo đơn hàng mới
    const order = await Order.create(orderData);
    
    // Cập nhật số lượng sản phẩm đã bán (sold)
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { sold: item.quantity } }
      );
    }
    
    // Lưu ý: Không xóa toàn bộ giỏ hàng ở đây
    // Việc xóa các sản phẩm đã mua khỏi giỏ hàng sẽ được xử lý ở phía frontend
    
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500);
    throw new Error("Lỗi khi tạo đơn hàng: " + error.message);
  }
});
