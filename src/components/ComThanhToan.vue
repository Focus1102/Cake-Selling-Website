<template>
  <div class="checkout-container">
    <div v-if="isCheckoutComplete" class="checkout-complete">
      <h2>Cảm ơn bạn đã mua sắm!</h2>
      <p><strong>Tên người nhận:</strong> {{ recipientName }}</p>
      <p><strong>Số điện thoại:</strong> {{ phoneNumber }}</p>
      <p><strong>Địa chỉ:</strong> {{ address }}</p>
      <p><strong>Phương thức thanh toán:</strong> {{ paymentMethodText }}</p>
      <h3>Sản phẩm bạn đã thanh toán:</h3>
      <ul class="purchased-items">
        <li v-for="item in purchasedItems" :key="item._id">
          {{ item.name }} - Màu: {{ item.color }} - Kích thước:
          {{ item.size }} - Số lượng: {{ item.quantity }} - Giá:
          {{ formatPrice(item.price * item.quantity) }}
        </li>
      </ul>
      <button class="btn btn-continue-shopping" @click="continueShopping">
        Tiếp tục mua sắm
      </button>
      <button class="btn btn-go-home" @click="goHome">
        Quay lại trang chủ
      </button>
    </div>
    <div v-else>
      <h2>Thông tin thanh toán</h2>
      <ul class="cart-items">
        <li v-for="item in selectedItems" :key="item._id">
          {{ item.name }} - Màu: {{ item.color }} - Kích thước:
          {{ item.size }} - Số lượng: {{ item.quantity }} - Giá:
          {{ formatPrice(item.price * item.quantity) }}
        </li>
      </ul>
      <form @submit.prevent="submitCheckout">
        <div class="form-group">
          <label for="recipientName">Tên người nhận:</label>
          <input
            type="text"
            id="recipientName"
            v-model="recipientName"
            required
          />
        </div>
        <div class="form-group">
          <label for="phoneNumber">Số điện thoại:</label>
          <input
            type="tel"
            id="phoneNumber"
            v-model="phoneNumber"
            required
            pattern="^\d{10}$"
            title="Số điện thoại phải chứa đúng 10 chữ số."
          />
        </div>
        <div class="form-group">
          <label for="address">Địa chỉ:</label>
          <textarea id="address" v-model="address" rows="3" required></textarea>
        </div>
        <div class="form-group">
          <label for="paymentMethod">Phương thức thanh toán:</label>
          <select id="paymentMethod" v-model="paymentMethod" required>
            <option value="credit_card">Thẻ tín dụng</option>
            <option value="cash_on_delivery">Thanh toán khi nhận hàng</option>
            <option value="bank_transfer">Chuyển khoản ngân hàng</option>
          </select>
        </div>
        <button type="submit" class="btn btn-submit">Thanh toán</button>
        <button type="button" class="btn btn-cancel" @click="goBackToCart">
          Quay lại giỏ hàng
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      recipientName: "",
      phoneNumber: "",
      address: "",
      paymentMethod: "",
      isCheckoutComplete: false,
      purchasedItems: [],
      selectedItems: [],
    };
  },
  computed: {
    totalAmount() {
      return this.selectedItems.reduce(
        (total, item) => total + (item.price || 0) * item.quantity,
        0
      );
    },
    paymentMethodText() {
      return this.getPaymentMethodText();
    },
  },
  created() {
    this.selectedItems =
      JSON.parse(localStorage.getItem("selectedItems")) || [];
    console.log("Selected items on load:", this.selectedItems);
    // Đảm bảo productId là chuỗi
    this.selectedItems = this.selectedItems.map((item) => ({
      ...item,
      productId:
        item.productId && typeof item.productId === "object"
          ? item.productId._id || item.productId.toString()
          : item.productId,
    }));
  },
  methods: {
    formatPrice(price) {
      if (!price || isNaN(price)) return "Không xác định";
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },
    getPaymentMethodText() {
      switch (this.paymentMethod) {
        case "credit_card":
          return "Thẻ tín dụng";
        case "cash_on_delivery":
          return "Thanh toán khi nhận hàng";
        case "bank_transfer":
          return "Chuyển khoản ngân hàng";
        default:
          return "Không rõ";
      }
    },
    async submitCheckout() {
      if (this.selectedItems.length === 0) {
        alert("Bạn chưa chọn sản phẩm để thanh toán!");
        return;
      }

      const totalAmount = this.selectedItems.reduce(
        (total, item) => total + (item.price || 0) * item.quantity,
        0
      );

      if (totalAmount === 0) {
        alert("Không thể thanh toán với giỏ hàng trống");
        return;
      }

      const currentUser = this.$store.getters["auth/currentUser"];
      if (!currentUser) {
        alert("Vui lòng đăng nhập để thanh toán");
        this.$router.push("/login");
        return;
      }

      // Chuẩn bị dữ liệu đơn hàng
      const orderItems = this.selectedItems.map((item) => {
        // Đảm bảo productId là chuỗi hợp lệ
        let productId = item.productId;
        if (typeof productId === "object" && productId !== null) {
          productId = productId._id || productId.toString();
        }
        
        return {
          productId: productId,
          name: item.name,
          color: item.color || "N/A",
          size: item.size || "N/A",
          quantity: item.quantity,
          price: item.price,
        };
      });

      const order = {
        userId: currentUser._id,
        date: new Date().toISOString(),
        recipientName: this.recipientName,
        recipientAddress: this.address,
        phoneNumber: this.phoneNumber,
        items: orderItems,
        totalAmount,
        paymentMethod: this.paymentMethod, // Gửi mã phương thức thanh toán thay vì text
      };

      try {
        console.log("Sending order to backend:", order);
        const response = await axios.post(
          "http://localhost:5001/users/orders",
          order,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Order created:", response.data);

        // Cập nhật số lượng đã bán cho từng sản phẩm
        for (const item of this.selectedItems) {
          const productId = typeof item.productId === "object" ? 
            (item.productId._id || item.productId.toString()) : 
            item.productId;
            
          console.log(`Updating sold for product ${productId}:`, item.quantity);
          
          try {
            await axios.put(
              `http://localhost:5001/products/${productId}/updateSold`,
              { quantitySold: item.quantity },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
          } catch (error) {
            console.error(`Error updating sold count for product ${productId}:`, error);
          }
        }

        // Xóa các sản phẩm đã thanh toán khỏi giỏ hàng
        for (const item of this.selectedItems) {
          await this.$store.dispatch("cart/removeFromCart", item.variantId);
        }

        // Cập nhật lịch sử thanh toán
        await this.$store.dispatch("paymentHistory/fetchPaymentHistory");

        this.purchasedItems = [...this.selectedItems];
        this.isCheckoutComplete = true;
        localStorage.removeItem("selectedItems");
      } catch (error) {
        console.error("Error during checkout:", error);
        if (error.response) {
          if (error.response.status === 500) {
            alert("Lỗi server. Vui lòng thử lại sau hoặc liên hệ admin.");
            console.log("Server response:", error.response.data);
          } else if (error.response.status === 404) {
            alert("Endpoint không tồn tại. Vui lòng kiểm tra backend.");
          } else if (error.response.status === 401) {
            alert("Token không hợp lệ. Vui lòng đăng nhập lại.");
            this.$router.push("/login");
          } else {
            alert(
              `Có lỗi xảy ra: ${error.response.data.message || error.message}`
            );
          }
        } else {
          alert("Lỗi kết nối mạng. Vui lòng thử lại!");
        }
      }
    },
    goBackToCart() {
      this.$router.push("/cart");
    },
    continueShopping() {
      this.$router.push("/sanpham");
    },
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.checkout-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
  font-weight: bold;
}

.cart-items,
.purchased-items {
  list-style-type: none;
  padding: 0;
  text-align: left;
}

.cart-items li,
.purchased-items li {
  margin: 10px 0;
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}

input[type="text"],
input[type="tel"],
textarea,
select {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
input[type="tel"]:focus,
textarea:focus,
select:focus {
  border-color: #007bff;
  outline: none;
}

textarea {
  resize: vertical;
}

.btn {
  display: block;
  width: 100%;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-submit {
  background-color: #28a745;
}

.btn-submit:hover {
  background-color: #218838;
  transform: scale(1.03);
}

.btn-cancel {
  background-color: #d9534f;
}

.btn-cancel:hover {
  background-color: #c9302c;
  transform: scale(1.03);
}

.btn-continue-shopping {
  background-color: #007bff;
}

.btn-continue-shopping:hover {
  background-color: #0056b3;
  transform: scale(1.03);
}

.btn-go-home {
  background-color: #ffc107;
  color: #333;
}

.btn-go-home:hover {
  background-color: #e0a800;
  transform: scale(1.03);
}

.checkout-complete {
  text-align: left;
  padding: 25px;
  background-color: #e9f7ef;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}
</style>
