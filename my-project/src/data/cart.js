import { loadCart, addToCart, removeFromCart, updateProductQuantity, clearCart } from './cart.js';

let cart = []; // Giỏ hàng

// Hàm để lấy giỏ hàng từ localStorage
export const loadCart = () => {
  try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    cart = [];
  }
  return cart;
};

// Hàm để lưu giỏ hàng vào localStorage
export const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Hàm để thêm sản phẩm vào giỏ hàng
export const addToCart = (product) => {
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    if (existingProduct.quantity >= 10) {
      alert('Không thể thêm quá 10 sản phẩm của cùng một loại!');
      return;
    }
    existingProduct.quantity += 1;
    alert('Đã tăng số lượng sản phẩm trong giỏ hàng!');
  } else {
    cart.push({ ...product, quantity: 1 });
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  }
  saveCart(); // Lưu lại giỏ hàng sau khi thêm sản phẩm
  updateCartUI(); // Cập nhật giao diện giỏ hàng
};

// Hàm để xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = (productId) => {
  const product = cart.find(item => item.id === productId);
  if (!product) {
    alert('Sản phẩm không tồn tại trong giỏ hàng!');
    return;
  }
  cart = cart.filter(item => item.id !== productId);
  saveCart(); // Lưu lại giỏ hàng sau khi xóa sản phẩm
  alert('Đã xóa sản phẩm khỏi giỏ hàng!');
  updateCartUI(); // Cập nhật giao diện giỏ hàng
};

// Hàm để cập nhật số lượng sản phẩm trong giỏ hàng
export const updateProductQuantity = (productId, newQuantity) => {
  const product = cart.find(item => item.id === productId);
  if (!product) {
    alert('Sản phẩm không tồn tại trong giỏ hàng!');
    return;
  }
  if (newQuantity < 1) {
    alert('Số lượng không hợp lệ! Vui lòng nhập số lượng lớn hơn 0.');
    return;
  }
  if (newQuantity > 10) {
    alert('Không thể thêm quá 10 sản phẩm của cùng một loại!');
    return;
  }
  product.quantity = newQuantity;
  saveCart(); // Lưu lại giỏ hàng sau khi cập nhật số lượng
  alert('Đã cập nhật số lượng sản phẩm!');
  updateCartUI(); // Cập nhật giao diện giỏ hàng
};

// Hàm để xóa tất cả sản phẩm trong giỏ hàng
export const clearCart = () => {
  cart = [];
  localStorage.removeItem('cart');
  alert('Đã xóa tất cả sản phẩm trong giỏ hàng!');
  updateCartUI(); // Cập nhật giao diện giỏ hàng
};

// Hàm giả lập để cập nhật giao diện giỏ hàng (cần thực hiện trong UI)
export const updateCartUI = () => {
  // Đây chỉ là ví dụ, thực tế bạn cần tích hợp vào HTML hoặc framework (React/Vue).
  console.log('Giỏ hàng hiện tại:', cart);
  // Ví dụ: Render lại danh sách sản phẩm trong giỏ hàng.
};

