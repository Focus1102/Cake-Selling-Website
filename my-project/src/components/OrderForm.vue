<template>
  <div class="order-form">
    <h2>Đặt Hàng</h2>
    <div>
      <label for="product-name">Tên sản phẩm:</label>
      <input type="text" v-model="newOrder.description" id="product-name" placeholder="Nhập tên sản phẩm" />
    </div>
    <div>
      <label for="product-quantity">Số lượng:</label>
      <input type="number" v-model="newOrder.quantity" id="product-quantity" min="1" />
    </div>
    <div>
      <label for="product-price">Giá:</label>
      <input type="number" v-model="newOrder.price" id="product-price" min="1" />
    </div>
    <button @click="addOrder">Thêm vào đơn hàng</button>
    
    <div v-if="newOrder.items.length > 0">
      <h3>Sản phẩm trong đơn hàng:</h3>
      <ul>
        <li v-for="item in newOrder.items" :key="item.id">
          <span>{{ item.description }} - {{ item.quantity }} x {{ item.price | currency }}</span>
        </li>
      </ul>
      <p><strong>Tổng tiền: </strong> {{ totalAmount | currency }}</p>
    </div>

    <button @click="saveOrder">Lưu đơn hàng</button>
  </div>
</template>


<script>
export default {
  data() {
    return {
      newOrder: {
        description: '',
        quantity: 1,
        price: 0,
        items: []
      }
    };
  },
  computed: {
    // Tính tổng số tiền của đơn hàng
    totalAmount() {
      return this.newOrder.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }
  },
  methods: {
    addOrder() {
      if (this.newOrder.description && this.newOrder.quantity > 0 && this.newOrder.price > 0) {
        const newItem = {
          id: Date.now(),
          description: this.newOrder.description,
          quantity: this.newOrder.quantity,
          price: this.newOrder.price
        };
        this.newOrder.items.push(newItem);
        this.newOrder.description = '';
        this.newOrder.quantity = 1;
        this.newOrder.price = 0;
      } else {
        alert("Vui lòng nhập đầy đủ thông tin sản phẩm.");
      }
    },
    saveOrder() {
      if (this.newOrder.items.length > 0) {
        const newOrder = {
          id: Date.now(),
          date: new Date().toLocaleDateString(),
          totalAmount: this.totalAmount,
          items: [...this.newOrder.items]
        };

        // Lưu đơn hàng vào localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
        savedOrders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(savedOrders));

        // Reset giỏ hàng sau khi lưu đơn hàng
        this.newOrder = {
          description: '',
          quantity: 1,
          price: 0,
          items: []
        };

        // Chuyển hướng đến trang lịch sử đơn hàng
        this.$router.push('/order-history'); // Chuyển hướng đến trang lịch sử đơn hàng
      } else {
        alert("Đơn hàng phải có ít nhất một sản phẩm.");
      }
    }
  }
};
</script>

<style scoped>
.order-form {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
}
.order-form input {
  margin-bottom: 10px;
}
.order-form button {
  margin-top: 10px;
}
</style>

  
  <style scoped>
  .order-form {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ddd;
  }
  .order-form input {
    margin-bottom: 10px;
  }
  .order-form button {
    margin-top: 10px;
  }
  </style>
  