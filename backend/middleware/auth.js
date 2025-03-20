const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Không có token hoặc token không hợp lệ!");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token hợp lệ, thông tin giải mã:", decoded); // Log thông tin giải mã
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Lỗi xác thực token:", error.message); // Log lỗi xác thực
    res.status(401);
    throw new Error("Người dùng không có quyền truy cập!");
  }
});

module.exports = authenticateToken;
