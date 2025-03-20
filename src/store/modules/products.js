import axios from "axios";

const state = () => ({
  products: [],
  loading: false,
  error: null,
});

const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products;
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  async fetchProducts({ commit }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    try {
      const response = await axios.get("http://localhost:5001/products");
      const mappedProducts = response.data.map((prod) => ({
        ...prod,
        id: prod._id,
      }));
      commit("SET_PRODUCTS", mappedProducts);
    } catch (error) {
      commit("SET_ERROR", error.message || "Lỗi không xác định");
    } finally {
      commit("SET_LOADING", false);
    }
  },
  async updateProductStock({ dispatch }, { productId, quantity }) {
    try {
      await axios.put(
        `http://localhost:5001/products/${productId}/updateSold`,
        { quantitySold: quantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Fetch lại sản phẩm để đồng bộ
      await dispatch("fetchProducts");
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  },
};

const getters = {
  allProducts: (state) => state.products,
  getProductById: (state) => (id) => {
    if (!id) return null;
    
    // Chuyển id sang dạng chuỗi để so sánh an toàn
    const searchId = String(id);
    
    // Tìm sản phẩm theo id hoặc _id
    return state.products.find(
      product => String(product.id) === searchId || String(product._id) === searchId
    );
  },
  isLoading: (state) => state.loading,
  errorMessage: (state) => state.error,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
