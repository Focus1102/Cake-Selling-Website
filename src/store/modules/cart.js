/* eslint-disable no-unused-vars */
import axios from "axios";

const state = () => ({
  cartItems: [],
});

const mutations = {
  SET_CART_ITEMS(state, items) {
    state.cartItems = items;
  },
  CLEAR_CART(state) {
    state.cartItems = [];
  },
};

const actions = {
  async fetchCart({ commit, rootGetters, dispatch }) {
    const currentUser = rootGetters["auth/currentUser"];
    if (!currentUser) {
      console.warn("User not authenticated. Cannot fetch cart.");
      commit("SET_CART_ITEMS", []);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found. Cannot fetch cart.");
      commit("SET_CART_ITEMS", []);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5001/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data || !response.data.success) {
        console.error("API response error:", response.data);
        commit("SET_CART_ITEMS", []);
        return;
      }

      const cartItems = response.data.data.items || [];
      console.log("Cart items from API:", cartItems);
      commit("SET_CART_ITEMS", cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);

      if (error.response) {
        if (error.response.status === 401 || error.response.status === 404) {
          console.error("Token hết hạn hoặc người dùng không tồn tại. Đang đăng xuất...");
          await dispatch("auth/logout", null, { root: true });
        }
        commit("SET_CART_ITEMS", []);
      } else {
        console.error("Network error or server không phản hồi:", error.message);
        commit("SET_CART_ITEMS", []);
      }
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

    // Đảm bảo productId là chuỗi đơn giản, không phải là đối tượng
    let productId = product._id || product.id;
    if (productId && typeof productId === 'object') {
      productId = productId._id || productId.id || String(productId);
    }
    
    const variantId = `${productId}_${product.color || "N/A"}_${
      product.size || "N/A"
    }`;
    const quantityToAdd =
      product.quantity && product.quantity > 0 ? product.quantity : 1;

    // Kiểm tra số lượng tồn kho
    const productInStore = rootGetters["products/getProductById"](productId);
    if (!productInStore) {
      throw new Error(`Không tìm thấy thông tin sản phẩm. Vui lòng thử lại sau.`);
    }

    // Tìm số lượng hiện tại trong giỏ hàng (nếu có)
    const cartItems = this.state.cart.cartItems;
    const existingItem = cartItems.find((item) => item.variantId === variantId);
    const currentQuantity = existingItem ? existingItem.quantity : 0;

    // Tổng số lượng sau khi thêm
    const totalQuantity = currentQuantity + quantityToAdd;

    if (totalQuantity > productInStore.stock) {
      // Nếu số lượng vượt quá tồn kho, thêm tối đa có thể
      const availableToAdd = Math.max(0, productInStore.stock - currentQuantity);
      
      if (availableToAdd <= 0) {
        throw new Error(
          `Không thể thêm vào giỏ hàng. Bạn đã có ${currentQuantity} sản phẩm "${productInStore.name}" trong giỏ hàng (tối đa ${productInStore.stock}).`
        );
      }
      
      // Tự động điều chỉnh số lượng thêm vào tối đa có thể
      const adjustedQuantity = currentQuantity + availableToAdd;
      
      try {
        await axios.post(
          "http://localhost:5001/api/cart/add",
          {
            variantId,
            productId,
            name: product.name,
            size: product.size || "N/A",
            quantity: adjustedQuantity,
            price: product.price,
            image: product.image,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        await dispatch("fetchCart");
        
        // Thông báo đã điều chỉnh số lượng - chỉ hiển thị thông báo đặc biệt khi số lượng bị điều chỉnh
        alert(`Đã thêm ${availableToAdd} sản phẩm vào giỏ hàng. Không thể thêm thêm vì sản phẩm "${productInStore.name}" chỉ còn ${productInStore.stock} sản phẩm trong kho.`);
        
      } catch (error) {
        console.error("Error adding to cart:", error);
        if (error.response && error.response.status === 401) {
          console.error("Token hết hạn hoặc không hợp lệ. Đang đăng xuất...");
          await dispatch("auth/logout", null, { root: true });
        }
        throw error;
      }
    } else {
      // Trường hợp bình thường, đủ tồn kho
      try {
        await axios.post(
          "http://localhost:5001/api/cart/add",
          {
            variantId,
            productId,
            name: product.name,
            size: product.size || "N/A",
            quantity: totalQuantity,
            price: product.price,
            image: product.image,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        await dispatch("fetchCart");
      } catch (error) {
        console.error("Error adding to cart:", error);
        if (error.response && error.response.status === 401) {
          console.error("Token hết hạn hoặc không hợp lệ. Đang đăng xuất...");
          await dispatch("auth/logout", null, { root: true });
        }
        throw error;
      }
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
      
      // Lấy productId từ item để gửi cho API
      const productId = cartItem.productId;
      console.log(`ProductId của sản phẩm cần xóa: ${productId}`);
      
      // Immediately remove the item from the current state for fast UI response
      const currentItems = [...this.state.cart.cartItems];
      const updatedItems = currentItems.filter(item => item.variantId !== variantId);
      commit('SET_CART_ITEMS', updatedItems);
      
      // Gọi API để xóa sản phẩm (backend sử dụng productId)
      const response = await axios.delete(`http://localhost:5001/api/cart/remove/${productId}`, {
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
      
      if (error.response) {
        console.error("Mã lỗi:", error.response.status);
        console.error("Dữ liệu phản hồi:", error.response.data);
        
        if (error.response.status === 401) {
          console.error("Token hết hạn hoặc không hợp lệ. Đang đăng xuất...");
          await dispatch("auth/logout", null, { root: true });
        } else if (error.response.status === 404) {
          console.error("Không tìm thấy endpoint hoặc sản phẩm. Kiểm tra lại API URL.");
        }
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ server:", error.request);
      } else {
        console.error("Lỗi cấu hình request:", error.message);
      }
      
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

    // Kiểm tra số lượng tồn kho
    const product = rootGetters["products/getProductById"](productId);
    if (product && quantity > product.stock) {
      throw new Error(
        `Không thể tăng thêm vì sản phẩm "${product.name}" chỉ còn ${product.stock} sản phẩm trong kho.`
      );
    }

    try {
      await axios.put(
        "http://localhost:5001/api/cart/update",
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
      throw error; // Ném lỗi để component có thể xử lý
    }
  },
  async clearCart({ dispatch, rootGetters }) {
    const currentUser = rootGetters["auth/currentUser"];
    if (!currentUser) {
      console.warn("User not authenticated. Cannot clear cart.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Cannot clear cart.");
      return;
    }

    try {
      await axios.delete("http://localhost:5001/api/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      await dispatch("fetchCart");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Token hết hạn, cần đăng nhập lại:", error);
        await dispatch("auth/logout", null, { root: true });
      } else if (error.response && error.response.status === 404) {
        console.warn("Endpoint /users/cart not found. Clearing locally...");
        await dispatch("fetchCart");
      } else {
        console.error("Error clearing cart:", error);
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
