<template>
  <div class="order-history">
    <h1>Lịch Sử Đơn Hàng</h1>
    <ul v-if="orders.length > 0">
      <li v-for="order in orders" :key="order.id">
        <router-link :to="`/order-detail/${order.id}`">
          Mã Đơn Hàng: {{ order.id }} - Ngày Đặt: {{ order.date }}
        </router-link>
      </li>
    </ul>
    <p v-else>Chưa có đơn hàng nào.</p>
  </div>
</template>


<script>
export default {
  data() {
    return {
      orders: JSON.parse(localStorage.getItem('orders')) || [], // Lấy danh sách đơn hàng từ localStorage
    };
  }
};
</script>

<style scoped>
.order-history {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 15px;
}

a {
  text-decoration: none;
  color: #333;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

a:hover {
  background-color: #fcb034;
}
</style>
