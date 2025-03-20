<template>
  <div class="payment-history">
    <h1 class="title">Lịch sử Thanh Toán</h1>

    <!-- Nếu người dùng chưa đăng nhập -->
    <div v-if="!isAuthenticated" class="login-required">
      <div class="login-message">
        <i class="fa fa-lock lock-icon"></i>
        <h2>Vui lòng đăng nhập để xem lịch sử thanh toán</h2>
        <p>Bạn cần đăng nhập để có thể xem lịch sử các đơn hàng đã thanh toán.</p>
        <button @click="redirectToLogin" class="login-button">Đăng nhập</button>
      </div>
    </div>

    <!-- Nếu đã đăng nhập và có lịch sử thanh toán -->
    <table v-else-if="paymentHistory.length > 0" class="history-table">
      <thead>
        <tr>
          <th>ID Đơn hàng</th>
          <th>Ngày thanh toán</th>
          <th>Tên người nhận</th>
          <th>Địa chỉ</th>
          <th>Sản phẩm</th>
          <th>Tổng tiền</th>
          <th>Phương thức thanh toán</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, index) in paymentHistory" :key="order._id || index">
          <td>{{ order._id }}</td>
          <td>{{ formatDate(order.date) }}</td>
          <td>{{ order.recipientName }}</td>
          <td>{{ order.recipientAddress }}</td>
          <td>
            <ul class="product-list">
              <li v-for="(item, itemIndex) in order.items" :key="itemIndex">
                {{ item.name }} - Màu: {{ item.color }} - Kích thước:
                {{ item.size }} - SL: {{ item.quantity }}
              </li>
            </ul>
          </td>
          <td>{{ formatPrice(order.totalAmount) }}</td>
          <td>{{ getPaymentMethodText(order.paymentMethod) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Nếu đã đăng nhập nhưng không có lịch sử -->
    <p v-else>Không có lịch sử thanh toán.</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      paymentHistory: 'paymentHistory/paymentHistory'
    }),
    isAuthenticated() {
      return !!this.$store.getters["auth/currentUser"];
    },
  },
  watch: {
    isAuthenticated: {
      handler(newValue) {
        if (newValue) this.loadPaymentHistory();
      },
      immediate: true,
    },
  },
  methods: {
    loadPaymentHistory() {
      if (this.isAuthenticated) {
        this.$store.dispatch('paymentHistory/fetchPaymentHistory');
      }
    },
    formatDate(dateString) {
      if (!dateString) return "Không xác định";
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Không xác định";
      
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    formatPrice(amount) {
      if (!amount || isNaN(amount)) return "Không xác định";
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    },
    getPaymentMethodText(method) {
      const methods = {
        "credit_card": "Thẻ tín dụng",
        "cash_on_delivery": "Thanh toán khi nhận hàng",
        "bank_transfer": "Chuyển khoản ngân hàng"
      };
      return methods[method] || method || "Không xác định";
    },
    redirectToLogin() {
      this.$router.push("/login");
    }
  },
  created() {
    this.loadPaymentHistory();
  },
};
</script>

<style scoped>
.payment-history {
  margin-bottom: 30px;
  max-width: 1200px;
  margin: 40px auto;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 28px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}

.login-required {
  text-align: center;
  color: #666;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #ffffff;
}

.history-table th,
.history-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.history-table th {
  background-color: #4caf50;
  color: #ffffff;
  font-weight: bold;
  text-transform: uppercase;
}

.history-table tr:nth-child(even) {
  background-color: #f8f8f8;
}

.product-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.product-list li {
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
}

p {
  text-align: center;
  color: #888;
  font-size: 18px;
}

.login-message {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
}

.lock-icon {
  font-size: 24px;
  margin-bottom: 10px;
}

.login-button {
  background-color: #4caf50;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.login-button:hover {
  background-color: #45a049;
}
</style>
