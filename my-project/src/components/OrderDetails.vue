<template>
  <div class="order-detail">
    <h1>Chi Tiết Đơn Hàng</h1>
    <div v-if="order">
      <p><strong>Mã Đơn Hàng:</strong> {{ order.id }}</p>
      <p><strong>Ngày Đặt:</strong> {{ order.date }}</p>
      <p><strong>Tên Người Nhận:</strong> {{ order.customerInfo.name }}</p>
      <p><strong>Số Điện Thoại:</strong> {{ order.customerInfo.phone }}</p>
      <p><strong>Địa Chỉ:</strong> {{ order.customerInfo.address }}</p>
      <h3>Sản Phẩm:</h3>
      <ul>
        <li v-for="item in order.items" :key="item.id">
          {{ item.description }} - Số lượng: {{ item.quantity }} - Giá: {{ (item.price * item.quantity).toLocaleString() }} VND
        </li>
      </ul>
      <p><strong>Tổng Tiền:</strong> {{ order.totalAmount.toLocaleString() }} VND</p>
    </div>
    <p v-else>Không tìm thấy đơn hàng.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: null,
    };
  },
  mounted() {
    const orderId = this.$route.params.id;
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    this.order = orders.find(order => order.id === parseInt(orderId));

    // Nếu không tìm thấy đơn hàng, bạn có thể điều hướng hoặc thông báo cho người dùng
    // if (!this.order) {
    //   alert("Không tìm thấy đơn hàng.");
    //   this.$router.push('/');  // Chuyển hướng về trang chủ
    // }
  },
};
</script>

<style scoped>
.order-detail {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
