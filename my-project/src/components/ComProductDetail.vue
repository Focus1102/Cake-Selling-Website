<template>
    <div v-if="product" class="product-detail">
      <h2>{{ product.description }}</h2>
      <img :src="product.image" alt="Đồng hồ Epos Swiss" class="product-detail-image" />
      <p class="product-price">{{ product.price }}</p>
      <p class="product-description">{{ product.description }}</p>
      <button @click="goBack" class="back-button">Quay lại</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "ProductDetail",
    data() {
      return {
        product: null,
      };
    },
    created() {
      const productId = parseInt(this.$route.params.id);
      this.fetchProduct(productId);
    },
    methods: {
      fetchProduct(productId) {
        // Giả sử bạn có dữ liệu sản phẩm cứng trong component này
        const products = [
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
          // ... Các sản phẩm bánh kem khác
        ];
        this.product = products.find((p) => p.id === productId);
      },
      goBack() {
        this.$router.push("/sanpham");
      },
    },
  };
  </script>
  
  <style scoped>
  .product-detail {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
  .product-detail h2 {
    font-size: 24px;
    color: #333;
  }
  .product-detail-image {
    width: 100%;
    height: auto;
    max-width: 400px;
  }
  .product-price {
    font-size: 18px;
    color: #753ce7;
    font-weight: bold;
  }
  .product-description {
    font-size: 16px;
    color: #555;
    margin-top: 10px;
  }
  .back-button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 14px;
    background-color: #e74c3c;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  