import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên'],
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true, // Đảm bảo không có 2 người dùng dùng chung 1 email
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false, // Mặc định là khách hàng thường
    },
  },
  {
    timestamps: true,
  }
);

// Hàm so khớp mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware tự động mã hóa mật khẩu trước khi lưu vào database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
