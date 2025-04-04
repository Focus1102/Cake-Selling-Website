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

// Cấu hình CORS chi tiết hơn
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000'],
  credentials: true,
  exposedHeaders: ['Authorization']
}));

// Middleware để log thông tin request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Middleware
app.use(express.json()); // Sử dụng express.json thay vì body-parser

// Các tuyến đường
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/emails", emailRoutes);
app.use("/api/admin", adminRoutes);

// Xử lý lỗi cho các tuyến đường không tồn tại
app.use((req, res, next) => {
  res.status(404);
  throw new Error("Tuyến đường không tồn tại!");
});

// Sử dụng errorHandler
app.use(errorHandler);

// Bổ sung log để kiểm tra kết nối MongoDB
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});


// Các tuyến đường khác
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);