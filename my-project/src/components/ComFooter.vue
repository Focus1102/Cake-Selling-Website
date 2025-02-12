<template>
    <footer>
      <div class="footer-container">
        <div class="footer-column">
          <h3>Liên hệ với chúng tôi</h3>
          <p><strong>Email:</strong><a href="mailto:lienhe@tiembanhkem.com">lienhe@tiembanhkem.com</a></p>
          <p><strong>Facebook:</strong> <a href="https://facebook.com/tiembanhkem">facebook.com/tiembanhkem</a></p>
          <p><strong>Instagram:</strong> <a href="https://instagram.com/tiembanhkem">instagram.com/tiembanhkem</a></p>
        </div>
        <div class="footer-column">
          <h3>Sản phẩm</h3>
          <ul>
            <li><a href="#">Tritamisu</a></li>
            <li><a href="#">Matcha</a></li>
            <li><a href="#">Socola</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>Địa chỉ</h3>
          <p>33B, Phạm Văn Đồng, TP. HCM</p>
          <p>Điện thoại: <a href="tel:0985518643">0985518643</a></p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Hoài Nam. All rights reserved.</p>
      </div>
    </footer>
  </template>
  
  <script>
  export default {};
  </script>
  
  <style scoped>
  /* Tổng thể footer */
  footer {
    background-color: #f2f2f2; /* Màu nền sáng */
    color: #333333; /* Màu chữ đậm hơn để dễ đọc */
    padding: 40px 20px;
    font-family: 'Roboto', sans-serif;
  }
  
  .footer-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 0 auto;
    border-bottom: 1px solid #cccccc; /* Đường phân cách nhẹ */
    padding-bottom: 20px;
  }
  
  .footer-column {
    flex: 1;
    min-width: 200px;
    margin: 10px;
  }
  
  .footer-column h3 {
    color: #ff7f50; /* Màu cam nhẹ cho tiêu đề */
    font-size: 20px;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  /* Định dạng liên kết */
  .footer-column a {
    color: #007acc; /* Màu xanh nhạt cho liên kết */
    text-decoration: none;
    transition: color 0.3s;
  }
  
  .footer-column a:hover {
    color: #005f99;
    text-decoration: underline;
  }
  
  .footer-column ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .footer-column ul li {
    margin: 8px 0;
  }
  
  .footer-bottom {
    text-align: center;
    padding-top: 20px;
    color: #666666;
    font-size: 14px;
  }
  
  .footer-bottom p {
    margin: 0;
  }
  
  /* Hiệu ứng khi hover vào các phần tử chính */
  .footer-column:hover h3, .footer-column:hover a {
    color: #333333; /* Màu tối hơn khi hover */
    transition: color 0.3s ease;
  }
  </style>
  