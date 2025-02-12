<template>
  <div class="cart-container">
    <h2>Giỏ Hàng</h2>
    <div v-if="cart.length === 0" class="empty-cart">
      <p>Giỏ hàng của bạn đang trống.</p>
    </div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Tổng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart" :key="item.id">
            <td>
              <img :src="item.image" alt="product image" class="product-image" />
            </td>
            <td>{{ item.description }}</td>
            <td>
              <input type="number" v-model="item.quantity" min="1" @input="updateCart" />
            </td>
            <td>{{ formatPrice(item.price).toLocaleString() }} VND</td>
            <td>{{ (formatPrice(item.price) * item.quantity).toLocaleString() }} VND</td>
            <td>
              <button @click="removeItem(item.id)" class="delete-btn">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="cart-actions">
        <p class="total-amount">Tổng tiền: {{ totalAmount.toLocaleString() }} VND</p>
        <button @click="clearCart" class="clear-cart-btn">Xóa tất cả</button>
      </div>
      
      <!-- Form thông tin thanh toán -->
      <div class="payment-form">
        <h3>Thông Tin Thanh Toán</h3>
        <label for="name">Tên người nhận:</label>
        <input type="text" v-model="customerInfo.name" id="name" placeholder="Nhập tên người nhận" />

        <label for="phone">Số điện thoại:</label>
        <input type="tel" v-model="customerInfo.phone" id="phone" placeholder="Nhập số điện thoại" />

        <label for="address">Địa chỉ giao hàng:</label>
        <input type="text" v-model="customerInfo.address" id="address" placeholder="Nhập địa chỉ" />

        <button @click="placeOrder" class="order-btn">Xác Nhận Đặt Hàng</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      customerInfo: {
        name: '',
        phone: '',
        address: ''
      }
    };
  },
  computed: {
    isLoggedIn: {
      get() {
        return JSON.parse(localStorage.getItem('isLoggedIn')) || false;
      },
      set(value) {
        localStorage.setItem('isLoggedIn', JSON.stringify(value));
      }
    },
    totalAmount() {
      return this.cart.reduce((sum, item) => sum + (this.formatPrice(item.price) * item.quantity), 0);
    }
  },
  methods: {
    formatPrice(price) {
      return parseFloat(price.toString().replace(/[^0-9]/g, ""));
    },
    updateCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    removeItem(itemId) {
      this.cart = this.cart.filter(item => item.id !== itemId);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    clearCart() {
      this.cart = [];
      localStorage.removeItem('cart');
    },
    placeOrder() {
      // if (!this.isLoggedIn) {
      //   alert("Vui lòng đăng nhập để đặt hàng.");
      //   this.$router.push('/login');
      //   return;
      // }

      if (!this.customerInfo.name.trim() || !this.customerInfo.phone.trim() || !this.customerInfo.address.trim()) {
        alert("Vui lòng nhập đầy đủ thông tin thanh toán.");
        return;
      }

      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      const newOrder = {
        id: Date.now(),
        items: this.cart,
        totalAmount: this.totalAmount,
        customerInfo: { ...this.customerInfo },
        date: new Date().toLocaleString()
      };

      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
      this.clearCart();
      this.customerInfo = { name: '', phone: '', address: '' };
      alert('Đặt hàng thành công!');
      this.$router.push('/order-history');
    }
  }
};
</script>

<style scoped>
.cart-page {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  padding: 8px 0;
}

.total-amount, .customer-info {
  margin-top: 20px;
}

button {
  background-color: #fcb034;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

button:hover:not(:disabled) {
  background-color: #e09b1f;
}
</style>
