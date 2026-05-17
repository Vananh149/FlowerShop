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

// @desc    Lấy tất cả tin nhắn liên hệ
// @route   GET /api/contacts
// @access  Private/Admin
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Xóa tin nhắn liên hệ
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (contact) {
      await Contact.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Đã xóa tin nhắn liên hệ thành công' });
    } else {
      res.status(404).json({ success: false, message: 'Không tìm thấy tin nhắn liên hệ' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Phản hồi tin nhắn liên hệ
// @route   PUT /api/contacts/reply/:id
// @access  Private/Admin
export const replyContact = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ success: false, message: 'Nội dung phản hồi không được để trống' });
    }

    const contact = await Contact.findById(req.params.id);
    if (contact) {
      contact.isReplied = true;
      contact.replyMessage = replyMessage;
      
      const updatedContact = await contact.save();
      res.json({
        success: true,
        message: 'Đã lưu và gửi phản hồi thành công!',
        data: updatedContact
      });
    } else {
      res.status(404).json({ success: false, message: 'Không tìm thấy tin nhắn liên hệ' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
