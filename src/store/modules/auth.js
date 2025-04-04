import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token, // Đảm bảo điều này trả về true nếu token tồn tại
    currentUser: (state) => state.currentUser,
    token: (state) => state.token,
    isLoading: (state) => state.loading,
    errorMessage: (state) => state.error,
  },
  mutations: {
    SET_USER(state, { user, token }) {
      state.currentUser = user;
      state.token = token;

      // Lưu token và thông tin người dùng vào localStorage
      localStorage.setItem("currentUser", JSON.stringify(user)); // Lưu thông tin người dùng
      localStorage.setItem("token", token); // Lưu token
    },
    LOGOUT(state) {
      state.currentUser = null;
      state.token = null;

      // Xóa token và thông tin người dùng khỏi localStorage
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async login({ commit }, userData) {
      console.log("Bắt đầu quá trình đăng nhập với email:", userData.email);
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const res = await axios.post("http://localhost:5001/users/login", userData);
        console.log("Phản hồi từ server:", {
          success: true,
          hasToken: !!res.data.token,
          hasUser: !!res.data.user
        });

        const { token, user } = res.data;
        console.log("Token nhận được:", token ? `Có (độ dài: ${token.length})` : "Không có");
        console.log("Thông tin người dùng:", user);

        // Kiểm tra token trước khi lưu
        if (!token) {
          throw new Error("Không nhận được token từ server");
        }

        // Xóa token cũ trước (nếu có)
        localStorage.removeItem("token");
        
        // Thiết lập token cho axios
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("Đã thiết lập token cho axios");

        // Lưu thông tin vào store và localStorage
        localStorage.setItem("token", token);
        console.log("Đã lưu token vào localStorage:", {
          saved: !!localStorage.getItem("token"),
          length: localStorage.getItem("token")?.length
        });
        
        commit("SET_USER", { user, token });
        console.log("Đã lưu thông tin người dùng và token vào store");

        // Kiểm tra token ngay sau khi đăng nhập
        try {
          const checkRes = await axios.get("http://localhost:5001/users/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log("Kiểm tra token thành công:", checkRes.data);
        } catch (error) {
          console.error("Lỗi kiểm tra token sau đăng nhập:", error);
          throw new Error("Token không hợp lệ sau khi đăng nhập");
        }
      } catch (error) {
        console.error("Chi tiết lỗi đăng nhập:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        const msg =
          (error.response && error.response.data.message) ||
          error.message ||
          "Đăng nhập thất bại";
        commit("SET_ERROR", msg);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async logout({ commit, dispatch }) {
      const token = localStorage.getItem("token");
      console.log("Bắt đầu quá trình đăng xuất:", {
        hasToken: !!token,
        currentUser: localStorage.getItem("currentUser") ? "Có" : "Không có"
      });

      if (!token) {
        console.warn("Không tìm thấy token. Không cần thực hiện logout.");
        return;
      }

      // Xóa token mặc định từ axios
      delete axios.defaults.headers.common["Authorization"];
      console.log("Đã xóa token khỏi axios headers");
      
      commit("LOGOUT");
      console.log("Đã xóa token và thông tin người dùng khỏi localStorage");

      // Xóa giỏ hàng trong trạng thái Vuex
      await dispatch("cart/clearCart", null, { root: true });
      await dispatch("paymentHistory/fetchPaymentHistory", null, {
        root: true,
      });
      console.log("Đã xóa giỏ hàng và lịch sử thanh toán");
    },
    
    async checkAuth({ state, commit }) {
      const token = state.token || localStorage.getItem("token");
      console.log("Kiểm tra token hiện tại:", {
        hasToken: !!token,
        source: state.token ? "state" : "localStorage"
      });

      if (!token) {
        console.warn("Không tìm thấy token trong localStorage hoặc state.");
        return false;
      }
    
      try {
        console.log("Đang gọi API kiểm tra token...");
        const res = await axios.get("http://localhost:5001/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Kết quả kiểm tra token:", {
          success: true,
          user: res.data.user
        });
        commit("SET_USER", { user: res.data.user, token });
        return true;
      } catch (error) {
        console.error("Chi tiết lỗi kiểm tra token:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        if (error.response) {
          if (error.response.status === 401 || error.response.status === 404) {
            console.warn("Token không hợp lệ hoặc người dùng không tồn tại. Đang thực hiện logout...");
            commit("LOGOUT");
          }
        }
        return false;
      }
    }
  },
};
