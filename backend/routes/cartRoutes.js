const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// Giả lập dữ liệu giỏ hàng (trong thực tế sẽ lưu vào database)
let carts = {};

// Lấy giỏ hàng của user
router.get('/', auth, (req, res) => {
  const userId = req.user.id;
  const cart = carts[userId] || { items: [], total: 0 };
  res.json({ success: true, data: cart });
});

// Thêm sản phẩm vào giỏ hàng
router.post('/add', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!carts[userId]) {
      carts[userId] = { items: [], total: 0 };
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItem = carts[userId].items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      carts[userId].items.push({ productId, quantity });
    }

    // Tính lại tổng tiền (giả sử mỗi sản phẩm có giá 100)
    carts[userId].total = carts[userId].items.reduce((total, item) => total + (item.quantity * 100), 0);

    res.json({ 
      success: true, 
      message: 'Thêm vào giỏ hàng thành công',
      data: carts[userId]
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi thêm vào giỏ hàng' });
  }
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/update', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!carts[userId]) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giỏ hàng' });
    }

    const item = carts[userId].items.find(item => item.productId === productId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    }

    if (quantity <= 0) {
      // Xóa sản phẩm khỏi giỏ hàng
      carts[userId].items = carts[userId].items.filter(item => item.productId !== productId);
    } else {
      item.quantity = quantity;
    }

    // Tính lại tổng tiền
    carts[userId].total = carts[userId].items.reduce((total, item) => total + (item.quantity * 100), 0);

    res.json({ 
      success: true, 
      message: 'Cập nhật giỏ hàng thành công',
      data: carts[userId]
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật giỏ hàng' });
  }
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/remove/:productId', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!carts[userId]) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giỏ hàng' });
    }

    carts[userId].items = carts[userId].items.filter(item => item.productId !== productId);
    
    // Tính lại tổng tiền
    carts[userId].total = carts[userId].items.reduce((total, item) => total + (item.quantity * 100), 0);

    res.json({ 
      success: true, 
      message: 'Xóa sản phẩm thành công',
      data: carts[userId]
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng' });
  }
});

// Xóa toàn bộ giỏ hàng
router.delete('/clear', auth, (req, res) => {
  try {
    const userId = req.user.id;
    carts[userId] = { items: [], total: 0 };

    res.json({ 
      success: true, 
      message: 'Đã xóa giỏ hàng',
      data: carts[userId]
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi xóa giỏ hàng' });
  }
});

module.exports = router; 