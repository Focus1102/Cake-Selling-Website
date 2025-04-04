<template>
  <div class="page-container">
    <div class="content-grid">
      <div class="content-card vision">
        <h2>Giới thiệu "Cái lò nướng"</h2>
        <p>
        Chào mừng bạn đến với tiệm bánh kem <strong>"Cái lò nướng"</strong> của chúng tôi! Chúng tôi tự hào mang đến những chiếc bánh kem thơm ngon, tinh tế và đầy nghệ thuật, giúp bạn tạo nên những khoảnh khắc đáng nhớ. 
        Mỗi chiếc bánh không chỉ là một món ăn, mà còn là một tác phẩm nghệ thuật được tạo nên từ tâm huyết và sự sáng tạo. Chúng tôi cam kết mang đến những trải nghiệm tuyệt vời nhất cho khách hàng,
        từ hương vị thơm ngon đến hình thức tinh tế, đáp ứng mọi dịp quan trọng trong cuộc sống của bạn.
        </p>
      </div>

      <div class="content-card team">
        <h2>Đội ngũ của chúng tôi</h2>
        <p>
        Chúng tôi có đội ngũ thợ làm bánh chuyên nghiệp, sáng tạo và đam mê. Họ không ngừng nghiên cứu công thức mới để mang đến cho khách hàng những chiếc bánh không chỉ ngon mà còn mang giá trị nghệ thuật.
        Mỗi chiếc bánh là kết quả của sự cẩn thận, tinh tế và tận tâm, được tạo ra bởi những bàn tay lành nghề với mong muốn mang đến sự hài lòng tuyệt đối cho khách hàng. 
        Sự sáng tạo không ngừng của chúng tôi giúp tiệm bánh luôn đổi mới, mang đến những hương vị độc đáo và hình thức đẹp mắt, phù hợp với xu hướng hiện đại.
        </p>
      </div>

      <div class="content-card values">
        <h2>Giá trị cốt lõi</h2>
        <ul class="values-list">
          <li><strong>Chất Lượng Hàng Đầu</strong>: Sử dụng nguyên liệu tươi ngon, an toàn và đảm bảo vệ sinh</li>
          <li><strong>Khách Hàng Là Trọng Tâm</strong>: Lắng nghe và đáp ứng nhu cầu khách hàng</li>
          <li><strong>Đổi Mới Sáng Tạo</strong>: Cập nhật xu hướng và sáng tạo mẫu bánh độc đáo</li>
          <li><strong>Trách Nhiệm Xã Hội</strong>: Sử dụng nguyên liệu thân thiện môi trường</li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "ComGioiTh",
};
</script>

<style scoped>
.page-container {
  max-width: auto;
  margin: 0 auto;
  padding: 30px;
  background-color: #faf7f2;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.header-section {
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e6e0d4;
}

h1 {
  font-size: 2.2em;
  color: #5a3921;
  margin-bottom: auto;
  font-weight: 700;
}

h2 {
  font-size: 1.5em;
  margin-top: 40px;
  margin-bottom: 12px;
  font-weight: 600;
  text-align: center;
}

p {
  color: #594a42;
  line-height: 1.5;
  margin-bottom: 10px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.content-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
}

.content-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.vision h2 {
  color: #3c6e71;
}

.team h2 {
  color: #d86018;
}

.values h2 {
  color: #6b4226;
}

.values-list {
  padding-left: 20px;
  margin-top: 15px;
}

.values-list li {
  margin-bottom: 10px;
  color: #594a42;
  line-height: 1.4;
  position: relative;
}

.values-list li::marker {
  color: #6b4226;
}

.values-list li strong {
  color: #5a3921;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .page-container {
    padding: 20px;
  }
}
</style>
