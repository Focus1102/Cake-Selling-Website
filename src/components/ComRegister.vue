<template>
  <div class="register-container">
    <h2 class="register-title">Đăng Kí Tài Khoản</h2>

    <form @submit.prevent="handleSubmit" class="register-form">
      <!-- Họ và tên -->
      <div class="form-group">
        <label for="fullname">Họ Và Tên</label>
        <input
          type="text"
          id="fullname"
          v-model="formData.fullname"
          placeholder="Nhập họ và tên"
        />
        <small v-if="errors.fullname" class="error-text">
          {{ errors.fullname }}
        </small>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          placeholder="VD: admin@gmail.com"
        />
        <small v-if="errors.email" class="error-text">{{ errors.email }}</small>
      </div>

      <!-- Mật khẩu -->
      <div class="form-group">
        <label for="password">Mật Khẩu</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          placeholder="Mật Khẩu phải chứa ít nhất 1 chữ hoa (A-Z)"
        />
        <small v-if="errors.password" class="error-text">
          {{ errors.password }}
        </small>
      </div>

      <!-- Xác nhận mật khẩu -->
      <div class="form-group">
        <label for="confirmPassword">Xác Nhận Mật Khẩu</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="formData.confirmPassword"
          placeholder="Nhập lại mật khẩu"
        />
        <small v-if="errors.confirmPassword" class="error-text">
          {{ errors.confirmPassword }}
        </small>
      </div>

      <!-- Số điện thoại -->
      <div class="form-group">
        <label for="phone">Số Điện Thoại</label>
        <input
          type="tel"
          id="phone"
          v-model="formData.phone"
          placeholder="Nhập số điện thoại"
        />
        <small v-if="errors.phone" class="error-text">{{ errors.phone }}</small>
      </div>

      <!-- Nút đăng kí -->
      <button type="submit" class="btn-submit">Đăng Kí</button>
    </form>

    <p class="login-link">
      Bạn đã có tài khoản?
      <router-link to="/login">Đăng nhập</router-link>
    </p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ComRegister",
  data() {
    return {
      // Dữ liệu form
      formData: {
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
      },
      // Lưu lỗi validation
      errors: {},
    };
  },
  methods: {
    // Xử lý submit form
    async handleSubmit() {
      // Xoá lỗi cũ
      this.errors = {};

      // 1. Kiểm tra hợp lệ client-side
      if (!this.formData.fullname) {
        this.errors.fullname = "Vui lòng nhập họ và tên";
      }
      if (!this.formData.email) {
        this.errors.email = "Vui lòng nhập email";
      } else if (!this.validateEmail(this.formData.email)) {
        this.errors.email = "Email không hợp lệ";
      }
      if (!this.formData.password) {
        this.errors.password = "Vui lòng nhập mật khẩu";
      } else if (!/[A-Z]/.test(this.formData.password)) {
        this.errors.password = "Mật khẩu phải chứa ít nhất 1 chữ hoa (A-Z)";
      } else if (this.formData.password.length < 6) {
        this.errors.password = "Mật khẩu phải dài ít nhất 6 ký tự";
      }
      if (!this.formData.confirmPassword) {
        this.errors.confirmPassword = "Vui lòng nhập lại mật khẩu";
      } else if (this.formData.confirmPassword !== this.formData.password) {
        this.errors.confirmPassword = "Mật khẩu xác nhận không khớp";
      }
      if (!this.formData.phone) {
        this.errors.phone = "Vui lòng nhập số điện thoại";
      } else if (!/^(\d{9,11})$/.test(this.formData.phone)) {
        this.errors.phone = "Số điện thoại phải 9-11 chữ số";
      }

      // Nếu có lỗi -> dừng
      if (Object.keys(this.errors).length > 0) {
        return;
      }

      // 2. Dữ liệu hợp lệ -> gọi API lưu user
      const userData = {
        fullname: this.formData.fullname,
        email: this.formData.email,
        password: this.formData.password,
        phone: this.formData.phone,
      };

      try {
        // Gọi API để đăng ký
        console.log("Gửi dữ liệu đăng ký:", userData);
        const response = await axios.post(
          "http://localhost:5001/users/register",
          userData
        );
        
        console.log("Phản hồi từ server:", response.data);
        alert("Đăng ký tài khoản thành công!");
        // Chuyển sang trang đăng nhập với email đã đăng ký
        this.$router.push({
          path: "/login",
          query: { email: this.formData.email }
        });
      } catch (error) {
        // Xử lý lỗi API
        console.error("Chi tiết lỗi:", error);
        
        if (error.response) {
          // Lỗi từ phản hồi server
          console.error("Status:", error.response.status);
          console.error("Response data:", error.response.data);
          
          const errorMessage = error.response.data.message || "Đã xảy ra lỗi khi đăng ký";
          
          // Kiểm tra lỗi email đã tồn tại
          if (error.response.status === 400 && errorMessage.includes("email")) {
            this.errors.email = "Email đã tồn tại. Vui lòng sử dụng email khác.";
          } else if (error.response.status === 400 && errorMessage.includes("Mật khẩu")) {
            this.errors.password = errorMessage;
          } else {
            // Hiển thị thông báo lỗi chung
            alert(errorMessage);
          }
        } else if (error.request) {
          // Không nhận được phản hồi từ server
          console.error("Lỗi request:", error.request);
          alert("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
        } else {
          // Lỗi khác
          console.error("Lỗi:", error.message);
          alert("Đăng ký thất bại: " + error.message);
        }
      }
    },
    // Kiểm tra email
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
  },
};
</script>

<style scoped>
.register-container {
  max-width: 1000px;
  width: 30%;
  margin: 50px auto;
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.register-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #fcb034;
}

.error-text {
  color: red;
  font-size: 0.85em;
  margin-top: 5px;
}

/* Nút đăng kí */
.btn-submit {
  padding: 12px;
  background-color: #fcb034;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}
.btn-submit:hover {
  background-color: #e89c2f;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Link đăng nhập */
.login-link {
  margin-top: 20px;
  color: #555;
}
.login-link a {
  color: #fcb034;
  text-decoration: none;
  font-weight: bold;
}
.login-link a:hover {
  color: #e89c2f;
  text-decoration: underline;
}
</style>
