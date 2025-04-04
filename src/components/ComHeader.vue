<template>
  <header class="main-header">
    <div class="header-container">
      <!-- Nút icon menu (3 gạch) -->
      <div class="menu-icon" @click="toggleCategoryMenu">
        <i class="fa-solid fa-bars"></i>
      </div>

      <!-- Social icons -->
      <div class="social-icons">
        <a
          href="https://www.facebook.com/vermouth.1102"
          target="_blank"
          class="social-icon"
        >
          <i class="fab fa-facebook-f"></i>
        </a>
        <a
          href="http://www.youtube.com/@Calm1102"
          target="_blank"
          class="social-icon"
        >
          <i class="fab fa-youtube"></i>
        </a>
        <a
          href="https://www.instagram.com/namvph/"
          target="_blank"
          class="social-icon"
          ><i class="fab fa-instagram"></i
        ></a>
      </div>

      <!-- Logo -->
      <div class="logo">
        <router-link to="/">
          <img :src="require('@/assets/logo.png')" alt="Logo" />
        </router-link>
      </div>

      <!-- Navigation chính -->
      <nav>
        <ul class="menu">
          <li><router-link to="/">TRANG CHỦ</router-link></li>
          <li><router-link to="/sanpham">SẢN PHẨM</router-link></li>
          <li><router-link to="/gioithieu">GIỚI THIỆU</router-link></li>
          <li><router-link to="/lienhe">LIÊN HỆ</router-link></li>
          <!-- <li><router-link to="/tintuc">TIN TỨC</router-link></li> -->
          <li><router-link to="/lichsuthanhtoan">LỊCH SỬ THANH TOÁN</router-link></li>
        </ul>
      </nav>

      <!-- Phần action: user, login, cart... -->
      <div class="header-actions">
        <!-- Nếu đã đăng nhập => hiển thị user-info -->
        <div v-if="isAuthenticated" class="user-info">
          <span class="username-text">
            <i class="fa-solid fa-circle-user fa-2x"></i>
            {{ currentUser.fullname || currentUser.username || "Người dùng" }}
          </span>
          <button @click="logout" class="btn-logout">Đăng xuất</button>
        </div>

        <!-- Nếu chưa đăng nhập => hiển thị Đăng Nhập, Đăng Kí -->
        <div v-else class="auth-links">
          <router-link to="/login" class="login-link">Đăng Nhập</router-link>
          <router-link to="/register" class="register-link"
            >Đăng Ký</router-link
          >
        </div>

        <!-- Icon tìm kiếm, giỏ hàng (có badge cartCount) -->
        <div class="header-icons">
          <router-link to="/search" class="icon search-icon">
            <i class="fa fa-search"></i>
          </router-link>
          <router-link to="/cart" class="icon cart-icon">
            <i class="fa fa-shopping-cart"></i>
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </header>

  <!-- Overlay mờ toàn màn hình (hiện khi showCategoryMenu = true) -->
  <div
    v-if="showCategoryMenu"
    class="overlay"
    @click="toggleCategoryMenu"
  ></div>

  <!-- Sidebar danh mục (slide-in từ bên trái) -->
  <div :class="['category-menu-container', { open: showCategoryMenu }]">
    <div class="menu-header">
      <h3>Danh Mục</h3>
      <!-- Nút đóng sidebar -->
      <button class="close-btn" @click="toggleCategoryMenu">×</button>
    </div>
    <ul class="category-menu">
      <li><router-link to="/sanpham/banhkem">Menu</router-link></li>
      <li><router-link to="/sanpham/cake">Sweetbox</router-link></li>
      <li><router-link to="/sanpham/banhmouse">Bánh Mouse</router-link></li>
      <li><router-link to="/sanpham/banhkembap">Bánh Kem Bắp</router-link></li>
      <li><router-link to="/sanpham/banhentremet">Bánh Entremet</router-link></li>
      <li><router-link to="/sanpham/banhflangato">Bánh Flan Gato</router-link></li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      showCategoryMenu: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated", "currentUser"]), // Ensure these are mapped correctly
    ...mapGetters("cart", ["cartCount"]), // Lấy số lượng sản phẩm trong giỏ (nếu cartCount có)
  },
  created() {
    this.$store.dispatch("auth/checkAuth").then((isAuthenticated) => {
      if (!isAuthenticated) {
        console.warn("Người dùng chưa đăng nhập hoặc token không hợp lệ."); // Log cảnh báo
      }
    });
  },
  methods: {
    toggleCategoryMenu() {
      this.showCategoryMenu = !this.showCategoryMenu;
    },
    logout() {
      this.$store.dispatch("auth/logout");
      // Nếu có vue-toastification
      if (this.$toast) {
        this.$toast.success("Đăng xuất thành công!");
      }
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.username-text {
  font-size: 15px;
  font-weight: bold;
  display: flex;
  align-items: center;
  color: #0e9daa;
}
.fa-solid {
  margin-right: 7px;
}

/* Header cố định */
.main-header {
  background: linear-gradient(to right, #11a442, #1dae5c, #e4eae4);
  color: #000000;
  padding: 30px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed; /* Ghim header ở đầu trang */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  height: 6.55vh; /* Chiều cao tuỳ ý */
}

.header-container {
  max-width: 1400px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Nút icon 3 gạch */
.menu-icon {
  margin-right: 30px;
  font-size: 30px;
  cursor: pointer;
}
.menu-icon:hover {
  color: #4111c3;
}

/* Social icons */
.social-icons {
  display: flex;
  gap: 15px;
  padding-right: 20px;
}
.social-icon {
  color: #0a0a0a;
  font-size: 18px;
  text-decoration: none;
  transition: color 0.3s;
}
.social-icon:hover {
  color: #2311e2;
}

/* Logo */
.logo img {
  height: 75px;
  margin-right: 30px;
  border-radius: 60px;
}

/* Menu chính */
nav {
  flex: 1;
}
.menu {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}
.menu li a {
  color: #131212;
  font-size: 20px;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}
.menu li a:hover {
  color: #452abd;
}

/* Khu vực user/login/cart */
.header-actions {
  display: flex;
  align-items: center;
  gap: 25px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #000000;
}
.btn-logout {
  background-color: #0e9daa;
  color: #ffffff;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.btn-logout:hover {
  background-color: #ffa726;
}
.auth-links {
  display: flex;
  gap: 15px;
}
.auth-links .login-link,
.auth-links .register-link {
  text-decoration: none;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 5px;
  transition: all 0.3s;
  color: #eae1e1;
  background-color: #0e9daa;
}
.auth-links .login-link:hover,
.auth-links .register-link:hover {
  background-color: #ffa726;
  color: #ffffff;
}

/* Icon tìm kiếm, giỏ hàng */
.header-icons {
  display: flex;
  align-items: center;
  gap: 15px;
}
.icon {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 50%;
  text-decoration: none;
  color: #0f3460;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}
.icon:hover {
  background-color: #fcb034;
}
.cart-icon {
  background-color: #0e9daa;
  color: #ffffff;
  position: relative;
}
.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff0000;
  color: #fff;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
}

/* Overlay khi sidebar mở */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

/* Sidebar danh mục */
.category-menu-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 999;
  display: flex;
  flex-direction: column;
}
.category-menu-container.open {
  transform: translateX(0);
}
.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #64275f;
  color: #fff;
}
.menu-header h3 {
  margin: 0;
  font-size: 1.2rem;
}
.close-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Danh sách danh mục */
.category-menu {
  list-style: none;
  margin: 0;
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
}
.category-menu li {
  margin-bottom: 0.75rem;
}
.category-menu li a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.category-menu li a:hover {
  background-color: #f2f2f2;
}

/* Responsive design */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 10px;
  }
  .menu {
    flex-direction: column;
    gap: 10px;
  }
  .header-actions {
    flex-direction: column;
    gap: 10px;
  }
  .social-icons {
    justify-content: center;
  }
}
</style>
