<template>
  <div class="news-container">
    <h1 class="news-title">Tin Tức Mới Nhất Từ Tiệm Bánh Kem Của Chúng Tôi</h1>
    
    <section class="news-item">
      <h2>Khai Trương Cửa Hàng Bánh Kem Mới</h2>
      <p>Chúng tôi hân hạnh thông báo khai trương tiệm bánh kem mới tại địa chỉ Số 123, Đường ABC, Quận 1, TP. Hồ Chí Minh. Với không gian ấm cúng và hiện đại, tiệm bánh của chúng tôi hứa hẹn sẽ là nơi lý tưởng để bạn thưởng thức những chiếc bánh ngọt ngào và độc đáo nhất.</p>
    </section>

    <section class="news-item">
      <h2>Chương Trình Khuyến Mãi Mừng Khai Trương</h2>
      <p>Nhân dịp khai trương, chúng tôi triển khai chương trình khuyến mãi đặc biệt giảm giá đến 20% cho tất cả các loại bánh từ ngày 15 đến ngày 30. Đây là cơ hội tuyệt vời để bạn trải nghiệm hương vị bánh kem thơm ngon với mức giá ưu đãi. Hãy đến ngay để không bỏ lỡ cơ hội này!</p>
    </section>

    <section class="news-item">
      <h2>Ra Mắt Bộ Sưu Tập Bánh Mùa Thu 2024</h2>
      <p>Bộ sưu tập bánh kem mùa Thu 2024 đã chính thức có mặt tại tiệm! Những chiếc bánh trong bộ sưu tập lần này được làm thủ công với các hương vị tinh tế, kết hợp hoàn hảo giữa truyền thống và hiện đại. Hãy ghé qua để thưởng thức các mẫu bánh mới nhất của mùa Thu này!</p>
    </section>

    <section class="news-item">
      <h2>Cập Nhật Các Hoạt Động Trên Mạng Xã Hội</h2>
      <p>Theo dõi chúng tôi trên các kênh mạng xã hội để cập nhật các sản phẩm mới nhất, chương trình khuyến mãi hấp dẫn và nhiều thông tin thú vị khác. Hãy kết nối với chúng tôi qua:</p>
      <ul class="social-links">
        <li><strong>Facebook:</strong> <a href="https://facebook.com/tiembanhkem">facebook.com/tiembanhkem</a></li>
        <li><strong>Instagram:</strong> <a href="https://instagram.com/tiembanhkem">instagram.com/tiembanhkem</a></li>
        <li><strong>Zalo:</strong> 0985518643</li>
      </ul>
    </section>

    <section class="news-item">
      <h2>Liên Hệ Để Biết Thêm Chi Tiết</h2>
      <p>Nếu bạn có bất kỳ câu hỏi nào hoặc muốn biết thêm chi tiết, hãy liên hệ ngay với chúng tôi qua số điện thoại 0985518643 hoặc email <a href="mailto:lienhe@tiembanhkem.com">lienhe@tiembanhkem.com</a>. Đội ngũ tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn!</p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ComTinTuc',
};
</script>

<style scoped>
/* Định dạng chung cho trang tin tức */
.news-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.news-title {
  font-size: 32px;
  text-align: center;
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
}

.news-item {
  margin-bottom: 30px;
}

.news-item h2 {
  font-size: 24px;
  color: #e74c3c;
  margin-bottom: 10px;
}

.news-item p {
  font-size: 16px;
  color: #555;
  line-height: 1.6;
}

.social-links {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
}

.social-links li {
  font-size: 16px;
  margin-bottom: 8px;
}

.social-links a {
  color: #e74c3c;
  text-decoration: none;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: #c0392b;
  text-decoration: underline;
}

/* Thêm hiệu ứng hover cho các liên kết và văn bản */
.news-item a:hover {
  text-decoration: underline;
}
</style>
