const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  flavors: [{
    type: String
  }],
  sizes: [{
    type: String
  }],
  order_only: {
    type: Boolean,
    default: false
  },
  sold: {
    type: Number,
    default: 0
  },
  brand: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false // Tắt version key (__v)
});

// Đảm bảo không tạo index tự động cho id
productSchema.set('autoIndex', false);

const Product = mongoose.model('Product', productSchema);

// Xóa index id nếu tồn tại
Product.collection.dropIndex('id_1')
  .then(() => console.log('Đã xóa index id_1'))
  .catch(() => console.log('Không có index id_1 để xóa'));

// Middleware để tự động tạo slug từ tên sản phẩm
productSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')      // Thay thế khoảng trắng bằng dấu gạch ngang
      .replace(/[^\w\-]+/g, '')   // Loại bỏ ký tự đặc biệt
      .replace(/\-\-+/g, '-')     // Thay thế nhiều dấu gạch ngang liên tiếp bằng một dấu gạch ngang
      .replace(/^-+/, '')         // Cắt dấu gạch ngang từ đầu
      .replace(/-+$/, '');        // Cắt dấu gạch ngang từ cuối
  }
  next();
});

// Middleware để cập nhật giá trị rating khi thêm review mới
productSchema.methods.updateRatingOnNewReview = function() {
  const total = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.numReviews = this.reviews.length;
  this.rating = total / this.numReviews;
  return this.save();
};

module.exports = Product; 