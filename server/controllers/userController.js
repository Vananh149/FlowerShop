import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Đăng nhập người dùng & Lấy token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng theo email
    const user = await User.findOne({ email });

    // Kiểm tra nếu có người dùng và mật khẩu khớp (dùng hàm matchPassword đã viết ở Model)
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Đăng ký người dùng mới
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'Người dùng đã tồn tại' });
    }

    // Tạo user mới (mật khẩu sẽ tự mã hóa nhờ middleware pre-save ở Model)
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
