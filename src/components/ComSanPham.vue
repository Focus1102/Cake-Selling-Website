<template>
  <main>
    <div class="product-list">
      <h2 class="product-title">Danh Sách Sản Phẩm Bánh Kem</h2>

      <!-- Hiển thị trạng thái đang tải -->
      <div v-if="loading" style="text-align: center; margin: 20px">
        Đang tải sản phẩm...
      </div>

      <!-- Hiển thị lỗi nếu có -->
      <div v-if="error" style="text-align: center; color: red; margin: 20px">
        {{ error }}
      </div>

      <!-- Khu vực bộ lọc và tìm kiếm (chỉ hiển thị khi không loading và không lỗi) -->
      <div class="filters" v-else>
        <!-- Tìm kiếm theo tên sản phẩm -->
        <input
          type="text"
          placeholder="Tìm kiếm loại bánh kem..."
          v-model="searchQuery"
          @input="filterProducts"
        />

        <!-- Lọc theo loại bánh kem -->
        <select v-model="selectedCategory" @change="filterProducts">
          <option value="">Tất Cả Loại Bánh Kem</option>
          <option value="cake">Sweetbox</option>
          <option value="banhmouse">Bánh Mouse</option>
          <option value="banhkembap">Bánh Kem Bắp</option>
          <option value="banhentremet">Bánh Entremet</option>
          <option value="banhflangato">Bánh Flan Gato</option>
        </select>

        <!-- Lọc theo thương hiệu bánh kem -->
        <!-- <select v-model="selectedBrand" @change="filterProducts">
          <option value="">Tất Cả Thương Hiệu Bánh Kem</option>
          <option value="SweetCake">SweetCake</option>
          <option value="LuxuryCake">LuxuryCake</option>
          <option value="GoldenCake">GoldenCake</option>
          <option value="HoneyCake">HoneyCake</option>
          <option value="FlanGato">FlanGato</option>
        </select> -->

        <!-- Lọc theo khoảng giá -->
        <select v-model="selectedPriceRange" @change="filterProducts">
          <option value="">Tất Cả Giá</option>
          <option value="0-200000">Dưới 200.000 VNĐ</option>
          <option value="200000-500000">200.000 - 500.000 VNĐ</option>
          <option value="500000-1000000">500.000 - 1000.000 VNĐ</option>
        </select>
      </div>

      <!-- Danh sách sản phẩm -->
      <div class="product-grid" v-if="filteredProducts.length > 0">
        <div
          class="product-item"
          v-for="product in paginatedProducts"
          :key="product._id"
        >
          <!-- Link đến trang chi tiết sản phẩm -->
          <router-link
            :to="{ name: 'ProductDetail', params: { id: product._id } }"
          >
            <img
              :src="product.image"
              alt="Hình sản phẩm"
              class="product-item-image"
            />
          </router-link>

          <div class="product-item-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">{{ formatPrice(product.price) }}</p>
            <p>Đã bán: {{ product.sold }} sản phẩm</p>
            <router-link
              :to="{ name: 'ProductDetail', params: { id: product._id } }"
            >
              <button class="btn btn-outline-primary">Xem Chi Tiết</button>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Nếu không có sản phẩm -->
      <div v-else-if="!loading" style="text-align: center; margin-top: 20px">
        Không có sản phẩm nào.
      </div>

      <!-- Phân trang -->
      <div class="pagination" v-if="filteredProducts.length > 0 && !loading">
        <button
          class="pagination-button"
          :disabled="currentPage === 1"
          @click="previousPage"
        >
          Trang trước
        </button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button
          class="pagination-button"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Trang sau
        </button>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ComSanPham",
  data() {
    return {
      products: [], // Danh sách sản phẩm gốc (toàn bộ)
      filteredProducts: [], // Danh sách sản phẩm sau khi lọc
      currentPage: 1, // Trang hiện tại
      pageSize: 4, // Số sản phẩm trên mỗi trang

      // Các biến phục vụ filter
      searchQuery: "",
      selectedCategory: "",
      selectedBrand: "",
      selectedPriceRange: "",

      // Trạng thái
      loading: false,
      error: null,
    };
  },
  computed: {
    // Tính tổng số trang dựa trên số lượng sản phẩm đã lọc
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.pageSize);
    },
    // Cắt mảng filteredProducts theo trang
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredProducts.slice(start, end);
    },
  },
  methods: {
    // Gọi action "fetchProducts" để lấy danh sách sản phẩm từ API qua Vuex
    ...mapActions("products", ["fetchProducts"]),

    async loadProducts() {
      try {
        this.loading = true;
        this.error = null;

        // Gọi action fetchProducts từ store
        await this.fetchProducts();

        // Lấy tất cả sản phẩm từ store (đã commit)
        const allProducts = this.$store.getters["products/allProducts"] || [];

        // Gán vào biến products cục bộ
        this.products = allProducts;
        // Sao chép sang filteredProducts
        this.filteredProducts = [...this.products];

        // Gọi filter ban đầu (nếu cần)
        this.filterProducts();
      } catch (err) {
        this.error = "Lỗi khi tải sản phẩm: " + err.message;
      } finally {
        this.loading = false;
      }
    },

    // Định dạng tiền tệ (VND)
    formatPrice(price) {
      if (!price || isNaN(price)) return "0 VND";
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },

    // Chuyển sang trang kế
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    // Quay lại trang trước
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    // Lọc sản phẩm theo tên, loại, thương hiệu, giá
    filterProducts() {
      this.filteredProducts = this.products.filter((product) => {
        const name = (product.name || "").toLowerCase();
        const brand = (product.brand || "").toLowerCase();
        const type = (product.type || "").toLowerCase();
        const priceValue = parseInt(product.price, 10) || 0;

        // 1. Tìm kiếm theo tên
        const matchesSearchQuery = name.includes(
          this.searchQuery.toLowerCase()
        );

        // 2. Lọc theo loại (nếu có) => type === selectedCategory
        const matchesCategory =
          !this.selectedCategory || type === this.selectedCategory;

        // 3. Lọc theo thương hiệu (nếu có) => brand === selectedBrand
        const matchesBrand =
          !this.selectedBrand || brand === this.selectedBrand;

        // 4. Lọc theo khoảng giá (nếu có)
        const matchesPriceRange = this.matchPriceRange(priceValue);

        return (
          matchesSearchQuery &&
          matchesCategory &&
          matchesBrand &&
          matchesPriceRange
        );
      });

      // Mỗi lần filter, reset về trang 1
      this.currentPage = 1;
    },

    // Kiểm tra giá trong khoảng
    matchPriceRange(price) {
      if (!this.selectedPriceRange) return true;

      const [min, max] = this.selectedPriceRange.split("-");
      const minVal = parseInt(min, 10) || 0;
      const maxVal = max ? parseInt(max, 10) : null;

      if (maxVal) {
        // Nếu có max => price phải nằm giữa minVal và maxVal
        return price >= minVal && price <= maxVal;
      } else {
        // Nếu không có max => chỉ cần price >= minVal
        return price >= minVal;
      }
    },
  },
  async mounted() {
    await this.loadProducts();

    // Lấy param category
    const cat = this.$route.params.category; // "ban" (không dấu)
    if (cat) {
      this.selectedCategory = cat; // => "ban"
      this.filterProducts();
    }
  },
  watch: {
    "$route.params.category"(newVal) {
      this.selectedCategory = newVal || "";
      this.filterProducts();
    },
  },
};
</script>

<style scoped>
.product-list {
  text-align: center;
  padding: 40px 20px;
  background-color: #f9f9f9;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 20px;
}

.filters input[type="text"],
.filters select {
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  transition: box-shadow 0.3s ease;
  min-width: 200px;
}

.filters input[type="text"]:focus,
.filters select:focus {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.product-title {
  font-size: 32px;
  margin-top: 40px;
  color: #333;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1300px;
  margin: 0 auto;
}

.product-item {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.product-item-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
}

.product-item-info {
  padding: 20px;
  text-align: left;
}

.product-name {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.product-price {
  font-size: 18px;
  color: #f76c6c;
  margin-bottom: 5px;
}

.btn-outline-primary {
  padding: 12px 20px;
  color: #f76c6c;
  border: 1px solid #f76c6c;
  border-radius: 8px;
  background: none;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-outline-primary:hover {
  background-color: #f76c6c;
  color: #fff;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 20px;
}

.pagination-button {
  padding: 10px 20px;
  background-color: #fcb034;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-button:hover:not(:disabled) {
  background-color: #e89c2f;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
