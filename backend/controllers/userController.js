const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Đăng ký người dùng
exports.registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password, phone } = req.body;

  if (!fullname || !email || !password) {
    res.status(400);
    throw new Error("Vui lòng nhập đầy đủ họ tên, email và mật khẩu!");
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400);
    throw new Error("Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 số và dài ít nhất 6 ký tự!");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("Địa chỉ email đã tồn tại!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    fullname,
    email,
    password: hashedPassword,
    phone,
  });

  res.status(201).json({
    message: "Đăng ký thành công!",
    user: {
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      phone: newUser.phone,
    },
  });
});

// Đăng nhập người dùng
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("Yêu cầu đăng nhập với email:", email); // Log email đăng nhập

  if (!email || !password) {
    res.status(400);
    throw new Error("Vui lòng nhập đầy đủ email và mật khẩu!");
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.warn("Không tìm thấy người dùng với email:", email); // Log cảnh báo
    res.status(401);
    throw new Error("Email hoặc mật khẩu không đúng!");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  console.log("Kết quả so sánh mật khẩu:", isPasswordMatch); // Log kết quả so sánh mật khẩu

  if (!isPasswordMatch) {
    console.warn("Mật khẩu không đúng cho email:", email); // Log cảnh báo
    res.status(401);
    throw new Error("Email hoặc mật khẩu không đúng!");
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  console.log("Token được tạo thành công:", token); // Log token

  res.status(200).json({
    message: "Đăng nhập thành công!",
    token,
    user: {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
    },
  });
});

// Lấy thông tin người dùng hiện tại
exports.getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  console.log("Lấy thông tin người dùng với ID:", userId);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("ID người dùng không hợp lệ!");
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    console.warn("Người dùng không tồn tại với ID:", userId); // Log cảnh báo
    res.status(404).json({
      success: false,
      message: "Người dùng không tồn tại",
    });
    return;
  }

  res.status(200).json({
    message: "Lấy thông tin người dùng hiện tại thành công!",
    user,
  });
});
