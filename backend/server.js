require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const emailRoutes = require("./routes/emailRoutes");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

// Cấu hình Mongoose
mongoose.set("strictQuery", true);

// Kết nối MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Sử dụng express.json thay vì body-parser

// Các tuyến đường
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/emails", emailRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Xử lý lỗi cho các tuyến đường không tồn tại
app.use((req, res, next) => {
  res.status(404);
  throw new Error("Tuyến đường không tồn tại!");
});

// Sử dụng errorHandler
app.use(errorHandler);

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
