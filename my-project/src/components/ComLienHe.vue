<template>
  <div class="contact-container">
    <h1 class="contact-title">Liên Hệ Về Shop Bánh Kem</h1>
    <p class="contact-description">
      Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn trong quá trình chọn lựa sản phẩm bánh kem. Nếu bạn có bất kỳ câu hỏi hoặc cần thêm thông tin, vui lòng liên hệ với chúng tôi qua các phương thức dưới đây:
    </p>

    <div class="contact-info">
      <ul>
        <li><strong>Địa chỉ:</strong> 33B, Phạm Văn Đồng, Thành phố Hồ Chí Minh</li>
        <li><strong>Điện thoại:</strong> 0985518643</li>
        <li><strong>Email:</strong> <a href="mailto:lienhe@tiembanhkem.com">lienhe@tiembanhkem.com</a></li>
      </ul>
    </div>

    <p class="business-hours">
      Chúng tôi mở cửa từ <strong>8:00 sáng</strong> đến <strong>8:00 tối</strong>, từ thứ Hai đến Chủ Nhật.
    </p>

    <p class="social-connect">
      Kết nối với chúng tôi trên các nền tảng mạng xã hội để cập nhật những mẫu bánh kem mới nhất và các chương trình khuyến mãi đặc biệt:
    </p>

    <div class="social-links">
      <ul>
        <li><strong>Facebook:</strong> <a href="https://facebook.com/tiembanhkem">facebook.com/tiembanhkem</a></li>
        <li><strong>Instagram:</strong> <a href="https://instagram.com/tiembanhkem">instagram.com/tiembanhkem</a></li>
        <li><strong>Zalo:</strong> 0985518643</li>
      </ul>
    </div>

    <p class="final-message">
      Hãy liên hệ với chúng tôi để được tư vấn, giải đáp thắc mắc và tìm được chiếc bánh kem phù hợp nhất. Đội ngũ của chúng tôi rất vui lòng được phục vụ bạn.
    </p>
  </div>
</template>

<script>
export default {
  name: 'ComLienHe',
};
</script>

<style scoped>
/* Định dạng chung cho trang liên hệ */
.contact-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.contact-title {
  font-size: 32px;
  text-align: center;
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
}

.contact-description,
.business-hours,
.social-connect,
.final-message {
  font-size: 16px;
  color: #555;
  line-height: 1.6;
  text-align: center;
}

.contact-info ul,
.social-links ul {
  list-style-type: none;
  padding: 0;
  margin: 20px 0;
}

.contact-info li,
.social-links li {
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
}

.contact-info a,
.social-links a {
  color: #e74c3c;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-info a:hover,
.social-links a:hover {
  color: #c0392b;
}

.business-hours strong,
.social-connect strong {
  color: #333;
  font-weight: bold;
}

.social-links li {
  font-size: 16px;
  margin-bottom: 10px;
}

.final-message {
  font-size: 16px;
  color: #333;
  text-align: center;
  font-style: italic;
  margin-top: 30px;
}

/* Thêm hiệu ứng hover cho các liên kết */
.social-links a:hover {
  text-decoration: underline;
}
</style>
