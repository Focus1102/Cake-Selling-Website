const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// Cấu hình SMTP theo mẫu tham khảo thành công
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "namvu22111999@gmail.com",
    pass: "hzrfervymoosuirv", // Sử dụng App Password từ mẫu tham khảo
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Kiểm tra kết nối
transporter.verify(function (error, success) {
  if (error) {
    console.log("Lỗi kết nối đến server email:", error);
  }
});

// API endpoint để gửi email
router.post("/send", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Kiểm tra dữ liệu
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    // Cấu hình email
    const mailOptions = {
      from: "namvu22111999@gmail.com",
      to: "nam.vuphanhoai@gmail.com",
      subject: `Tin nhắn mới từ ${name}`,
      text: `Bạn có tin nhắn mới từ: ${name} (${email})
      
Nội dung: ${message}`,
      html: `
        <h3>Bạn có tin nhắn mới từ website bán bánh kem</h3>
        <p><strong>Tên:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Nội dung:</strong></p>
        <p>${message}</p>
      `,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    // Phản hồi thành công
    res.status(200).json({
      success: true,
      message: "Email đã được gửi thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi gửi email",
      error: error.message,
    });
  }
});

module.exports = router;
