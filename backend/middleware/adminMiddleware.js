/**
 * Middleware kiểm tra quyền admin
 * Cần phải được sử dụng sau authMiddleware
 */
module.exports = (req, res, next) => {
  try {
    // req.user được thiết lập từ authMiddleware
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Không được phép truy cập' 
      });
    }

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Bạn không có quyền truy cập vùng quản trị' 
      });
    }

    // Nếu là admin, cho phép tiếp tục
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi xác thực quyền quản trị' 
    });
  }
}; 