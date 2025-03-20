import { createWebHistory, createRouter } from "vue-router";
import Home from "@/components/ComHome.vue";
import SanPham from "@/components/ComSanPham.vue";
import ThanhToan from "@/components/ComThanhToan.vue";
import LichSuThanhToan from "@/components/ComPaymentHistory.vue";
import GioiThieu from "@/components/ComGioiTh.vue";
import LienHe from "@/components/ComLienHe.vue";
import TinTuc from "@/components/ComTinTuc.vue";
import ProductDetail from "@/components/ComProductDetail.vue";
import Cart from "@/components/ComCart.vue";
import Register from "@/components/ComRegister.vue";
import Login from "@/components/ComLogin.vue";
import Search from "@/components/ComSearch.vue";
import Forgot from "@/components/ComForgot.vue";
import AdminLayout from "@/admin/views/AdminLayout.vue";
import AdminLogin from "@/admin/views/Login.vue";
import Dashboard from "@/admin/views/Dashboard.vue";
import OrdersList from "@/admin/views/OrdersList.vue";
import ProductsList from "@/admin/views/ProductsList.vue";
import CustomersList from "@/admin/views/CustomersList.vue";
import CategoriesList from "@/admin/views/CategoriesList.vue";
import Settings from "@/admin/views/Settings.vue";
import store from "../store";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/sanpham/:category?", name: "SanPham", component: SanPham },
  { path: "/gioithieu", name: "GioiThieu", component: GioiThieu },
  { path: "/lienhe", name: "LienHe", component: LienHe },
  { path: "/tintuc", name: "TinTuc", component: TinTuc },
  { path: "/product/:id", name: "ProductDetail", component: ProductDetail },
  { path: "/register", name: "Register", component: Register },
  { path: "/login", name: "Login", component: Login },
  { path: "/search", name: "ComSearch", component: Search },
  { path: "/forgot", name: "Forgot", component: Forgot },
  
  // Route admin login
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: AdminLogin,
    meta: { 
      requiresAuth: false
    }
  },
  
  // Route admin
  {
    path: "/admin",
    component: AdminLayout,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    },
    children: [
      {
        path: '',
        name: "AdminDashboard",
        component: Dashboard
      },
      {
        path: 'orders',
        name: "AdminOrders",
        component: OrdersList
      },
      {
        path: 'products',
        name: "AdminProducts",
        component: ProductsList
      },
      {
        path: 'customers',
        name: "AdminCustomers", 
        component: CustomersList
      },
      {
        path: 'categories',
        name: "AdminCategories",
        component: CategoriesList
      },
      {
        path: 'settings',
        name: "AdminSettings",
        component: Settings
      }
    ]
  },
  
  // Route yêu cầu đăng nhập
  {
    path: "/thanhtoan",
    name: "ThanhToan",
    component: ThanhToan,
    meta: { requiresAuth: true },
  },
  
  // Route có giao diện yêu cầu đăng nhập
  {
    path: "/lichsuthanhtoan",
    name: "LichSuThanhToan",
    component: LichSuThanhToan,
    meta: { requiresAuth: false },
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
    meta: { requiresAuth: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard để kiểm tra xác thực
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const isAuthenticated = store.getters["auth/isAuthenticated"];
  
  // Kiểm tra xem có phải là trang admin không
  if (requiresAdmin) {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      return next('/admin/login');
    }
    
    // Tiến hành route đến trang admin
    return next();
  }

  // Nếu trang yêu cầu xác thực và người dùng chưa đăng nhập
  if (requiresAuth && !isAuthenticated) {
    return next("/login");
  }

  // Kiểm tra token nếu người dùng đã đăng nhập
  if (isAuthenticated) {
    try {
      // Kiểm tra token có hợp lệ không
      const isValidToken = await store.dispatch("auth/checkAuth");
      
      // Nếu token không hợp lệ và trang yêu cầu xác thực
      if (!isValidToken && requiresAuth) {
        return next("/login");
      }
      
      // Đồng bộ dữ liệu giỏ hàng khi token hợp lệ
      if (isValidToken) {
        await store.dispatch("cart/fetchCart");
        if (to.name === "LichSuThanhToan") {
          await store.dispatch("paymentHistory/fetchPaymentHistory");
        }
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      if (requiresAuth) {
        return next("/login");
      }
    }
  }
  
  next();
});

export default router;
