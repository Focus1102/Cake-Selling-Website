<template>
  <footer class="main-footer">
    <div class="footer-container">
      <div class="footer-section logo-section">
        <img
          :src="require('@/assets/logo.png')"
          alt="Logo"
          class="footer-logo"
        />
      </div>
      <div class="footer-section contact-section">
        <h3>Thông tin liên hệ</h3>
        <ul class="contact-info">
          <li><i class="fa fa-map-marker"></i> 371 Nguyễn Kiệm, Gò Vấp</li>
          <li><i class="fa fa-phone"></i> 0985518643</li>
          <li><i class="fa fa-envelope"></i> nam.vuphanhoai@gmail.com</li>
        </ul>
      </div>
      <div class="footer-section product-section">
        <h3>Về chúng tôi</h3>
        <ul>
          <p style="color: aliceblue">
            Chuyên cung cấp bánh kem chất lượng cao, đảm bảo hương vị thơm ngon tuyệt đối.
            Uy tín hàng đầu, giao hàng nhanh chóng và chăm sóc khách hàng tận tâm suốt 24/7.
          </p>
        </ul>
      </div>
      <div class="footer-section newsletter-section">
        <h3>Nhận thông tin từ chúng tôi</h3>
        <form @submit.prevent="subscribeToNewsletter">
          <input
            type="email"
            v-model="email"
            placeholder="Email của bạn"
            required
          />
          <button type="submit" class="subscribe-btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'Đang gửi...' : 'Gửi' }}
          </button>
          <div v-if="message" :class="['message', messageType]">
            {{ message }}
          </div>
        </form>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      isSubmitting: false,
      message: "",
      messageType: "success"
    };
  },
  methods: {
    async subscribeToNewsletter() {
      if (!this.email) return;
      
      this.isSubmitting = true;
      this.message = "";
      
      try {
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
          throw new Error('Email không hợp lệ');
        }
        
        // Giả lập thời gian xử lý
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Hiển thị thông báo thành công
        this.message = "Cảm ơn bạn đã đăng ký nhận tin!";
        this.messageType = "success";
        this.email = "";
        
        // Tự động ẩn thông báo sau 3 giây
        setTimeout(() => {
          this.message = "";
        }, 3000);
        
      } catch (error) {
        this.message = error.message || 'Có lỗi xảy ra, vui lòng thử lại sau.';
        this.messageType = "error";
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.main-footer {
  background: linear-gradient(to right, #11a442, #1dae5c, #21b521);
  color: #ffffff;
  padding: 20px 20px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
}

.footer-section {
  flex: 1;
  min-width: 180px;
}

.footer-logo {
  height: 170px;
  margin-bottom: 30px;
  border-radius: 50px;
}

.footer-section h3 {
  color: #fcb034;
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: bold;
}

.contact-info {
  list-style: none;
  padding: 0;
}

.contact-info li {
  margin: 5px 0;
  font-size: 16px;
}

.contact-info i {
  margin-right: 10px;
  color: #fcb034;
}

.product-section ul {
  list-style: none;
  padding: 0;
}

.product-section ul li {
  margin: 5px 0;
}

.product-section ul li a {
  color: #ffffff;
  text-decoration: none;
  font-weight: bold;
}

.product-section ul li a:hover {
  color: #fcb034;
}

.newsletter-section form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.newsletter-section input[type="email"] {
  padding: 8px;
  border-radius: 5px;
  border: none;
  outline: none;
}

.newsletter-section .subscribe-btn {
  padding: 8px;
  background-color: #fcb034;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.newsletter-section .subscribe-btn:hover {
  background-color: #ffa726;
}

.newsletter-section .subscribe-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.message {
  font-size: 14px;
  padding: 8px;
  border-radius: 4px;
  text-align: center;
}

.message.success {
  background-color: rgba(40, 167, 69, 0.2);
  color: #28a745;
}

.message.error {
  background-color: rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

.footer-bottom {
  margin-top: 10px;
  text-align: center;
  border-top: 1px solid #ffffff;
  padding-top: 10px;
  color: #ccc;
  font-size: 14px;
}
</style>
