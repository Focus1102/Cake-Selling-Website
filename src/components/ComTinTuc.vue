<template>
  <div class="page-container">
    <h1>Tin Tức</h1>
    <p>
      Đây là trang tin tức. Cập nhật các thông tin mới nhất và thông báo cửa
      hàng tại đây.
    </p>
    <div class="news-list">
      <div class="news-item" v-for="(news, index) in newsList" :key="index">
        <div class="news-header">
          <div class="news-info">
            <h2>{{ news.title }}</h2>
            <p class="news-date">Ngày đăng: {{ news.date }}</p>
          </div>
        </div>
        <p>{{ news.content }}</p>
        <button class="btn btn-details" @click="viewDetails(index)">
          Xem Chi Tiết
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComTinTuc",
  data() {
    return {
      newsList: [
        {
          title: "Tin tức 1",
          content: "Nội dung của tin tức 1",
          date: "2023-11-15",
        },
        {
          title: "Tin tức 2",
          content: "Nội dung của tin tức 2",
          date: "2023-11-14",
        },
        {
          title: "Tin tức 3",
          content: "Nội dung của tin tức 3",
          date: "2023-11-13",
        },
      ],
    };
  },
  methods: {
    viewDetails(index) {
      alert(`Chi tiết cho tin tức: ${this.newsList[index].title}`);
    },
  },
};
</script>

<style scoped>
.page-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #2c3e50;
}

p {
  font-size: 1.2em;
  color: #555;
  line-height: 1.5;
}

.news-list {
  text-align: left;
  margin-top: 30px;
}

.news-item {
  margin-bottom: 30px;
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.news-item:hover {
  transform: translateY(-5px);
}

.news-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.news-image {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 20px;
}

.news-info {
  flex: 1;
}

.news-info h2 {
  font-size: 1.8em;
  color: #444;
  margin: 0;
}

.news-date {
  font-size: 0.9em;
  color: #888;
  margin-top: 5px;
}

.news-item p {
  font-size: 1em;
  color: #666;
  line-height: 1.6;
}

.btn {
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-details {
  background-color: #3498db;
  color: #fff;
}

.btn-details:hover {
  background-color: #2980b9;
  transform: scale(1.05);
}
</style>
