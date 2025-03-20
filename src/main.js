import { createApp } from "vue";
import App from "./App.vue";
import store from "./store"; // Vuex Store
import router from "./router";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";

// Thiết lập token mặc định cho axios nếu có
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Thiết lập interceptor để kiểm tra token trước khi thực hiện các yêu cầu
axios.interceptors.request.use(
  (config) => {
    console.log("Interceptor request config:", config); // Log cấu hình request
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Thêm token vào header Authorization:", token); // Log token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Lỗi trong interceptor request:", error.message); // Log lỗi request
    return Promise.reject(error);
  }
);

// Thiết lập interceptor để xử lý lỗi 401
axios.interceptors.response.use(
  (response) => {
    console.log("Interceptor response data:", response.data); // Log dữ liệu phản hồi
    return response;
  },
  async (error) => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 404) {
        console.error("Token không hợp lệ hoặc người dùng không tồn tại:", error.response.data); // Log lỗi
        await store.dispatch("auth/logout");
        router.push("/login");
      } else {
        console.error("Lỗi khác từ server:", error.message); // Log lỗi khác
      }
    } else {
      console.error("Lỗi không xác định:", error.message); // Log lỗi không xác định
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
