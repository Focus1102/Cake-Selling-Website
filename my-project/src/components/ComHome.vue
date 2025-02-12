<template>
  <main class="home">
    <!-- Banner giới thiệu -->
    <section class="home-banner">
      <h1>Chào mừng đến với Cửa Hàng Bánh Kem</h1>
      <p>Khám phá những mẫu bánh kem chất lượng của chúng tôi tại đây!</p>
      <router-link to="/products-list" class="btn btn-primary">Xem Sản Phẩm</router-link>
    </section>

    <!-- Sản phẩm nổi bật -->
    <section class="home-featured-products">
      <h2>Sản Phẩm Nổi Bật</h2>
      <div class="product-list">
        <div
          class="product-item"
          v-for="product in featuredProducts"
          :key="product.id"
        >
          <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }">
            <div class="product-image-container">
              <img :src="product.image" :alt="product.name" />
            </div>
            <h3>{{ product.name }}</h3>
            <p>{{ product.price }} VND</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Thông tin liên hệ -->
    <section class="home-contact">
      <h2>Liên Hệ Với Chúng Tôi</h2>
      <p>Để được tư vấn và hỗ trợ, vui lòng liên hệ với chúng tôi.</p>
      <router-link to="/contact" class="btn btn-secondary">Liên Hệ</router-link>
    </section>
  </main>
</template>

<script>
export default {
  data() {
    return {
      featuredProducts: [
        { id: 1, name: "Bánh Kem Phô Mai", image: require("@/assets/food_menu/banhkem1.png"), price: 250000 },
        { id: 2, name: "Bánh Kem Hạnh Nhân", image: require("@/assets/food_menu/banhkem2.png"), price: 300000 },
        { id: 3, name: "Bánh Kem Trà Xanh", image: require("@/assets/food_menu/banhkem3.png"), price: 280000 },
        { id: 4, name: "Bánh Kem Caramel", image: require("@/assets/food_menu/banhkem4.png"), price: 320000 },
        { id: 5, name: "Bánh Kem Vanilla", image: require("@/assets/food_menu/banhkem5.png"), price: 270000 },
        { id: 6, name: "Bánh Kem Tiramisu", image: require("@/assets/food_menu/banhkem6.png"), price: 350000 },
        { id: 7, name: "Bánh Kem Dâu Tươi", image: require("@/assets/food_menu/banhkem7.png"), price: 290000 },
        { id: 8, name: "Bánh Kem Trái Cây", image: require("@/assets/food_menu/banhkem8.png"), price: 310000 }
      ]
    };
  }
};
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
  animation: fadeIn 0.5s ease-in;
}

/* Banner giới thiệu */
.home-banner {
  background: linear-gradient(135deg, #98caff, #6f42c1);
  color: #fff;
  padding: 60px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-10px);
  animation: slideIn 0.7s ease-out forwards;
  opacity: 0;
}

.home-banner h1 {
  font-size: 40px;
  margin-bottom: 15px;
  font-weight: bold;
}

.home-banner p {
  font-size: 18px;
  color: #e0e0e0;
  margin-bottom: 20px;
}

/* Nút bấm */
a {
  text-decoration: none; /* Loại bỏ gạch chân cho toàn bộ liên kết */
  color: inherit; /* Giữ nguyên màu sắc */
}

a:hover {
  text-decoration: none;
}

.btn {
  margin-top: 15px;
  padding: 10px 25px;
  border: none;
  border-radius: 50px;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none; /* Loại bỏ gạch chân cho các nút */
  transition: background-color 0.3s, transform 0.2s;
}

.btn-primary {
  background-color: #ff4a57;
}

.btn-primary:hover {
  background-color: #ff2a3b;
  transform: scale(1.05);
}

.btn-secondary {
  background-color: #28a745;
}

.btn-secondary:hover {
  background-color: #218838;
  transform: scale(1.05);
}

/* Sản phẩm nổi bật */
.home-featured-products {
  margin-top: 40px;
}

.home-featured-products h2 {
  font-size: 32px;
  margin-bottom: 25px;
  color: #333;
  position: relative;
}

.home-featured-products h2::after {
  content: "";
  width: 80px;
  height: 3px;
  /* background-color: #ff4a57; */
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
}

/* Danh sách sản phẩm */
.product-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  justify-items: center;
}

.product-item {
  max-width: 220px;
  text-align: center;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.4s, box-shadow 0.4s;
  cursor: pointer;
  padding: 10px;
}

.product-item:hover {
  transform: scale(1.1) rotate(2deg);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.product-item .product-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  transition: box-shadow 0.3s ease;
}

.product-item img {
  width: 100%;
  transition: transform 0.5s ease;
}

.product-item:hover img {
  transform: scale(1.1);
}

.product-item h3,
.product-item p {
  font-size: 16px;
  color: #333;
  font-weight: normal;
  margin-top: 10px;
}

.product-item p {
  color: #e74c3c;
  font-weight: bold;
  margin-top: 5px;
}

/* Thông tin liên hệ */
.home-contact {
  margin-top: 40px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in 1.2s;
}

.home-contact h2 {
  font-size: 28px;
  margin-bottom: 15px;
  color: #333;
}

.home-contact p {
  font-size: 16px;
  color: #666;
}

/* Hiệu ứng chuyển động */
@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
