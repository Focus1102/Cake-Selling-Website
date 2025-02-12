<template>
  <div class="login-form">
    <h2>Đăng nhập</h2>
    <input v-model="username" placeholder="Tên đăng nhập" />
    <input v-model="password" type="password" placeholder="Mật khẩu" />
    <button @click="login">Đăng nhập</button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import eventBus from '@/eventBus';
import users from '@/data/users';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: '',
      users: users
    };
  },
  methods: {
    login() {
      const user = this.users.find(
        x => x.username === this.username && x.password === this.password
      );
      if (user) {
        // lưu người dùng vào localStorage nếu đăng nhập thành công
        localStorage.setItem('currentUser', JSON.stringify(user));
        eventBus.emit('loginSuccess', user); // phát tín hiệu truyền đi
        this.$router.push('/');
      } else {
        this.error = 'Tên đăng nhập hoặc mật khẩu không đúng';
      }
    }
  }
};
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
}

.login-form h2 {
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

/* Hiệu ứng chuyển động khi hiển thị lỗi */
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
