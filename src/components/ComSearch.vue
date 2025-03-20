<template>
  <div class="search-page">
    <h2>Tìm kiếm sản phẩm</h2>
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        @input="searchProducts"
        placeholder="Nhập từ khóa tìm kiếm"
        class="search-input"
      />
      <!-- Thêm bộ lọc -->
      <div class="filter-container">
        <select
          v-model="selectedCategory"
          @change="searchProducts"
          class="filter-select"
        >
          <option value="">Tất cả loại sản phẩm</option>
          <option value="ban">Bàn</option>
          <option value="ghe">Ghế</option>
          <option value="tu">Tủ</option>
          <option value="sofa">Sofa</option>
          <option value="ke">Kệ</option>
          <option value="giuong">Giường</option>
        </select>
        <select
          v-model="priceRange"
          @change="searchProducts"
          class="filter-select"
        >
          <option value="">Tất cả giá</option>
          <option value="0-1000000">Dưới 1.000.000 VND</option>
          <option value="1000000-5000000">1.000.000 - 5.000.000 VND</option>
          <option value="5000000-10000000">5.000.000 - 10.000.000 VND</option>
          <option value="10000000-">Trên 10.000.000 VND</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">Đang tìm kiếm...</div>

    <div v-else-if="filteredProducts.length > 0" class="search-results">
      <div
        v-for="product in filteredProducts"
        :key="product._id"
        class="product-card"
      >
        <router-link
          :to="{ name: 'ProductDetail', params: { id: product._id } }"
        >
          <img :src="product.image" :alt="product.name" />
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="price">{{ formatPrice(product.price) }}</p>
            <p class="sold">Đã bán: {{ product.sold || 0 }}</p>
          </div>
        </router-link>
      </div>
    </div>
    <p v-else class="no-results">Không tìm thấy sản phẩm phù hợp.</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ComSearch",
  data() {
    return {
      searchQuery: "",
      selectedCategory: "",
      priceRange: "",
      loading: false,
    };
  },
  computed: {
    ...mapGetters("products", ["allProducts"]),
    filteredProducts() {
      if (!this.allProducts) return [];

      return this.allProducts.filter((product) => {
        // Tìm theo tên
        const nameMatch =
          !this.searchQuery ||
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase());

        // Lọc theo loại
        const categoryMatch =
          !this.selectedCategory || product.type === this.selectedCategory;

        // Lọc theo giá
        let priceMatch = true;
        if (this.priceRange) {
          const [min, max] = this.priceRange.split("-");
          const price = Number(product.price);
          if (max) {
            priceMatch = price >= Number(min) && price <= Number(max);
          } else {
            priceMatch = price >= Number(min);
          }
        }

        return nameMatch && categoryMatch && priceMatch;
      });
    },
  },
  methods: {
    ...mapActions("products", ["fetchProducts"]),

    async searchProducts() {
      this.loading = true;
      try {
        if (!this.allProducts || this.allProducts.length === 0) {
          await this.fetchProducts();
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      } finally {
        this.loading = false;
      }
    },

    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },
  },
  async mounted() {
    await this.searchProducts();
  },
};
</script>

<style scoped>
.search-page {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
}

.search-container {
  margin-bottom: 30px;
}

.search-input {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  border-radius: 8px;
  border: 2px solid #ddd;
  margin-bottom: 15px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #f76c6c;
  outline: none;
}

.filter-container {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.filter-select {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  flex: 1;
}

.search-results {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 0 auto;
}

@media (max-width: 1200px) {
  .search-results {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .search-results {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .search-results {
    grid-template-columns: 1fr;
  }
}

.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  width: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-info h3 {
  margin: 0 0 10px;
  color: #333;
  font-size: 18px;
}

.price {
  color: #f76c6c;
  font-weight: bold;
  font-size: 16px;
  margin: 5px 0;
}

.sold {
  color: #666;
  font-size: 14px;
  margin: 5px 0;
}

.loading {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #666;
}

.no-results {
  text-align: center;
  padding: 30px;
  font-size: 18px;
  color: #666;
  background: #f5f5f5;
  border-radius: 8px;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
