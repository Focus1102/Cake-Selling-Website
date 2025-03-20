<template>
  <div class="forgot-container">
    <h2 class="forgot-title">Quên Mật Khẩu</h2>

    <form @submit.prevent="handleSubmit" class="forgot-form">
      <div class="form-group">
        <label for="email">Email đăng kí</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Nhập email đăng kí tài khoản"
        />
        <small v-if="error" class="error-text">{{ error }}</small>
      </div>

      <button type="submit" class="btn-submit">Quên Mật Khẩu</button>
    </form>

    <p class="back-link">
      Quay lại trang
      <router-link to="/login">đăng nhập</router-link>
    </p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ComForgot",
  data() {
    return {
      email: "",
      error: null,
    };
  },
  methods: {
    async handleSubmit() {
      // Xoá lỗi cũ
      this.error = null;

      // Kiểm tra email
      if (!this.email) {
        this.error = "Vui lòng nhập email";
        return;
      } else if (!this.validateEmail(this.email)) {
        this.error = "Email không hợp lệ";
        return;
      }

      try {
        // Gọi API POST /forgot
        const res = await axios.post("http://localhost:5001/forgot", {
          email: this.email,
        });
        console.log("Quên mật khẩu:", res.data);

        // Thông báo, chuyển hướng
        alert(
          "Nếu email tồn tại, chúng tôi đã gửi liên kết khôi phục mật khẩu!"
        );
        this.$router.push("/login");
      } catch (error) {
        console.error("Lỗi quên mật khẩu:", error);

        // Giả sử server trả về 404 nếu email không tồn tại
        if (error.response && error.response.status === 404) {
          this.error = "Email không tồn tại trong hệ thống";
        } else {
          this.error = "Đã có lỗi xảy ra. Vui lòng thử lại sau.";
        }
      }
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
  },
};
</script>

<style scoped>
.forgot-container {
  max-width: 600px;
  width: 30%;
  margin: 80px auto;
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.forgot-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.forgot-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
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
.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.3s;
}
.form-group input:focus {
  border-color: #fcb034;
}

.error-text {
  color: red;
  font-size: 0.85em;
  margin-top: 5px;
}

/* Nút quên mật khẩu */
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

/* Link quay lại đăng nhập */
.back-link {
  margin-top: 20px;
  color: #555;
}
.back-link a {
  color: #fcb034;
  text-decoration: none;
  font-weight: bold;
}
.back-link a:hover {
  color: #e89c2f;
  text-decoration: underline;
}
</style>
