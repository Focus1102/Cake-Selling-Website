<template>
  <div class="orders-container">
    <h1 class="page-title">Quản Lý Đơn Hàng</h1>

    <div class="coming-soon">
      <i class="fas fa-cogs"></i>
      <h2>Đang Phát Triển</h2>
      <p>Tính năng này đang được xây dựng và sẽ sớm được cập nhật.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "orders-list",
};
</script>

<style scoped>
.orders-container {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.orders-container {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.page-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.coming-soon i {
  font-size: 64px;
  margin-bottom: 20px;
  color: #2196f3;
}

.coming-soon h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.coming-soon p {
  font-size: 16px;
  color: #666;
}

@media (max-width: 768px) {
  .coming-soon {
    padding: 50px 10px;
  }
}
</style>
