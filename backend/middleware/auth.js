const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const authenticateToken = asyncHandler(async (req, res, next) => {
  // Kiểm tra token từ nhiều vị trí khác nhau
  let token;
  
  // Kiểm tra trong header Authorization
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  
  // Kiểm tra trong body
  if (!token && req.body && req.body.token) {
    token = req.body.token;
  }
  
  // Kiểm tra trong query params
  if (!token && req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    console.error("Không tìm thấy token trong request:", {
      headers: req.headers,
      url: req.url,
      method: req.method
    });
    res.status(401);
    throw new Error("Không có token hoặc token không hợp lệ!");
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token hợp lệ, thông tin giải mã:", decoded);
    
    // Thiết lập req.user từ decoded
    req.user = {
      id: decoded.id || decoded._id,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    console.error("Lỗi xác thực token:", {
      message: error.message,
      token: token.substring(0, 10) + "..." // Chỉ hiển thị 10 ký tự đầu để bảo mật
    });
    res.status(401);
    throw new Error("Token không hợp lệ hoặc đã hết hạn!");
  }
});

module.exports = authenticateToken;
