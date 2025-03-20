// Middleware xử lý lỗi trung tâm
const errorHandler = (err, req, res, next) => {
  // Nếu status code là 200 (mặc định) thì đặt lại là 500
  const statusCode = err.status || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Lỗi server',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

module.exports = errorHandler;
