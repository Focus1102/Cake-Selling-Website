<template>
  <Header/>
  <OrderDetails/> <!-- Thêm vào nơi bạn muốn hiển thị OrderDetails -->
  <Footer/>
</template>

<script>
// Import OrderDetails và các component khác
import OrderDetails from './components/OrderDetails.vue';
import Header from './components/ComHeader.vue'
import Footer from './components/ComFooter.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    OrderDetails,  // Đừng quên thêm vào components
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
