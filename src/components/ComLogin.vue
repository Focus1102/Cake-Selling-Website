<template>
  <div class="login-container">
    <h2 class="login-title">Đăng Nhập</h2>

    <form @submit.prevent="handleSubmit" class="login-form">
      <!-- Email -->
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          placeholder="admin@gmail.com"
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
          placeholder="Nhập mật khẩu"
        />
        <small v-if="errors.password" class="error-text">
          {{ errors.password }}
        </small>
      </div>

      <!-- Thông báo lỗi từ server (nếu có) -->
      <small v-if="errors.server" class="error-text">{{ errors.server }}</small>

      <!-- Nút đăng nhập -->
      <button type="submit" class="btn-submit" :disabled="isLoading">
        {{ isLoading ? "Đang xử lý..." : "Đăng Nhập" }}
      </button>
    </form>

    <!-- Link quên mật khẩu / đăng kí tài khoản -->
    <div class="helper-links">
      <router-link to="/forgot" class="forgot-link">Quên mật khẩu</router-link>,
      <router-link to="/register" class="register-link"
        >Đăng kí tài khoản</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "ComLogin",
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
      errors: {},
    };
  },
  computed: {
    // Lấy trạng thái loading, errorMessage từ Vuex (auth module)
    isLoading() {
      return this.$store.getters["auth/isLoading"];
    },
    storeErrorMessage() {
      return this.$store.getters["auth/errorMessage"];
    },
  },
  methods: {
    async handleSubmit() {
      // Reset lỗi cũ
      this.errors = {};

      // Kiểm tra input
      if (!this.formData.email) {
        this.errors.email = "Vui lòng nhập email";
      } else if (!this.validateEmail(this.formData.email)) {
        this.errors.email = "Email không hợp lệ";
      }
      if (!this.formData.password) {
        this.errors.password = "Vui lòng nhập mật khẩu";
      }

      // Nếu có lỗi -> dừng
      if (Object.keys(this.errors).length > 0) {
        return;
      }

      // Dữ liệu hợp lệ -> Gửi request login qua Vuex
      const userData = {
        email: this.formData.email,
        password: this.formData.password,
      };
      try {
        // Gọi action login
        await this.$store.dispatch("auth/login", userData);

        // Nếu trong Vuex không có lỗi
        if (!this.storeErrorMessage) {
          // Thông báo (nếu có vue-toastification)
          if (this.$toast) {
            this.$toast.success("Đăng nhập thành công!");
          } else {
            alert("Đăng nhập thành công!");
          }
          // Chuyển về trang chủ
          this.$router.push("/");
        } else {
          // Có lỗi từ Vuex
          this.errors.server = this.storeErrorMessage;
          if (this.$toast) {
            this.$toast.error(this.errors.server);
          } else {
            alert(this.errors.server);
          }
        }
      } catch (error) {
        // Bắt lỗi nếu dispatch ném ra error
        console.error("Lỗi đăng nhập:", error);
        this.errors.server = this.storeErrorMessage || "Đăng nhập thất bại!";
        if (this.$toast) {
          this.$toast.error(this.errors.server);
        } else {
          alert(this.errors.server);
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
.login-container {
  max-width: 600px;
  width: 30%;
  margin: 80px auto;
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.login-form {
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

/* Nút đăng nhập */
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
.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Link quên mật khẩu / đăng kí */
.helper-links {
  color: #555;
  font-size: 0.95em;
}
.helper-links .forgot-link,
.helper-links .register-link {
  color: #fcb034;
  text-decoration: none;
  font-weight: bold;
  margin: 0 5px;
}
.helper-links .forgot-link:hover,
.helper-links .register-link:hover {
  color: #e89c2f;
  text-decoration: underline;
}
</style>
