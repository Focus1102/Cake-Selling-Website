<template>
  <div class="admin-login">
    <div class="login-container">
      <div class="login-header">
        <img :src="require('@/assets/LOGO.jpg')" alt="Logo" class="logo" />
        <h2>Đăng Nhập Quản Trị</h2>
      </div>

      <div class="login-form">
        <div class="form-group">
          <label for="username">Tên đăng nhập</label>
          <div class="input-with-icon">
            <i class="fas fa-user"></i>
            <input
              type="text"
              id="username"
              v-model="username"
              placeholder="Nhập tên đăng nhập"
              :class="{ error: errors.username }"
            />
          </div>
          <small v-if="errors.username" class="error-text">{{
            errors.username
          }}</small>
        </div>

        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <div class="input-with-icon">
            <i class="fas fa-lock"></i>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              placeholder="Nhập mật khẩu"
              :class="{ error: errors.password }"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <small v-if="errors.password" class="error-text">{{
            errors.password
          }}</small>
        </div>

        <div class="form-group remember-me">
          <label class="checkbox-container">
            <input type="checkbox" v-model="rememberMe" />
            <span class="checkmark"></span>
            Ghi nhớ đăng nhập
          </label>
          <a href="#" class="forgot-password">Quên mật khẩu?</a>
        </div>

        <div class="form-group">
          <button class="login-button" :disabled="isLoading" @click="login">
            <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
            <span v-else>Đăng nhập</span>
          </button>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "admin-login",
  data() {
    return {
      username: "",
      password: "",
      rememberMe: false,
      showPassword: false,
      isLoading: false,
      errorMessage: "",
      errors: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.errors = {
        username: "",
        password: "",
      };

      if (!this.username.trim()) {
        this.errors.username = "Vui lòng nhập tên đăng nhập";
        isValid = false;
      }

      if (!this.password) {
        this.errors.password = "Vui lòng nhập mật khẩu";
        isValid = false;
      }

      return isValid;
    },

    async login() {
      if (!this.validateForm()) return;

      this.isLoading = true;
      this.errorMessage = "";

      try {
        console.log("Đang thử đăng nhập với:", {
          username: this.username,
          password: "******",
        });

        // Gọi API đăng nhập admin
        const response = await fetch("http://localhost:5001/api/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        // Ghi log thông tin phản hồi
        console.log("Phản hồi API:", {
          status: response.status,
          statusText: response.statusText,
        });

        // Debug mode - Trường hợp API có vấn đề trong môi trường phát triển
        if (process.env.NODE_ENV === "development" && !response.ok) {
          console.warn(
            "Đang sử dụng chế độ fallback cho môi trường phát triển"
          );
          // Kiểm tra tạm thời trong quá trình phát triển
          if (this.username === "admin" && this.password === "admin123") {
            // Lưu trạng thái đăng nhập vào localStorage
            localStorage.setItem("admin_token", "admin_sample_token");
            localStorage.setItem(
              "admin_user",
              JSON.stringify({
                username: this.username,
                name: "Admin",
                role: "administrator",
              })
            );

            // Nếu người dùng chọn "Ghi nhớ đăng nhập", thì sẽ lưu thông tin đăng nhập
            if (this.rememberMe) {
              localStorage.setItem("admin_remember", "true");
              localStorage.setItem("admin_username", this.username);
            } else {
              localStorage.removeItem("admin_remember");
              localStorage.removeItem("admin_username");
            }

            // Chuyển hướng đến trang admin
            this.$router.push("/admin");
            return;
          } else {
            throw new Error("Tên đăng nhập hoặc mật khẩu không chính xác");
          }
        }

        const result = await response.json().catch((e) => {
          console.error("Lỗi khi parse JSON:", e);
          return { success: false, message: "Lỗi kết nối server" };
        });

        console.log("Dữ liệu phản hồi:", result);

        if (response.ok && result.success) {
          // Lưu token và thông tin người dùng vào localStorage
          localStorage.setItem("admin_token", result.data.token);
          localStorage.setItem("admin_user", JSON.stringify(result.data.user));

          // Nếu người dùng chọn "Ghi nhớ đăng nhập", thì sẽ lưu thông tin đăng nhập
          if (this.rememberMe) {
            localStorage.setItem("admin_remember", "true");
            localStorage.setItem("admin_username", this.username);
          } else {
            localStorage.removeItem("admin_remember");
            localStorage.removeItem("admin_username");
          }

          // Chuyển hướng đến trang admin
          this.$router.push("/admin");
        } else {
          this.errorMessage = result.message || "Đăng nhập không thành công";
        }
      } catch (error) {
        console.error("Error during login:", error);
        this.errorMessage =
          error.message || "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a2238, #394867);
}

.login-container {
  width: 400px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 40px 30px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
}

.login-header h2 {
  color: #333;
  font-size: 24px;
  margin: 0;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  color: #555;
  margin-bottom: 8px;
  font-weight: 500;
}

.input-with-icon {
  position: relative;
}

.input-with-icon i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
}

.input-with-icon input {
  width: 90%;
  padding: 12px 15px 12px 45px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.input-with-icon input:focus {
  border-color: #4a90e2;
  outline: none;
}

.input-with-icon input.error {
  border-color: #e74c3c;
}

.error-text {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
}

.remember-me {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.checkbox-container input {
  margin-right: 8px;
}

.forgot-password {
  color: #4a90e2;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #3a7bd5;
}

.login-button:disabled {
  background-color: #95beeb;
  cursor: not-allowed;
}

.error-message {
  text-align: center;
  color: #e74c3c;
  margin-top: 15px;
  padding: 10px;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 5px;
}

@media (max-width: 768px) {
  .login-container {
    width: 90%;
    max-width: 400px;
    padding: 30px 20px;
  }
}
</style>
