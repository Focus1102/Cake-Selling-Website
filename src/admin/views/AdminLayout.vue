<!-- src/views/admin/AdminLayout.vue -->
<template>
  <div class="admin-layout">
    <admin-sidebar />

    <div class="admin-content">
      <header class="admin-header">
        <div class="header-title">
          <button class="menu-toggle" @click="toggleSidebar">
            <i class="fas fa-bars"></i>
          </button>
          <h1>Trang Quản Trị</h1>
        </div>

        <div class="header-actions">
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Tìm kiếm..." />
          </div>

          <div class="notifications">
            <button class="icon-button">
              <i class="fas fa-bell"></i>
              <span class="badge">3</span>
            </button>
          </div>

          <div class="user-menu" ref="userMenu">
            <button class="user-button" @click="toggleUserMenu">
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=2196F3&color=fff"
                alt="Admin"
                class="user-avatar"
              />
              <span class="user-name">{{
                adminUser.name || adminUser.username || "Admin"
              }}</span>
              <i class="fas fa-chevron-down"></i>
            </button>

            <div class="user-dropdown" v-if="showUserMenu">
              <ul>
                <li><i class="fas fa-user"></i> Tài khoản</li>
                <li><i class="fas fa-cog"></i> Cài đặt</li>
                <li @click="logout">
                  <i class="fas fa-sign-out-alt"></i> Đăng xuất
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <main class="admin-main">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import AdminSidebar from "../components/AdminSidebar.vue";

export default {
  name: "admin-layout",
  components: {
    AdminSidebar,
  },
  data() {
    return {
      showUserMenu: false,
      sidebarVisible: true,
      adminUser: {},
    };
  },
  created() {
    this.checkAuth();
    this.loadUserInfo();
    document.addEventListener("click", this.closeUserMenu);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeUserMenu);
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        this.$router.push("/admin/login");
      }
    },

    loadUserInfo() {
      try {
        const userJson = localStorage.getItem("admin_user");
        if (userJson) {
          this.adminUser = JSON.parse(userJson);
        }
      } catch (error) {
        console.error("Error loading user info:", error);
        this.adminUser = { name: "Admin" };
      }
    },

    toggleUserMenu(event) {
      event.stopPropagation();
      this.showUserMenu = !this.showUserMenu;
    },

    closeUserMenu(event) {
      if (this.$refs.userMenu && !this.$refs.userMenu.contains(event.target)) {
        this.showUserMenu = false;
      }
    },

    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
      document.documentElement.style.setProperty(
        "--sidebar-width",
        this.sidebarVisible ? "250px" : "60px"
      );
    },

    logout() {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      this.$router.push("/admin/login");
    },
  },
};
</script>

<style>
:root {
  --sidebar-width: 250px;
  --header-height: 60px;
  --primary-color: #2196f3;
  --secondary-color: #1976d2;
  --text-color: #333;
  --background-color: #f5f5f5;
  --border-color: #ddd;
}

.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--background-color);
  width: 100%; /* Đảm bảo chiều rộng đầy đủ */
}

.admin-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.3s;
  width: calc(100% - var(--sidebar-width)); /* Đảm bảo nội dung chiếm toàn bộ chiều rộng */
}

.admin-header {
  height: var(--header-height);
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-title {
  display: flex;
  align-items: center;
}

.header-title h1 {
  font-size: 18px;
  margin: 0 0 0 15px;
  color: var(--text-color);
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--text-color);
  cursor: pointer;
  padding: 5px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-bar {
  position: relative;
}

.search-bar input {
  padding: 8px 15px 8px 35px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  width: 200px;
  font-size: 14px;
}

.search-bar i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.icon-button {
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  position: relative;
  cursor: pointer;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #f44336;
  color: white;
  font-size: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-name {
  margin-right: 5px;
  font-weight: 500;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 180px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  z-index: 200;
}

.user-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-dropdown li {
  padding: 12px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
}

.user-dropdown li:hover {
  background-color: #f5f5f5;
}

.user-dropdown li i {
  margin-right: 10px;
  color: #666;
  width: 20px;
}

.admin-main {
  min-height: calc(100vh - var(--header-height));
  width: 100%;
  box-sizing: border-box;
  /* Xóa padding ở đây, để các phần tử con tự xử lý */
}

@media (max-width: 768px) {
  .admin-content {
    margin-left: 0;
  }

  .search-bar {
    display: none;
  }

  .user-name {
    display: none;
  }
}
</style>
