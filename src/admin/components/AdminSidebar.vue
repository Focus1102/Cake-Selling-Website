<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <img :src="require('@/assets/LOGO.jpg')" alt="Logo" class="logo-img">
        <span class="logo-text">My Shop</span>
      </div>
      <div class="profile">
        <div class="profile-info">
          <img src="https://ui-avatars.com/api/?name=Admin&background=2196F3&color=fff" alt="Admin" class="profile-avatar">
          <div class="profile-text">
            <div class="profile-name">{{ adminName }}</div>
            <div class="profile-role">Administrator</div>
          </div>
        </div>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <ul>
        <li>
          <router-link to="/admin" exact>
            <i class="fas fa-tachometer-alt"></i>
            <span>Bảng Điều Khiển</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/orders">
            <i class="fas fa-shopping-bag"></i>
            <span>Đơn Hàng</span>
            <span class="item-count">{{ orderCount }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/products">
            <i class="fas fa-box"></i>
            <span>Sản Phẩm</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/categories">
            <i class="fas fa-list"></i>
            <span>Danh Mục</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/customers">
            <i class="fas fa-users"></i>
            <span>Khách Hàng</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/settings">
            <i class="fas fa-cog"></i>
            <span>Cài Đặt</span>
          </router-link>
        </li>
      </ul>
    </nav>
    
    <div class="sidebar-footer">
      <div class="footer-item" @click="logout">
        <i class="fas fa-sign-out-alt"></i>
        <span>Đăng Xuất</span>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'admin-sidebar',
  data() {
    return {
      adminName: 'Admin',
      orderCount: 5
    };
  },
  created() {
    this.loadUserInfo();
  },
  methods: {
    loadUserInfo() {
      try {
        const userJson = localStorage.getItem('admin_user');
        if (userJson) {
          const user = JSON.parse(userJson);
          this.adminName = user.name || user.username || 'Admin';
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    },
    
    logout() {
      // Xóa thông tin đăng nhập
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      
      // Chuyển hướng về trang đăng nhập
      this.$router.push('/admin/login');
    }
  }
};
</script>

<style scoped>
.admin-sidebar {
  width: var(--sidebar-width, 250px);
  background-color: #1a2238;
  color: #fff;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  z-index: 1000;
}

.sidebar-header {
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.logo-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.logo-text {
  margin-left: 10px;
  font-size: 18px;
  font-weight: bold;
}

.profile {
  margin-top: 10px;
}

.profile-info {
  display: flex;
  align-items: center;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.profile-text {
  margin-left: 10px;
}

.profile-name {
  font-size: 14px;
  font-weight: 500;
}

.profile-role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
}

.sidebar-nav {
  flex: 1;
  padding: 15px 0;
  overflow-y: auto;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 5px;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
  position: relative;
}

.sidebar-nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.sidebar-nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border-left: 3px solid var(--primary-color, #2196F3);
}

.sidebar-nav i {
  font-size: 16px;
  width: 20px;
  margin-right: 10px;
  text-align: center;
}

.sidebar-nav span {
  font-size: 14px;
}

.item-count {
  position: absolute;
  right: 15px;
  background-color: var(--primary-color, #2196F3);
  color: white;
  border-radius: 10px;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 6px;
  min-width: 16px;
  text-align: center;
}

.sidebar-footer {
  padding: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s;
}

.footer-item:hover {
  color: white;
}

.footer-item i {
  margin-right: 10px;
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 60px;
  }
  
  .logo-text,
  .profile-text,
  .sidebar-nav span {
    display: none;
  }
  
  .sidebar-nav a {
    justify-content: center;
    padding: 12px 0;
  }
  
  .sidebar-nav i {
    margin-right: 0;
    font-size: 18px;
  }
  
  .item-count {
    position: absolute;
    top: 5px;
    right: 5px;
  }
  
  .footer-item span {
    display: none;
  }
  
  .footer-item {
    justify-content: center;
  }
  
  .footer-item i {
    margin-right: 0;
  }
}
</style> 