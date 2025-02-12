<template>
  <div class="intro-container">
    <h1 class="main-title">Giới Thiệu Về Cửa Hàng Bánh Kem</h1>
    <p class="intro-text">
      Chào mừng bạn đến với cửa hàng bánh kem của chúng tôi, nơi nghệ thuật làm bánh và hương vị ngọt ngào hòa quyện để tạo nên những chiếc bánh kem tuyệt hảo. Chúng tôi tự hào mang đến cho bạn những mẫu bánh kem độc đáo, từ nguyên liệu tươi ngon và chất lượng cao nhất.
    </p>

    <div class="section">
      <h2 class="section-title">Bánh Kem – Điểm Nhấn Cho Mọi Dịp Đặc Biệt</h2>
      <p class="section-text">
        Một chiếc bánh kem không chỉ là món tráng miệng, mà còn là linh hồn của các buổi tiệc sinh nhật, lễ kỷ niệm, và những khoảnh khắc ý nghĩa. Tại cửa hàng của chúng tôi, bạn sẽ tìm thấy đa dạng kiểu dáng và hương vị bánh kem, từ sự thanh lịch, nhẹ nhàng đến sự sáng tạo, đột phá.
      </p>
    </div>

    <div class="section">
      <h2 class="section-title">Cam Kết Về Chất Lượng</h2>
      <p class="section-text">
        Chúng tôi luôn đặt chất lượng lên hàng đầu, đảm bảo mỗi chiếc bánh đều được làm từ nguyên liệu tươi ngon nhất. Từ lớp kem mềm mịn, lớp bông lan xốp mềm, đến cách trang trí tỉ mỉ, chúng tôi mang đến những chiếc bánh không chỉ đẹp mắt mà còn đậm đà hương vị.
      </p>
    </div>

    <div class="section">
      <h2 class="section-title">Trải Nghiệm Đặt Bánh Dễ Dàng</h2>
      <p class="section-text">
        Với quy trình đặt bánh tiện lợi, bạn có thể dễ dàng chọn lựa và đặt hàng trực tuyến hoặc đến trực tiếp cửa hàng. Đội ngũ tư vấn thân thiện của chúng tôi sẵn sàng hỗ trợ bạn chọn được chiếc bánh hoàn hảo cho mọi dịp đặc biệt.
      </p>
    </div>

    <div class="section">
      <h2 class="section-title">Khám Phá Hương Vị Ngọt Ngào</h2>
      <p class="section-text">
        Hãy để chúng tôi cùng bạn tạo nên những khoảnh khắc đáng nhớ với hương vị bánh kem ngọt ngào. Từng chiếc bánh là một tác phẩm nghệ thuật, mang trong mình tình yêu và tâm huyết của những người thợ làm bánh tài hoa.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GioiThieuBanhKem',
};
</script>

<style scoped>
/* Tạo phong cách cho các phần giới thiệu */
.intro-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f8f8f8;
  border-radius: 8px;
}

.main-title {
  font-size: 36px;
  color: #222;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.intro-text {
  font-size: 16px;
  color: #555;
  text-align: center;
  line-height: 1.8;
  margin-bottom: 40px;
  font-family: 'Arial', sans-serif;
  font-style: italic;
}

.section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 28px;
  color: #222;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  text-transform: uppercase;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
 ;
}

.section-text {
  font-size: 16px;
  color: #555;
  line-height: 1.8;
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
}

.section-text:hover {
  color: #e74c3c;
  transition: color 0.3s ease;
}
</style>
