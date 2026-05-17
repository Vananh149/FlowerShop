import Contact from '../models/contactModel.js';

// @desc    Gửi tin nhắn liên hệ mới
// @route   POST /api/contacts
// @access  Public
export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Tạo bản ghi mới trong Database
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    if (contact) {
      res.status(201).json({
        success: true,
        message: 'Cảm ơn bạn! Tin nhắn đã được gửi thành công.',
        data: contact,
      });
    } else {
      res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message,
    });
  }
};
