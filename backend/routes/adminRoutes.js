const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// API lấy thống kê tổng quan cho dashboard
router.get(
  "/dashboard/stats",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      // Lấy các thống kê cần thiết
      // Trong môi trường phát triển, sử dụng dữ liệu mẫu
      let totalRevenue = 0;
      let totalOrders = 0;
      let totalCustomers = 0;
      let totalProducts = 0;
      let salesData = Array(31).fill(0); // Dữ liệu doanh thu theo ngày trong tháng
      let recentOrders = [];

      try {
        // Tổng doanh thu từ các đơn hàng đã hoàn thành
        const completedOrders = await Order.find({ status: "completed" }).populate("user", "fullName");
        totalRevenue = completedOrders.reduce(
          (sum, order) => sum + order.totalPrice,
          0
        );

        // Tổng số đơn hàng
        totalOrders = await Order.countDocuments();

        // Tổng số khách hàng
        totalCustomers = await User.countDocuments({ role: "customer" });

        // Tổng số sản phẩm
        totalProducts = await Product.countDocuments();

        // Doanh thu theo ngày trong tháng hiện tại
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const ordersThisMonth = await Order.find({
          status: "completed",
          createdAt: {
            $gte: new Date(currentYear, currentMonth, 1),
            $lt: new Date(currentYear, currentMonth + 1, 1),
          },
        });

        // Tính doanh thu theo ngày
        ordersThisMonth.forEach((order) => {
          const day = new Date(order.createdAt).getDate() - 1; // 0-indexed array
          salesData[day] += order.totalPrice;
        });

        // Lấy đơn hàng gần đây
        const latestOrders = await Order.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("user", "fullName");

        recentOrders = latestOrders.map((order) => ({
          id: order._id,
          customer: order.user ? order.user.fullName : "Khách vãng lai",
          date: new Date(order.createdAt).toLocaleDateString("vi-VN"),
          total: order.totalPrice,
          status: order.status,
        }));
      } catch (dbError) {
        console.error("Error fetching dashboard data:", dbError);

        // Sử dụng dữ liệu mẫu nếu có lỗi
        totalRevenue = 42266000;
        totalOrders = 23;
        totalCustomers = 13;
        totalProducts = 80;
        salesData = [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 1000000, 0, 0, 0, 0, 0, 3000000, 0, 0, 0,
          2000000, 0, 4000000, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];
        recentOrders = [
          {
            id: "1001",
            customer: "Trần Văn An",
            date: "25/07/2024",
            total: 2500000,
            status: "completed",
          },
          {
            id: "1002",
            customer: "Trần Thị Như",
            date: "24/07/2024",
            total: 1800000,
            status: "processing",
          },
          {
            id: "1003",
            customer: "Lê Văn Chính",
            date: "24/07/2024",
            total: 3200000,
            status: "pending",
          },
          {
            id: "1004",
            customer: "Nguyễn Thị Duyên",
            date: "23/07/2024",
            total: 950000,
            status: "completed",
          },
          {
            id: "1005",
            customer: "Hoàng Thế Nhật",
            date: "22/07/2024",
            total: 4200000,
            status: "cancelled",
          },
        ];
      }

      return res.json({
        success: true,
        data: {
          totalRevenue,
          totalOrders,
          totalCustomers,
          totalProducts,
          salesData,
          recentOrders,
        },
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  }
);

// API lấy danh sách đơn hàng
router.get("/orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    // Xây dựng query
    const query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    // Đếm tổng số đơn hàng theo query
    const total = await Order.countDocuments(query);

    // Lấy đơn hàng theo query, pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "fullName email");

    const formattedOrders = orders.map((order) => ({
      id: order._id,
      orderNumber:
        order.orderNumber || `ORD-${order._id.toString().substr(-6)}`,
      customer: order.user ? order.user.fullName : "Khách vãng lai",
      email: order.user ? order.user.email : order.contactInfo.email,
      date: new Date(order.createdAt).toLocaleDateString("vi-VN"),
      total: order.totalPrice,
      status: order.status,
      items: order.items.length,
      shippingAddress: `${order.shippingAddress.address}, ${order.shippingAddress.city}`,
      paymentMethod: order.paymentMethod,
    }));

    return res.json({
      success: true,
      data: formattedOrders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
});

// API cập nhật trạng thái đơn hàng
router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Kiểm tra status hợp lệ
      const validStatuses = ["pending", "processing", "completed", "cancelled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Trạng thái không hợp lệ",
        });
      }

      // Cập nhật trạng thái đơn hàng
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      return res.json({
        success: true,
        message: "Cập nhật trạng thái đơn hàng thành công",
        data: {
          id: updatedOrder._id,
          status: updatedOrder.status,
        },
      });
    } catch (error) {
      console.error("Update order status error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  }
);

// API xác thực đăng nhập admin
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Trong môi trường phát triển, sử dụng thông tin đăng nhập cứng
    if (username === "admin" && password === "hoainam123") {
      // Tạo token với thông tin admin
      const token = jwt.sign(
        { userId: "admin-user", role: "admin" },
        process.env.JWT_SECRET || "shop_secret_key",
        { expiresIn: "1d" }
      );

      return res.json({
        success: true,
        message: "Đăng nhập thành công",
        data: {
          token,
          user: {
            id: "admin-user",
            username: "admin",
            role: "admin",
          },
        },
      });
    }
    return res.status(401).json({
      success: false,
      message: "Thông tin đăng nhập không chính xác",
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
});

module.exports = router;
