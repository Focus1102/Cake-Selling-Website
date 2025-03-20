<template>
  <div class="page-container">
    <h1>Liên Hệ</h1>
    <p>
      Đây là trang liên hệ của chúng tôi. Bạn có thể liên lạc qua email hoặc
      điện thoại theo thông tin bên dưới.
    </p>
    <ul class="contact-info">
      <li><strong>Email:</strong> nam.vuphanhoai@gmail.com</li>
      <li><strong>Điện thoại:</strong> 0985518643</li>
      <li><strong>Địa chỉ:</strong> 371 Nguyễn Kiệm, Gò Vấp</li>
    </ul>

    <!-- Thêm form liên hệ -->
    <div class="contact-form">
      <h2>Gửi Tin Nhắn Cho Chúng Tôi</h2>
      <form @submit.prevent="submitContactForm" id="contact-form">
        <div class="form-group">
          <label for="name">Tên của bạn</label>
          <input type="text" id="name" v-model="name" required />
        </div>

        <div class="form-group">
          <label for="email">Email của bạn</label>
          <input type="email" id="email" v-model="email" required />
        </div>

        <div class="form-group">
          <label for="message">Nội dung</label>
          <textarea id="message" v-model="message" rows="5" required></textarea>
        </div>

        <button type="submit" class="btn btn-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Đang gửi...' : 'Gửi Liên Hệ' }}
        </button>
      </form>
      
      <!-- Hiển thị thông báo -->
      <div v-if="submitStatus" :class="['submit-status', submitStatus.type]">
        {{ submitStatus.message }}
        <div v-if="submitStatus.error" class="error-details">
          Chi tiết lỗi: {{ submitStatus.error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "ComLienHe",
  data() {
    return {
      name: "",
      email: "",
      message: "",
      isSubmitting: false,
      submitStatus: null,
      apiUrl: 'http://localhost:5001/emails/send'
    };
  },
  methods: {
    async submitContactForm() {
      // Kiểm tra form
      if (!this.name || !this.email || !this.message) {
        this.submitStatus = {
          type: 'error',
          message: 'Vui lòng điền đầy đủ thông tin'
        };
        return;
      }

      this.isSubmitting = true;
      this.submitStatus = {
        type: 'info',
        message: 'Đang gửi email, vui lòng đợi...'
      };

      try {
        // Gửi request đến API server
        const response = await axios.post(this.apiUrl, {
          name: this.name,
          email: this.email,
          message: this.message
        });

        // Xử lý phản hồi thành công
        if (response.data.success) {
          this.submitStatus = {
            type: 'success',
            message: `Cảm ơn ${this.name}! Email của bạn đã được gửi thành công. Chúng tôi sẽ liên lạc với bạn sớm nhất có thể.`
          };
          
          // Reset form
          this.name = "";
          this.email = "";
          this.message = "";
        } else {
          throw new Error(response.data.message || 'Có lỗi xảy ra');
        }
      } catch (error) {
        this.submitStatus = {
          type: 'error',
          message: 'Có lỗi xảy ra khi gửi liên hệ. Vui lòng thử lại sau.',
          error: error.response?.data?.error || error.message || 'Không có thông tin lỗi chi tiết'
        };
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
.page-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.page-container:hover {
  transform: translateY(-5px);
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #2c3e50;
}

p {
  font-size: 1.2em;
  color: #555;
  line-height: 1.5;
}

.contact-info {
  list-style: none;
  padding: 0;
  font-size: 1.1em;
  margin-top: 20px;
  color: #333;
}

.contact-info li {
  margin: 10px 0;
  font-weight: bold;
}

.contact-form {
  margin-top: 40px;
  text-align: left;
}

.contact-form h2 {
  text-align: center;
  font-size: 2em;
  color: #3498db;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

input[type="text"],
input[type="email"],
textarea {
  width: 100%;
  padding: 12px;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
input[type="email"]:focus,
textarea:focus {
  border-color: #3498db;
  outline: none;
}

textarea {
  resize: vertical;
}

.btn {
  display: block;
  width: 100%;
  padding: 12px;
  font-size: 1.2em;
  font-weight: bold;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-submit {
  background-color: #3498db;
}

.btn-submit:hover:not(:disabled) {
  background-color: #2980b9;
  transform: scale(1.03);
}

.btn-submit:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

/* Thêm CSS cho thông báo */
.submit-status {
  margin-top: 20px;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.error-details {
  margin-top: 10px;
  font-size: 0.9em;
  color: #721c24;
}
</style>
