import axios from "axios";

const state = () => ({
  paymentHistory: [],
});

const mutations = {
  SET_PAYMENT_HISTORY(state, history) {
    state.paymentHistory = history;
  },
};

const actions = {
  async fetchPaymentHistory({ commit, rootGetters }) {
    const currentUser = rootGetters["auth/currentUser"];
    if (!currentUser) {
      commit("SET_PAYMENT_HISTORY", []);
      return;
    }
    try {
      const response = await axios.get(
        "http://localhost:5001/users/payment-history",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      commit("SET_PAYMENT_HISTORY", response.data || []);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      commit("SET_PAYMENT_HISTORY", []);
    }
  },
};

const getters = {
  paymentHistory: (state) => state.paymentHistory,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
