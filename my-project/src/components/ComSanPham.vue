<template>
  <div class="product-list">
    <h2>BÁNH KEM THƠM NGON MỜI BẠN DÙNG NGAY!</h2>
    <div class="product-grid">
      <div
        class="product-item"
        v-for="product in paginatedProducts"
        :key="product.id"
        @click="viewProduct(product.id)"
      >
        <img :src="product.image" alt="Bánh Kem Thơm Ngon" class="product-image" />
        <div class="product-info">
          <p class="product-description">{{ product.description }}</p>
          <p class="product-price">{{ product.price }}</p>
          <!-- Nút "Thêm vào giỏ hàng" -->
          <button @click.stop="addToCart(product)" class="add-to-cart-button">Thêm vào giỏ hàng</button>
        </div>
      </div>
    </div>
    <div class="pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="changePage(page)"
        class="pagination-button"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComSanPham",
  data() {
    return {
      products: [
        { id: 1, description: "Bánh kem dâu tươi - Tươi ngon - Kích thước 20cm - Phù hợp cho 4-6 người", price: "300.000", image: require("@/assets/food_menu/logo2.png") },
        { id: 2, description: "Bánh kem socola - Hương vị đậm đà - Kích thước 25cm - Phù hợp cho 6-8 người", price: "450.000", image: require("@/assets/food_menu/logo1.png") },
        { id: 3, description: "Bánh kem trà xanh - Hương vị tinh tế - Kích thước 18cm - Phù hợp cho 3-5 người", price: "350.000", image: require("@/assets/food_menu/logo3.png") },
        { id: 4, description: "Bánh kem vani - Cổ điển và thanh nhã - Kích thước 20cm - Phù hợp cho 4-6 người", price: "320.000", image: require("@/assets/food_menu/logo4.png") },
        { id: 5, description: "Bánh kem dâu việt quất - Tươi mát - Kích thước 15cm - Phù hợp cho 2-4 người", price: "250.000", image: require("@/assets/food_menu/logo5.png") },
        { id: 6, description: "Bánh kem tiramisu - Đậm hương cà phê Ý - Kích thước 22cm - Phù hợp cho 5-7 người", price: "400.000", image: require("@/assets/food_menu/logo7.png") },
        { id: 7, description: "Bánh kem chanh dây - Chua ngọt thanh nhẹ - Kích thước 18cm - Phù hợp cho 3-5 người", price: "280.000", image: require("@/assets/food_menu/logo6.png") },
        { id: 8, description: "Bánh kem phô mai - Đậm vị béo ngậy - Kích thước 24cm - Phù hợp cho 6-8 người", price: "500.000", image: require("@/assets/food_menu/logo10.png") },
        { id: 9, description: "Bánh kem đôi - Kết hợp vị dâu và socola - Kích thước mỗi bánh 20cm - Phù hợp cho 8-10 người", price: "700.000", image: require("@/assets/food_menu/logo9.png") },
        { id: 10, description: "Bánh kem caramel - Hương vị ngọt ngào - Kích thước 20cm - Phù hợp cho 4-6 người", price: "300.000", image: require("@/assets/food_menu/logo8.png") },
        { id: 11, description: "Bánh kem sữa chua - Mềm mịn và thơm ngon - Kích thước 18cm - Phù hợp cho 3-5 người", price: "280.000", image: require("@/assets/food_menu/logo11.png") },
        { id: 12, description: "Bánh kem trái cây nhiệt đới - Tươi mát và ngọt ngào - Kích thước 22cm - Phù hợp cho 5-7 người", price: "420.000", image: require("@/assets/food_menu/logo12.png") },
        { id: 13, description: "Bánh kem mousse chanh - Lớp mousse mịn màng - Kích thước 20cm - Phù hợp cho 4-6 người", price: "350.000", image: require("@/assets/food_menu/logo13.png") },
        { id: 14, description: "Bánh kem sầu riêng - Đậm hương vị đặc trưng - Kích thước 18cm - Phù hợp cho 3-5 người", price: "390.000", image: require("@/assets/food_menu/logo14.png") },
        { id: 15, description: "Bánh kem hạnh nhân - Thơm giòn - Kích thước 22cm - Phù hợp cho 5-7 người", price: "420.000", image: require("@/assets/food_menu/logo15.png") },
        { id: 16, description: "Bánh kem chuối - Ngọt lịm - Kích thước 18cm - Phù hợp cho 3-5 người", price: "300.000", image: require("@/assets/food_menu/logo16.png") },
      ],
      pageSize: 4,
      currentPage: 1,
      cart: JSON.parse(localStorage.getItem("cart")) || [],
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.products.length / this.pageSize);
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.products.slice(start, end);
    },
    totalCartPrice() {
      return this.cart.reduce((total, item) => total + this.formatPrice(item.price) * item.quantity, 0);
    },
  },
  methods: {
    addToCart(product) {
      const cartItem = this.cart.find((item) => item.id === product.id);
      if (cartItem) {
        cartItem.quantity += 1;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(this.cart));
      // Hiển thị thông báo thêm thành công
      this.showNotification("Thêm vào giỏ hàng thành công!");
    },
    formatPrice(price) {
      // Loại bỏ dấu chấm và chữ "đ" rồi chuyển về dạng số
      return parseFloat(price.replace(/[^0-9]/g, ""));
    },
    changePage(page) {
      this.currentPage = page;
    },
    viewProduct(productId) {
      this.$router.push(`/product/${productId}`);
    },
    showNotification(message) {
      const notification = document.createElement("div");
      notification.className = "notification";
      notification.innerText = message;
      document.body.appendChild(notification);

      // Xóa thông báo sau 3 giây
      setTimeout(() => {
        notification.remove();
      }, 3000);
    },
  },
};
</script>

<style scoped>
.product-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.product-list h2 {
  font-size: 28px;
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.product-item {
  width: 240px;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.product-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: #f3f3f3;
}

.product-info {
  padding: 15px;
  text-align: left;
}

.product-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.product-price {
  font-size: 16px;
  color: #e91e63;
  font-weight: bold;
  margin-bottom: 10px;
}

.add-to-cart-button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.add-to-cart-button:hover {
  background-color: #45a049;
}

.pagination {
  margin-top: 30px;
}

.pagination-button {
  padding: 10px 20px;
  margin: 0 5px;
  background-color: #e0e0e0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination-button.active {
  background-color: #4caf50;
  color: white;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  z-index: 1000;
  animation: fadeInOut 3s;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  10%, 90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

</style>
