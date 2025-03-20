<template>
  <div>
    <!-- Hiển thị khi chưa đăng nhập -->
    <div v-if="!isAuthenticated" class="login-required">
      <div class="login-message">
        <i class="fa fa-shopping-cart cart-icon"></i>
        <h2>Vui lòng đăng nhập để xem giỏ hàng</h2>
        <p>Bạn cần đăng nhập để có thể xem và quản lý giỏ hàng của mình.</p>
        <button @click="redirectToLogin" class="login-button">Đăng nhập</button>
      </div>
    </div>

    <!-- Hiển thị khi đã đăng nhập nhưng giỏ hàng trống -->
    <div
      v-else-if="isAuthenticated && cartItems.length === 0"
      class="empty-cart"
    >
      <p>Giỏ hàng trống</p>
    </div>

    <!-- Hiển thị khi đã đăng nhập và có sản phẩm trong giỏ hàng -->
    <div
      v-else-if="isAuthenticated && cartItems.length > 0"
      class="cart-container"
    >
      <h2 class="cart-title">Giỏ Hàng</h2>
      <table class="cart-table" :key="cartItemsKey">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
                :disabled="
                  cartItems.filter((item) => canSelect(item)).length === 0
                "
              />
            </th>
            <th>Hình Ảnh</th>
            <th>Chi Tiết</th>
            <th>Giá</th>
            <th>Số Lượng</th>
            <th>Thành Tiền</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.variantId">
            <td class="align-middle">
              <input
                type="checkbox"
                v-model="selectedItems"
                :value="item"
                :disabled="!canSelect(item)"
              />
            </td>
            <td class="align-middle">
              <div class="image-container">
                <img
                  :src="item.image"
                  alt="Product Image"
                  class="product-image"
                />
                <span
                  v-if="getMaxQuantity(item) <= 0"
                  class="out-of-stock-badge"
                  >HẾT HÀNG</span
                >
              </div>
            </td>
            <td class="align-middle product-details">
              <p class="product-name">{{ item.name }}</p>
              <p class="product-options">
               Kích thước:{{ item.size || "N/A" }}
              </p>
              <p class="stock-info" v-if="getMaxQuantity(item) > 0">
                Còn lại: {{ getMaxQuantity(item) }} sản phẩm
              </p>
              <p class="out-of-stock" v-else>Hết hàng</p>
            </td>
            <td class="align-middle">
              {{ formatPrice(item.price) }}
            </td>
            <td class="align-middle quantity-wrapper">
              <button
                @click="decreaseQuantity(item)"
                :disabled="item.quantity <= 1"
              >
                -
              </button>
              <input
                type="number"
                :value="item.quantity"
                min="1"
                :max="getMaxQuantity(item)"
                @change="handleQuantityChange($event, item)"
                @input="validateQuantityInput($event, item)"
              />
              <button
                @click="increaseQuantity(item)"
                :disabled="!canIncreaseQuantity(item)"
              >
                +
              </button>
            </td>
            <td class="align-middle">
              {{ formatPrice(item.price * item.quantity) }}
            </td>
            <td class="align-middle">
              <button 
                class="btn-danger" 
                @click="removeItem(item.variantId)"
                :disabled="isRemoving === item.variantId"
              >
                <span v-if="isRemoving === item.variantId">
                  <i class="fa fa-spinner fa-spin"></i>
                </span>
                <span v-else>X</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="cart-summary">
        <p class="summary-text">
          Tổng tiền sản phẩm đã chọn:
          <span class="summary-value">{{
            formatPrice(selectedTotalAmount)
          }}</span>
        </p>
        <p class="summary-text">
          Tổng số lượng sản phẩm đã chọn:
          <span class="summary-value">{{ selectedTotalItems }}</span>
        </p>
        <button
          @click="goToCheckout"
          class="btn-checkout"
          :disabled="selectedItems.length === 0"
        >
          Thanh Toán
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      selectedItems: [],
      cartItemsKey: 0,
      isRemoving: null,
    };
  },
  computed: {
    ...mapGetters("cart", ["cartItems", "cartTotalAmount"]),
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
    selectedTotalAmount() {
      if (!this.selectedItems || this.selectedItems.length === 0) {
        return 0;
      }
      return this.selectedItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    selectedTotalItems() {
      if (!this.selectedItems || this.selectedItems.length === 0) {
        return 0;
      }
      return this.selectedItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },
    isAllSelected() {
      if (this.cartItems.length === 0) return false;

      // Lấy danh sách các sản phẩm có thể chọn được (còn hàng)
      const selectableItems = this.cartItems.filter((item) =>
        this.canSelect(item)
      );

      // Nếu không có sản phẩm nào có thể chọn được
      if (selectableItems.length === 0) return false;

      // Nếu không có sản phẩm nào được chọn
      if (this.selectedItems.length === 0) return false;

      // Kiểm tra xem tất cả các sản phẩm có thể chọn được đã được chọn chưa
      return selectableItems.every((item) =>
        this.selectedItems.some(
          (selected) => selected.variantId === item.variantId
        )
      );
    },
  },
  watch: {
    isAuthenticated: {
      handler(newValue) {
        if (newValue) {
          this.loadCartItems();
        }
      },
      immediate: true,
    },
    cartItems: {
      handler(newItems) {
        // Kiểm tra tồn tại của selectedItems và cập nhật lại khi cartItems thay đổi
        if (!this.selectedItems) {
          this.selectedItems = [];
        } else if (this.selectedItems.length > 0) {
          // Tạo một mảng mới chỉ chứa các sản phẩm vẫn còn trong giỏ hàng
          // và cập nhật số lượng của từng item nếu đã thay đổi
          const updatedSelectedItems = this.selectedItems
            .filter((selected) =>
              newItems.some((item) => item.variantId === selected.variantId)
            )
            .map((selected) => {
              // Tìm item tương ứng trong cartItems
              const cartItem = newItems.find(
                (item) => item.variantId === selected.variantId
              );
              // Cập nhật số lượng theo cartItems
              if (cartItem && cartItem.quantity !== selected.quantity) {
                console.log(
                  `Cập nhật số lượng cho ${selected.name}: ${selected.quantity} -> ${cartItem.quantity}`
                );
                return { ...selected, quantity: cartItem.quantity };
              }
              return selected;
            });

          // Chỉ cập nhật nếu có sự thay đổi để tránh re-render không cần thiết
          const hasChanges =
            updatedSelectedItems.length !== this.selectedItems.length ||
            updatedSelectedItems.some(
              (item, index) =>
                item.quantity !== this.selectedItems[index]?.quantity
            );

          if (hasChanges) {
            this.selectedItems = updatedSelectedItems;
          }
        }
        // Tăng key để bắt buộc bảng re-render khi cần
        this.cartItemsKey++;
      },
      immediate: true,
      deep: true,
    },
  },
  async created() {
    // Tải danh sách sản phẩm trước, sau đó tải giỏ hàng
    await this.$store.dispatch("products/fetchProducts");
    await this.$store.dispatch("cart/fetchCart");

    // Đảm bảo selectedItems là một mảng rỗng khi bắt đầu
    this.selectedItems = [];
    this.loadCartItems();
  },
  methods: {
    formatPrice(price) {
      if (!price || isNaN(price)) return "0 VNĐ";
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },
    async increaseQuantity(item) {
      try {
        await this.$store.dispatch("cart/updateCartItem", {
          variantId: item.variantId,
          quantity: item.quantity + 1,
        });
        this.updateSelectedItemQuantity(item.variantId, item.quantity + 1);
      } catch (error) {
        console.error("Lỗi khi tăng số lượng:", error);
        alert(
          error.message ||
            "Không thể tăng số lượng sản phẩm. Vui lòng thử lại sau."
        );
      }
    },
    async decreaseQuantity(item) {
      if (item.quantity > 1) {
        try {
          await this.$store.dispatch("cart/updateCartItem", {
            variantId: item.variantId,
            quantity: item.quantity - 1,
          });
          this.updateSelectedItemQuantity(item.variantId, item.quantity - 1);
        } catch (error) {
          console.error("Lỗi khi giảm số lượng:", error);
          alert("Không thể giảm số lượng sản phẩm. Vui lòng thử lại sau.");
        }
      } else {
        this.removeItem(item.variantId);
      }
    },
    async removeItem(variantId) {
      try {
        this.isRemoving = variantId;
        
        // Thêm log để debug
        console.log(`Bắt đầu xóa sản phẩm với ID: ${variantId}`);
        console.log("Thông tin giỏ hàng hiện tại:", this.$store.state.cart.cartItems);
        
        // Hiển thị thông báo xác nhận
        const confirmDelete = confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?");
        if (!confirmDelete) {
          this.isRemoving = null;
          return;
        }
        
        const result = await this.$store.dispatch("cart/removeFromCart", variantId);
        console.log("Kết quả xóa sản phẩm:", result);
        
        // Remove from selected items if present
        this.selectedItems = this.selectedItems.filter(
          item => item.variantId !== variantId
        );
        
      } catch (error) {
        console.error("Lỗi chi tiết khi xóa sản phẩm:", error);
        
        let errorMessage = "Không thể xóa sản phẩm. Vui lòng thử lại sau.";
        
        if (error.response) {
          console.log("Status code:", error.response.status);
          if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }
        
        alert(errorMessage);
      } finally {
        this.isRemoving = null;
      }
    },
    updateSelectedItemQuantity(variantId, newQuantity) {
      const isSelected = this.selectedItems.some(
        (item) => item.variantId === variantId
      );
      if (isSelected) {
        this.selectedItems = this.selectedItems.map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
    },
    handleQuantityChange(event, item) {
      const newValue = parseInt(event.target.value);
      if (newValue > 0 && newValue <= this.getMaxQuantity(item)) {
        this.$store
          .dispatch("cart/updateCartItem", {
            variantId: item.variantId,
            quantity: newValue,
          })
          .then(() => {
            this.updateSelectedItemQuantity(item.variantId, newValue);
          });
      }
    },
    validateQuantityInput(event, item) {
      const newValue = parseInt(event.target.value);
      if (newValue > this.getMaxQuantity(item)) {
        event.target.value = this.getMaxQuantity(item);
      }
    },
    getMaxQuantity(item) {
      let productId = item.productId;
      if (productId && typeof productId === "object") {
        productId = productId._id || productId.id || String(productId);
      }

      const product = this.$store.getters["products/getProductById"](productId);
      if (!product) return 0;

      return typeof product.stock === "number" ? product.stock : 0;
    },
    canSelect(item) {
      const maxQuantity = this.getMaxQuantity(item);
      return maxQuantity > 0 && item.quantity <= maxQuantity;
    },
    canIncreaseQuantity(item) {
      return item.quantity < this.getMaxQuantity(item);
    },
    async goToCheckout() {
      if (this.selectedItems.length > 0) {
        const productQuantities = {};
        for (const item of this.selectedItems) {
          if (!productQuantities[item.productId]) {
            productQuantities[item.productId] = 0;
          }
          productQuantities[item.productId] += item.quantity;
        }

        for (const productId in productQuantities) {
          const product =
            this.$store.getters["products/getProductById"](productId);
          if (!product) {
            console.warn(`Product with ID ${productId} not found in store.`);
            continue; // Bỏ qua nếu product không tồn tại
          }
          if (productQuantities[productId] > (product.stock || 0)) {
            alert(
              `Sản phẩm ${product.name} vượt quá số lượng tồn kho (${
                product.stock || 0
              } còn lại).`
            );
            return;
          }
        }

        localStorage.setItem(
          "selectedItems",
          JSON.stringify(this.selectedItems)
        );
        this.$router.push("/thanhtoan");
      } else {
        alert("Vui lòng chọn sản phẩm để thanh toán.");
      }
    },
    toggleSelectAll(event) {
      const selectableItems = this.cartItems.filter((item) =>
        this.canSelect(item)
      );

      if (selectableItems.length === 0) {
        this.selectedItems = [];
        return;
      }

      this.selectedItems = event.target.checked ? [...selectableItems] : [];
    },
    redirectToLogin() {
      this.$router.push("/login");
    },
    async loadCartItems() {
      if (this.isAuthenticated) {
        await this.$store.dispatch("cart/fetchCart");
      }
    },
  },
};
</script>

<style scoped>
.cart-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.cart-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: left;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
}

