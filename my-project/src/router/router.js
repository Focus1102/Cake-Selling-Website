// src/router/index.js
import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import CartPage from '@/components/CartPage.vue';
import OrderHistory from '@/components/OrderHistory.vue';
import OrderDetail from '@/components/OrderDetail.vue';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/cart', name: 'cart', component: CartPage },
    { path: '/order-history', name: 'orderHistory', component: OrderHistory },
    { path: '/order-detail/:id', name: 'orderDetail', component: OrderDetail, props: true }
  ]
});




