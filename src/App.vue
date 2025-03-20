<template>
  <div id="app">
    <!-- Header và Footer chỉ hiển thị khi không phải trang Admin -->
    <Header v-if="!isAdminRoute" />

    <!-- Nội dung chính hiển thị thông qua router-view -->
    <main :class="{ 'admin-page': isAdminRoute }">
      <router-view />
    </main>

    <!-- Footer ở dưới cùng -->
    <Footer v-if="!isAdminRoute" />
  </div>
</template>

<script>
// Import các thành phần Header và Footer
import Header from "./components/ComHeader.vue";
import Footer from "./components/ComFooter.vue";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  computed: {
    isAdminRoute() {
      return this.$route.path.startsWith('/admin');
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1; /* Phần main sẽ chiếm không gian còn lại của trang */
  padding: 20px; /* Khoảng đệm cho nội dung để dễ đọc hơn */
  display: flex;
  justify-content: center;
  align-items: center;
}

main.admin-page {
  padding: 0;
  max-width: 100%;
  width: 100%;
}
</style>