.cart-table th,
.cart-table td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: middle;
  height: 30px; /* Đặt chiều cao cố định cho các ô để đồng bộ */
}

.cart-table th {
  background-color: #4caf50;
  color: #ffffff;
  font-weight: bold;
}

.align-middle {
  vertical-align: middle;
}

.image-container {
  position: relative;
  display: inline-block;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.out-of-stock-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #f44336;
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 3px 6px;
  border-radius: 3px;
  transform: translate(5px, -5px);
}

.product-details {
  text-align: left;
}

.product-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.product-options {
  color: #777;
  font-size: 14px;
}

.stock-info {
  color: #2196f3;
  font-size: 13px;
  margin-top: 5px;
}

.out-of-stock {
  color: #f44336;
  font-size: 13px;
  font-weight: bold;
  margin-top: 5px;
}

.quantity-wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;
  margin-top: 100px;
}

.quantity-wrapper button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f8f8f8;
  cursor: pointer;
  font-size: 18px;
  text-align: center;
  margin-bottom: 100px;
}

.quantity-wrapper input {
  width: 50px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  height: 30px;
  margin-bottom: 100px;
}

.btn-danger {
  background-color: #d9534f;
  color: #ffffff;
  padding: 6px 10px; /* Điều chỉnh padding để khớp với chiều cao ô */
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;
  line-height: 1; /* Đảm bảo nút "X" căn chỉnh với các cột khác */
  box-sizing: border-box; /* Bao gồm border trong kích thước */
}

.btn-danger:hover {
  background-color: #c9302c;
}

.cart-summary {
  margin-top: 20px;
  padding: 20px;
  border-top: 2px solid #e0e0e0;
  text-align: center;
}

.summary-text {
  font-size: 18px;
  margin: 10px 0;
}

.summary-value {
  font-weight: bold;
  color: #d32f2f;
}

.btn-checkout {
  padding: 15px 30px;
  background-color: #4caf50;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  margin-top: 15px;
}

.btn-checkout:hover {
  background-color: #43a047;
  transform: scale(1.05);
}

.empty-cart {
  text-align: center;
  font-size: 20px;
  color: #777;
  margin-top: 50px;
}

.login-required {
  text-align: center;
  padding: 50px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.login-message {
  text-align: center;
}

.login-message i {
  font-size: 48px;
  color: #4caf50;
  margin-bottom: 20px;
}

.login-message h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.login-message p {
  font-size: 16px;
  color: #777;
  margin-bottom: 20px;
}

.login-button {
  padding: 15px 30px;
  background-color: #4caf50;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.login-button:hover {
  background-color: #43a047;
  transform: scale(1.05);
}
</style>
