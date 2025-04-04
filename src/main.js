import { createApp } from "vue";
import App from "./App.vue";
import store from "./store"; // Vuex Store
import router from "./router";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";

// Thêm vào đầu file main.js
console.log("===== Kiểm tra token trong localStorage =====");
const token = localStorage.getItem("token");
console.log("Token trong localStorage:", token ? {
  length: token.length,
  preview: token.substring(0, 20) + "...",
  isValid: token.startsWith("ey") // Token JWT thường bắt đầu bằng "ey"
} : "Không có");

// Thiết lập token mặc định cho axios nếu có
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  console.log("Đã thiết lập token mặc định cho axios");
}

// Thiết lập interceptor để kiểm tra token trước khi thực hiện các yêu cầu
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Kiểm tra token trước request:", {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      headers: config.headers
    });
    
    if (token) {
      // Đảm bảo header Authorization được set đúng format
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Đã thêm token vào header của request:", {
        url: config.url,
        header: config.headers.Authorization
      });
    } else {
      console.warn("Không tìm thấy token trong localStorage");
    }
    return config;
  },
  (error) => {
    console.error("Lỗi trong interceptor request:", error.message);
    return Promise.reject(error);
  }
);

// Thiết lập interceptor để xử lý lỗi 401
axios.interceptors.response.use(
  (response) => {
    console.log("Response thành công:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
      headers: response.config.headers
    });
    return response;
  },
  async (error) => {
    if (error.response) {
      console.error("Chi tiết lỗi response:", {
        status: error.response.status,
        url: error.config.url,
        message: error.response.data.message,
        headers: error.config.headers
      });

      if (error.response.status === 401) {
        // Phát hiện các URL cụ thể
        const isLoginRequest = error.config.url.includes('/users/login');
        const isCheckTokenRequest = error.config.url.includes('/users/me');
        
        // Nếu không phải đăng nhập hoặc kiểm tra token, thì đăng xuất
        if (!isLoginRequest && !isCheckTokenRequest) {
          console.error("Token không hợp lệ hoặc người dùng không tồn tại:", error.response.data);
          await store.dispatch("auth/logout");
          router.push("/login");
        }
      } else {
        console.error("Lỗi khác từ server:", error.message);
      }
    } else {
      console.error("Lỗi không xác định:", error.message);
    }
    return Promise.reject(error);
  }
);

// Tạo ứng dụng Vue
const app = createApp(App);

// (Tuỳ chọn) Bật devtools trong môi trường phát triển
if (process.env.NODE_ENV === "development") {
  app.config.devtools = true;
}

// Sử dụng Vuex Store
app.use(store);

// Sử dụng Vue Router
app.use(router);

// Mount ứng dụng vào DOM
app.mount("#app");
