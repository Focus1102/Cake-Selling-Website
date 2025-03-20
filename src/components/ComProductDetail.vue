<template>
  <div class="product-detail" v-if="product">
    <!-- Khu vực ảnh sản phẩm -->
    <div class="product-image-wrapper">
      <!-- Nếu có mảng images -->
      <template v-if="product.images && product.images.length">
        <!-- Sử dụng Swiper để hiển thị carousel -->
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
          <swiper-slide v-for="(imgUrl, idx) in product.images" :key="idx">
            <img :src="imgUrl" :alt="product.name" class="carousel-image" />
          </swiper-slide>
        </swiper>
      </template>
      <!-- Nếu không có mảng images nhưng có product.image -->
      <img
        v-else-if="product.image"
        :src="product.image"
        alt="Product Image"
        class="product-image-detail"
      />
      <!-- Nếu không có gì, hiển thị fallback -->
      <p v-else class="no-image">Không có ảnh</p>
    </div>

    <!-- Khu vực thông tin sản phẩm -->
    <div class="product-info">
      <h3 class="product-title">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      <p class="product-quantity">Đã bán: {{ product.sold }}</p>
      <p class="product-price">
        Giá: <span class="price">{{ formatPrice(product.price) }}</span>
      </p>
      <div class="product-options">
        <div class="option" v-if="product.colors && product.colors.length">
          <label>Màu:</label>
          <select v-model="selectedColor">
            <option v-for="color in product.colors" :key="color">
              {{ color }}
            </option>
          </select>
        </div>
        <div class="option" v-if="product.sizes && product.sizes.length">
          <label>Kích thước:</label>
          <select v-model="selectedSize">
            <option v-for="size in product.sizes" :key="size">
              {{ size }}
            </option>
          </select>
        </div>
        <div class="option">
          <!-- <label>Số lượng còn:</label> -->
          <span>{{ product.stock }}</span>
        </div>
        <div class="option" v-if="product.stock > 0">
          <label>Số lượng mua:</label>
          <input
            type="number"
            v-model="selectedQuantity"
            min="1"
            :max="product.stock"
          />
        </div>
      </div>
      <button
        class="btn btn-primary"
        @click="addToCart(product)"
        :disabled="product.stock === 0"
      >
        {{ product.stock > 0 ? "Thêm Vào Giỏ Hàng" : "Đặt Hàng" }}
      </button>
    </div>
  </div>
  <p v-else>Không tìm thấy sản phẩm hoặc đang tải...</p>
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
  name: "ComProductDetail",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      product: null,
      selectedColor: "",
      selectedSize: "",
      selectedQuantity: 1,
      modulesForSwiper: [Autoplay, Navigation, Pagination],
    };
  },
  computed: {
    ...mapGetters("products", ["allProducts", "getProductById"]),
  },
  async mounted() {
    const id = this.$route.params.id;
    if (!this.allProducts.length) {
      await this.$store.dispatch("products/fetchProducts");
    }
    this.product = this.getProductById(id);
    if (this.product) {
      if (this.product.colors && this.product.colors.length) {
        this.selectedColor = this.product.colors[0];
      }
      if (this.product.sizes && this.product.sizes.length) {
        this.selectedSize = this.product.sizes[0];
      }
    }
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
    async addToCart(product) {
      if (!this.$store.getters["auth/isAuthenticated"]) {
        alert("Vui lòng đăng nhập để mua sản phẩm");
        this.$router.push("/login");
        return;
      }
      if (this.selectedQuantity <= 0) {
        alert("Số lượng phải lớn hơn 0");
        return;
      }
      if (this.selectedQuantity > product.stock) {
        alert("Không đủ hàng trong kho");
        return;
      }
      const cartProduct = {
        ...product,
        quantity: this.selectedQuantity,
        color: this.selectedColor,
        size: this.selectedSize,
      };
      
      try {
        await this.$store.dispatch("cart/addToCart", cartProduct);
        // Hiển thị thông báo thành công
        alert("Đã thêm sản phẩm vào giỏ hàng thành công!");
      } catch (error) {
        // Lỗi đã được xử lý trong store, không cần hiển thị ở đây
        console.error("Error in component:", error);
      }
    },
  },
};
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 50px auto;
  display: flex;
  gap: 30px;
  align-items: flex-start;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.product-image-wrapper {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-image-detail {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.no-image {
  color: #999;
  font-style: italic;
}

.product-info {
  flex: 1;
  text-align: left;
}

.product-title {
  font-size: 2em;
  color: #333;
  margin-bottom: 15px;
}

.product-description {
  font-size: 1.2em;
  color: #555;
  margin-bottom: 10px;
}

.product-quantity {
  font-size: 1em;
  color: #777;
  margin-bottom: 10px;
}

.product-price {
  font-size: 1.8em;
  color: #f76c6c;
  margin-bottom: 20px;
}

.price {
  font-weight: bold;
}

.product-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option label {
  font-size: 1em;
  color: #333;
}

.option select,
.option input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

.btn {
  padding: 15px 30px;
  background-color: #fcb034;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  font-weight: bold;
}

.btn:hover {
  background-color: #e89c2f;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Swiper carousel styles */
.carousel-container {
  width: 100%;
  height: 500px; /* Điều chỉnh chiều cao phù hợp */
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
  font-size: 1em;
  width: 10px;
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  border-radius: 50%;
}

.carousel-container .swiper-button-prev {
  left: 10px;
}

.carousel-container .swiper-button-next {
  right: 10px;
}

.carousel-container .swiper-button-prev:hover,
.carousel-container .swiper-button-next:hover {
  background-color: #e89c2f;
  transform: scale(1.05);
}
</style>
