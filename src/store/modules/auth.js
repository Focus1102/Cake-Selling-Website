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
    isAuthenticated: (state) => !!state.token, // Ensure this returns true if token exists
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
      console.log("Gửi yêu cầu đăng nhập với dữ liệu:", userData); // Log dữ liệu đăng nhập
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const res = await axios.post("http://localhost:5001/users/login", userData);

        const { token, user } = res.data;

        console.log("Token từ server:", token); // Log token
        console.log("Thông tin người dùng:", user); // Log thông tin người dùng

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        commit("SET_USER", { user, token });
      } catch (error) {
        console.error("Lỗi khi đăng nhập:", error.message); // Log lỗi đăng nhập
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
      if (!token) {
        console.warn("Không tìm thấy token. Không cần thực hiện logout.");
        return;
      }

      // Xóa token mặc định từ axios
      delete axios.defaults.headers.common["Authorization"];
      
      commit("LOGOUT");
      console.log("Đã xóa token và thông tin người dùng khỏi localStorage.");

      // Xóa giỏ hàng trong trạng thái Vuex
      await dispatch("cart/clearCart", null, { root: true });
      await dispatch("paymentHistory/fetchPaymentHistory", null, {
        root: true,
      });
    },
    
    // Kiểm tra token hiện tại có hợp lệ không
    async checkAuth({ state, commit }) {
      const token = state.token || localStorage.getItem("token");
      console.log("Kiểm tra token:", token); // Log token hiện tại
      if (!token) {
        console.warn("Không tìm thấy token trong localStorage hoặc state."); // Log cảnh báo
        return false;
      }
    
      try {
        const res = await axios.get("http://localhost:5001/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Thông tin người dùng từ API /users/me:", res.data.user); // Log thông tin người dùng
        commit("SET_USER", { user: res.data.user, token });
        return true;
      } catch (error) {
        console.error("Lỗi khi kiểm tra token:", error.message); // Log lỗi
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
