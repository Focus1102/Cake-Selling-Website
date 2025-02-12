<template>
  <div class="register-form">
    <h2>Đăng ký tài khoản</h2>
    <input v-model="username" placeholder="Tên đăng nhập" />
    <input v-model="password" type="password" placeholder="Mật khẩu" />
    <input
      v-model="confirmPassword"
      type="password"
      placeholder="Xác nhận mật khẩu"
    />
    <button @click="register">Đăng ký</button>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>

<script>
import users from '@/data/users';

export default {
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      error: "",
      success: "",
      users: users
    };
  },
  methods: {
    register() {
      // kiểm tra mật khẩu và xác nhận
      if (this.password !== this.confirmPassword) {
        this.error = 'Mật khẩu và xác nhận mật khẩu không trùng khớp';
        return;
      }

      // lấy danh sách người dùng từ localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];

      // kiểm tra tên đã tồn tại chưa
      const existingUser = this.users.find(user => user.username === this.username);
      if (existingUser) {
        this.error = 'Tên đăng nhập đã tồn tại';
        return;
      }

      // tạo người dùng mới và thêm vào danh sách mới
      const newUser = { id: this.users.length + 1, username: this.username, password: this.password };
      this.users.push(newUser);

      // lưu lại danh sách người dùng từ localStorage
      localStorage.setItem('users', JSON.stringify(users));

      // đặt thông báo đăng ký thành công và reset các trường
      this.success = 'Đăng ký thành công!';
      this.error = '';
      this.username = '';
      this.password = '';
      this.confirmPassword = '';

      // chuyển hướng đến trang đăng nhập
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 10px;
  background-color: #f5f5f5;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
}

.register-form h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

input {
  margin-bottom: 15px;
  padding: 12px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

button {
  padding: 12px;
  width: 100%;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.02);
}

button:active {
  transform: scale(0.98);
}

.error {
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
  animation: shake 0.3s ease-in-out;
}

.success {
  color: #2ecc71;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
  animation: fadeIn 0.5s ease-in-out;
}

/* Hiệu ứng rung khi hiển thị lỗi */
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

/* Hiệu ứng chuyển động khi tải trang */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
