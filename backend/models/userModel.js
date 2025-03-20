const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Vui lòng nhập họ và tên!"],
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập địa chỉ email!"],
      unique: [true, "Địa chỉ email đã tồn tại!"],
    },
    password: {
      type: String,
      required: [true, "Vui lòng nhập mật khẩu!"],
    },
    phone: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Kiểm tra xem model đã tồn tại chưa để tránh lỗi OverwriteModelError
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
