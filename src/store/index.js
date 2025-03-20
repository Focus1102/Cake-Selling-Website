import { createStore } from "vuex";
import cart from "./modules/cart";
import products from "./modules/products";
import auth from "./modules/auth";
import paymentHistory from "./modules/paymentHistory";

export default createStore({
  modules: {
    cart,
    products,
    auth,
    paymentHistory,
  },
  strict: process.env.NODE_ENV !== "production",
});
