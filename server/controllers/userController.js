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
        phone: user.phone || '',
        dob: user.dob || '',
        gender: user.gender || '',
        addresses: user.addresses || [],
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
        phone: user.phone || '',
        dob: user.dob || '',
        gender: user.gender || '',
        addresses: user.addresses || [],
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cập nhật thông tin cá nhân người dùng
// @route   PUT /api/users/profile/:id
// @access  Public/Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      
      if (req.body.phone !== undefined) user.phone = req.body.phone;
      if (req.body.dob !== undefined) user.dob = req.body.dob;
      if (req.body.gender !== undefined) user.gender = req.body.gender;
      if (req.body.addresses !== undefined) user.addresses = req.body.addresses;

      if (req.body.password) {
        if (!req.body.currentPassword) {
          return res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu hiện tại để xác minh' });
        }
        const isMatch = await user.matchPassword(req.body.currentPassword);
        if (!isMatch) {
          return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác' });
        }
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isAdmin: updatedUser.isAdmin,
        phone: updatedUser.phone || '',
        dob: updatedUser.dob || '',
        gender: updatedUser.gender || '',
        addresses: updatedUser.addresses || [],
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Lấy tất cả người dùng
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Xóa người dùng
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.isAdmin || user.role === 'admin') {
        return res.status(400).json({ success: false, message: 'Không thể xóa tài khoản Quản trị viên' });
      }
      await User.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Đã xóa tài khoản khách hàng thành công' });
    } else {
      res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
