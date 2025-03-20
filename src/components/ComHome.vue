<template>
  <div class="home">
    <!-- Phần giới thiệu -->
    <div class="explore-section">
      <h2 class="explore-title">
        Khám phá những sản phẩm Bánh Kem mới nhất với ưu đãi đặc biệt
      </h2>
      <button class="explore-btn" @click="$router.push('/sanpham')">
        Khám Phá Ngay
      </button>
    </div>

    <!-- Swiper Carousel (banner) -->
    <swiper
      :modules="modulesForSwiper"
      :slides-per-view="1"
      :loop="true"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      :speed="800"
      :navigation="true"
      :pagination="true"
      class="carousel-container"
    >
      <swiper-slide v-for="(slide, index) in slides" :key="index">
        <img :src="slide.src" :alt="slide.alt" class="carousel-image" />
      </swiper-slide>
    </swiper>

    <!-- Sản phẩm bán chạy -->
    <div class="featured-section" v-if="bestSellingProducts.length">
      <div class="featured-header">
        <h3 class="featured-title">Sản phẩm bán chạy</h3>
        <router-link to="/sanpham" class="view-all-link"
          >Xem tất cả &gt;</router-link
        >
      </div>

      <div class="featured-list">
        <div
          class="product-item"
          v-for="product in bestSellingProducts"
          :key="product._id"
        >
          <img :src="product.image" :alt="product.name" />
          <h4>{{ product.name }}</h4>
          <p>{{ product.description }}</p>
          <span>{{ formatPrice(product.price) }}</span>
          <div class="product-stats">
            <span class="sold-count">Đã bán: {{ product.sold || 0 }}</span>
          </div>
          <router-link
            :to="{ name: 'ProductDetail', params: { id: product._id } }"
          >
            <button class="btn btn-outline-primary">Xem Chi Tiết</button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Sản phẩm mới -->
    <div class="featured-section" v-if="newProducts.length">
      <div class="featured-header">
        <h3 class="featured-title">Sản phẩm mới</h3>
        <router-link to="/sanpham" class="view-all-link"
          >Xem tất cả &gt;</router-link
        >
      </div>

      <div class="featured-list">
        <div
          class="product-item"
          v-for="product in newProducts"
          :key="product._id"
        >
          <img :src="product.image" :alt="product.name" />
          <h4>{{ product.name }}</h4>
          <p>{{ product.description }}</p>
          <span>{{ formatPrice(product.price) }}</span>
          <div class="product-stats">
            <span class="sold-count">Đã bán: {{ product.sold || 0 }}</span>
          </div>
          <router-link
            :to="{ name: 'ProductDetail', params: { id: product._id } }"
          >
            <button class="btn btn-outline-primary">Xem Chi Tiết</button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Nếu chưa có dữ liệu, hiển thị thông báo -->
    <div v-else>
      <p>Đang tải sản phẩm...</p>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "ComHome",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      modulesForSwiper: [Autoplay, Navigation, Pagination],
      slides: [
        { src: require("@/assets/banner4.png"), alt: "Slide 1" },
        { src: require("@/assets/banner5.jpg"), alt: "Slide 2" },
        { src: require("@/assets/banner3.jpg"), alt: "Slide 3" },
      ],
      loading: true,
      error: null,
    };
  },
  computed: {
    ...mapGetters("products", ["allProducts"]),
    // Sản phẩm bán chạy - sắp xếp theo số lượng bán
    bestSellingProducts() {
      return [...this.allProducts]
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 4);
    },
    // Sản phẩm mới - lấy 4 sản phẩm mới nhất
    newProducts() {
      return [...this.allProducts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);
    },
  },
  methods: {
    ...mapActions("cart", ["addToCart"]),

    formatPrice(value) {
      if (!value || isNaN(value)) return "0 VND";
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
  },
  async mounted() {
    try {
      this.loading = true;
      // Lấy sản phẩm và đơn hàng từ store nếu chưa có
      if (!this.allProducts.length) {
        await this.$store.dispatch("products/fetchProducts");
      }
      if (!this.allOrders.length) {
        await this.$store.dispatch("orders/fetchOrders");
      }
      this.loading = false;
    } catch (err) {
      this.error = "Có lỗi xảy ra khi tải dữ liệu";
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.home {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f8f8;
  padding-top: 40px;
  box-sizing: border-box;
}

.explore-section {
  text-align: center;
  margin-bottom: 30px;
}

.explore-title {
  font-size: 2.5em;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.explore-btn {
  padding: 12px 24px;
  font-size: 1.2em;
  font-weight: bold;
  background-color: #fcb034;
  color: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.explore-btn:hover {
  background-color: #e89c2f;
  transform: scale(1.05);
}
.explore-btn:active {
  transform: scale(0.98);
}

/* Swiper carousel styles */
.carousel-container {
  width: 100%;
  height: 70vh;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}
.carousel-container .swiper-pagination {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}
.carousel-container .swiper-pagination-bullet {
  width: 12px;
  height: 12px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
}
.carousel-container .swiper-pagination-bullet-active {
  background-color: #fcb034;
}
.carousel-container .swiper-button-prev,
.carousel-container .swiper-button-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  font-size: 2em;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  border-radius: 50%;
}
.carousel-container .swiper-button-prev {
  left: 20px;
}
.carousel-container .swiper-button-next {
  right: 20px;
}
.carousel-container .swiper-button-prev:hover,
.carousel-container .swiper-button-next:hover {
  background-color: #e89c2f;
  transform: scale(1.05);
}

/* Sản phẩm nổi bật */
.featured-section {
  width: 80%;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Header của khối sản phẩm nổi bật */
.featured-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.featured-title {
  font-size: 1.8em;
  font-weight: bold;
  color: #333;
}

.view-all-link {
  color: #fcb034;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s;
}
.view-all-link:hover {
  color: #e89c2f;
}

/* Danh sách 4 sản phẩm */
.featured-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 cột */
  gap: 20px;
}

.product-item {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 15px;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.product-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.product-item img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.product-item h4 {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 5px;
}

.product-item p {
  font-size: 0.95em;
  color: #777;
  flex: 1; /* Cho phép mô tả co giãn */
  margin-bottom: 5px;
}

.product-item span {
  font-size: 1.1em;
  font-weight: bold;
  color: #fcb034;
  margin-bottom: 10px;
}

.btn-outline-primary {
  margin-top: auto;
  padding: 8px 16px;
  border: 2px solid #fcb034;
  border-radius: 5px;
  background: none;
  color: #fcb034;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.btn-outline-primary:hover {
  background-color: #fcb034;
  color: #fff;
}

/* Thêm style cho số lượng đã bán */
.product-stats {
  margin: 8px 0;
  font-size: 0.9em;
  color: #666;
}

.sold-count {
  color: #e89c2f;
  font-weight: 500;
}

/* Loading state */
.loading-state {
  text-align: center;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.loading-state p {
  color: #666;
  font-size: 1.1em;
}

/* Error state */
.error-state {
  text-align: center;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.error-state p {
  color: #dc3545;
  font-size: 1.1em;
}
</style>
