const express = require("express");
const router = express.Router(); // Khởi tạo router
const userController = require("../controllers/userController");
const cartController = require("../controllers/cartController");
const paymentHistoryController = require("../controllers/paymentHistoryController");
const authenticateToken = require("../middleware/auth");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/me", authenticateToken, userController.getCurrentUser);

router.get("/cart", authenticateToken, cartController.getCart);
router.put("/cart", authenticateToken, cartController.updateCart);
router.delete(
  "/cart/:variantId",
  authenticateToken,
  cartController.removeFromCart
);
router.delete("/cart", authenticateToken, cartController.clearCart);

router.get(
  "/payment-history",
  authenticateToken,
  paymentHistoryController.getPaymentHistory
);
router.post("/orders", authenticateToken, paymentHistoryController.addOrder);

module.exports = router;
