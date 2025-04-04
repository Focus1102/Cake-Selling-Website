/* eslint-disable no-unused-vars */
import axios from "axios";

const state = () => ({
  cartItems: [],
  loading: false,
  error: null
});

const mutations = {
  SET_CART_ITEMS(state, items) {
    state.cartItems = items;
  },
  CLEAR_CART(state) {
    state.cartItems = [];
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  }
};

const actions = {
  async fetchCart({ commit, rootGetters, dispatch }) {
    console.log("Bắt đầu lấy thông tin giỏ hàng");
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    // Kiểm tra xem người dùng đã đăng nhập chưa
    const isAuthenticated = rootGetters["auth/isAuthenticated"];
    if (!isAuthenticated) {
      console.warn("Người dùng chưa đăng nhập. Không thể lấy giỏ hàng.");
      commit("SET_CART_ITEMS", []);
      commit("SET_LOADING", false);
      return;
    }

    // Kiểm tra token
    const token = rootGetters["auth/token"] || localStorage.getItem("token");
    if (!token) {
      console.warn("Không tìm thấy token. Không thể lấy giỏ hàng.");
      commit("SET_CART_ITEMS", []);
      commit("SET_LOADING", false);
      return;
    }

    try {
      console.log("Đang gọi API lấy giỏ hàng");
      const response = await axios.get("http://localhost:5001/users/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Phản hồi từ API giỏ hàng:", response.data);
      
      // Xử lý dữ liệu giỏ hàng từ phản hồi
      if (response.data) {
        // Lấy items từ response
        const cartItems = response.data.items || [];
        console.log("Các mục trong giỏ hàng:", cartItems);
        commit("SET_CART_ITEMS", cartItems);
      } else {
        console.warn("Không có dữ liệu giỏ hàng trong phản hồi");
        commit("SET_CART_ITEMS", []);
      }
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      commit("SET_ERROR", "Không thể lấy thông tin giỏ hàng");
      commit("SET_CART_ITEMS", []);
    } finally {
      commit("SET_LOADING", false);
    }
  },
  async addToCart({ dispatch, rootGetters }, product) {
    const currentUser = rootGetters["auth/currentUser"];
    if (!currentUser) {
      console.warn("User not authenticated. Please log in to add to cart.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      // Đảm bảo productId là chuỗi đơn giản, không phải là đối tượng
      let productId = product._id || product.id;
      if (productId && typeof productId === 'object') {
        productId = productId._id || productId.id || String(productId);
      }
      
      // Tạo variantId từ productId và các thuộc tính khác
      const variantId = `${productId}_${product.color || "N/A"}_${
        product.size || "N/A"
      }`;
      const quantityToAdd =
        product.quantity && product.quantity > 0 ? product.quantity : 1;

      console.log("Thêm sản phẩm vào giỏ hàng:", {
        productId,
        variantId,
        name: product.name,
        quantity: quantityToAdd,
        price: product.price,
        size: product.size || "N/A"
      });

      // Kiểm tra và log token trước khi gửi
      console.log("Token được sử dụng:", token ? "Có (độ dài: " + token.length + ")" : "Không có");
      
      // Đảm bảo header Authorization được thiết lập đúng
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      console.log("Headers gửi đi:", {
        Authorization: headers.Authorization ? headers.Authorization.substring(0, 15) + "..." : "Không có",
        'Content-Type': headers['Content-Type']
      });

      const response = await axios.post(
        "http://localhost:5001/users/cart",
        {
          productId,
          variantId,
          name: product.name,
          size: product.size || "N/A",
          quantity: quantityToAdd,
          price: product.price,
          image: product.image || (product.images && product.images[0])
        },
        { headers }
      );

      console.log("Kết quả thêm vào giỏ hàng:", response.data);
      
      // Cập nhật lại giỏ hàng sau khi thêm
      await dispatch("fetchCart");
      return true;
    } catch (error) {
      console.error("Chi tiết lỗi khi thêm vào giỏ hàng:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response && error.response.status === 401) {
        console.error("Token hết hạn hoặc không hợp lệ. Đang đăng xuất...");
        await dispatch("auth/logout", null, { root: true });
      }
      throw error;
    }
  },
  async removeFromCart({ commit, dispatch, rootGetters }, variantId) {
    const currentUser = rootGetters["auth/currentUser"];
    if (!currentUser) {
      console.warn("User not authenticated. Cannot remove from cart.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      console.log(`Đang xóa sản phẩm với variantId: ${variantId}`);
      
      // Tìm item trong giỏ hàng để lấy productId
      const cartItem = this.state.cart.cartItems.find(item => item.variantId === variantId);
      if (!cartItem) {
        console.error("Không tìm thấy sản phẩm trong giỏ hàng");
        return false;
      }
      
      // Immediately remove the item from the current state for fast UI response
      const currentItems = [...this.state.cart.cartItems];
      const updatedItems = currentItems.filter(item => item.variantId !== variantId);
      commit('SET_CART_ITEMS', updatedItems);
      
      // Gọi API để xóa sản phẩm - dùng đúng endpoint
      const response = await axios.delete(`http://localhost:5001/users/cart/${variantId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Phản hồi từ server:', response.data);
      
      // Fetch fresh cart data after successful deletion
      await dispatch("fetchCart");
      return true;
    } catch (error) {
      console.error("Chi tiết lỗi khi xóa sản phẩm:", error);
      // Restore original cart state if API call fails
      await dispatch("fetchCart");
      throw error;
    }
  },
  async updateCartItem({ dispatch, rootGetters }, { variantId, quantity }) {
    const currentUser = rootGetters["auth/currentUser"];
    if (!currentUser) {
      console.warn("User not authenticated. Cannot update cart.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    // Lấy thông tin sản phẩm từ state
    const cartItems = this.state.cart.cartItems;
    const item = cartItems.find((i) => i.variantId === variantId);

    if (!item) {
      console.error("Item not found in cart");
      return;
    }

    // Đảm bảo productId là chuỗi đơn giản, không phải là đối tượng
    let productId = item.productId;
    if (productId && typeof productId === 'object') {
      productId = productId._id || productId.id || String(productId);
    }

    try {
      // Sử dụng endpoint đúng
      await axios.put(
        "http://localhost:5001/users/cart",
        {
          variantId,
          productId,
          name: item.name,
          size: item.size,
          quantity,
          price: item.price,
          image: item.image,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Chỉ cập nhật lại giỏ hàng sau khi API thành công
      await dispatch("fetchCart");
    } catch (error) {
      console.error("Error updating cart item:", error);
      if (error.response && error.response.status === 401) {
        console.error("Token hết hạn hoặc không hợp lệ. Đang đăng xuất...");
        await dispatch("auth/logout", null, { root: true });
      }
      throw error;
    }
  },
  async clearCart({ dispatch, rootGetters, commit }) {
    const currentUser = rootGetters["auth/currentUser"];
    if (!currentUser) {
      console.warn("Người dùng chưa đăng nhập. Không thể xóa giỏ hàng.");
      commit("CLEAR_CART");  // Vẫn xóa giỏ hàng ở local
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không tìm thấy token. Không thể xóa giỏ hàng trên server.");
      commit("CLEAR_CART");  // Vẫn xóa giỏ hàng ở local
      return;
    }

    try {
      // Sử dụng endpoint đúng
      await axios.delete("http://localhost:5001/users/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      commit("CLEAR_CART");
    } catch (error) {
      console.error("Lỗi khi xóa giỏ hàng:", error.message);
      
      // Vẫn xóa giỏ hàng ở local dù có lỗi từ server
      commit("CLEAR_CART");
      
      if (error.response && error.response.status === 401) {
        console.warn("Token không hợp lệ khi xóa giỏ hàng");
      }
    }
  },
};

const getters = {
  cartItems: (state) => state.cartItems,
  cartTotalAmount: (state) =>
    state.cartItems.reduce(
      (total, item) => total + (item.price || 0) * item.quantity,
      0
    ),
  cartCount: (state) =>
    state.cartItems.reduce((count, item) => count + item.quantity, 0),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
