import { createWebHistory, createRouter } from "vue-router";
import Home from '@/components/ComHome.vue';
import SanPham from '@/components/ComSanPham.vue';
import GioiThieu from '@/components/ComGioiTh.vue';
import LienHe from '@/components/ComLienHe.vue';
import TinTuc from '@/components/ComTinTuc.vue';
import ProductDetail from '@/components/ComProductDetail.vue';
import Cart from '@/components/ComCart.vue';
import Register from '@/components/ComRegister.vue';
import Login from '@/components/ComLogin.vue';
import OrderHistory from "@/components/OrderHistory.vue";

// tạo mảng chứa những đường link
const routes = [
    // Đối tượng trang chủ
    {
        path: "/",
        name: "Home",
        component: Home
    },
    // Đường link không phải là trang chủ
    {
        path: "/sanpham",
        name: "SanPham",
        component: SanPham
    },
    {
        path: "/gioithieu",
        name: "GioiThieu",
        component: GioiThieu
    },
    {
        path: "/lienhe",
        name: "LienHe",
        component: LienHe
    },
    {
        path: "/tintuc",
        name: "TinTuc",
        component: TinTuc
    },

    // Đường link truyền đi
    {
        path: "/product/:id",
        name: "ProductDetail",
        component: ProductDetail
    },
    {
        path: "/cart",
        name: "Cart",
        component: Cart
    },
    {
        path: "/register",
        name: "Register",
        component: Register
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/history",
        name: "history",
        component: OrderHistory
    }
];

// Tạo đối tượng router
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
