<template>
    <header :class="{ 'scrolled': isScrolled }">

        <div class="container">

            <div class="logo">
                <img src="/Images/logo.png" alt="Restaurant Logo" />
            </div>

            <nav>
                <ul>
                    <li v-if="!user"><router-link to="/register" class="nav-link">Đăng ký</router-link></li>
                    <li v-if="!user"><router-link to="/login" class="nav-link">Đăng nhập</router-link></li>
                    <li><router-link to="/" class="nav-link">Trang Chủ</router-link></li>
                    <li><router-link to="/gioithieu" class="nav-link">Giới Thiệu</router-link></li>
                    <li><router-link to="/lienhe" class="nav-link">Liên Hệ</router-link></li>
                    <li><router-link to="/tintuc" class="nav-link">Tin Tức</router-link></li>
                    <li><router-link to="/sanpham" class="nav-link">Sản Phẩm</router-link></li>
                    <li v-if="user"><router-link to="/history" class="nav-link">Lịch Sử Đơn Đặt Hàng</router-link></li>
                </ul>
            </nav>


            <div v-if="user" class="user-info">
                <p>Xin chào, {{ user.username }}</p>
                <button @click="logout" class="logout-button">Đăng xuất</button>
            </div>


            <div class="cta">
                <router-link to="/cart" class="cta-button">Giỏ hàng</router-link>
            </div>

        </div>

    </header>

    <div class="main-content">
        <router-view />
    </div>
</template>

<script>
import eventBus from '@/eventBus';

export default {
    data() {
        return {
            user: JSON.parse(localStorage.getItem('currentUser')) || null,
            isScrolled: false
        };
    },
    created() {
        eventBus.on('loginSuccess', (user) => {
            this.user = user;
        });

        window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
        eventBus.off('loginSuccess');
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        logout() {
            localStorage.removeItem('currentUser');
            this.user = null;
            this.$router.push('/login');
        },
        handleScroll() {
            this.isScrolled = window.scrollY > 50;
        }
    }
};
</script>

<style scoped>

/* Header chính */
header {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: rgba(22, 161, 203, 0.9); /* Màu nền mặc định */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* Tạo bóng để header nổi bật */
    transition: background-color 0.3s ease, height 0.3s ease;
    z-index: 1000;
    padding: 15px 0; /* Giảm padding để làm header gọn gàng */
    backdrop-filter: blur(8px); /* Hiệu ứng mờ nền khi cuộn */
}

/* Container để căn chỉnh tất cả các phần tử trong header */
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Logo */
.logo img {
    height: 70px; /* Giảm kích thước logo */
    transition: height 0.3s ease;
}

/* Điều hướng */
nav {
    flex-grow: 1; /* Điều chỉnh để nav chiếm hết không gian còn lại */
    display: flex;
    justify-content: center; /* Căn giữa các mục điều hướng */
}

nav ul {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
}

nav ul li {
    margin: 0 15px;
}

nav ul li a {
    text-decoration: none;
    color: #ffffff;
    font-weight: bold;
    font-size: 16px; /* Giảm kích thước chữ */
    transition: color 0.3s ease;
}

/* Hiệu ứng hover cho link */
nav ul li a:hover {
    color: #fcb034;
    text-decoration: underline; /* Thêm gạch chân khi hover */
}

/* Thông tin người dùng */
.user-info {
    margin-left: 20px;
}

.user-info p {
    color: #ffffff;
    margin: 0;
    font-size: 16px; /* Giảm kích thước chữ */
}

button {
    background-color: transparent;
    border: 1px solid #ffffff;
    color: #ffffff;
    border-radius: 5px;
    padding: 8px 15px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
}

/* Hiệu ứng hover cho button */
button:hover {
    background-color: #fcb034;
    color: white;
}

/* Call to Action (CTA) */
.cta {
    margin-left: 15px;
}

.cta-button {
    padding: 12px 25px;
    background-color: #36ce80;
    color: #ffffff;
    text-decoration: none;
    border-radius: 25px;
    font-size: 16px; /* Giảm kích thước chữ */
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.cta-button:hover {
    background-color: #1dc11a;
    transform: scale(1.1);
}

/* Khoảng cách để tránh nội dung bị che bởi header */
.main-content {
    padding-top: 110px; /* Điều chỉnh chiều cao header */
}
</style>