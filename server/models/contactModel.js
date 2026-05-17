import mongoose from 'mongoose';

const contactSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên của bạn'],
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
    },
    subject: {
      type: String,
      required: [true, 'Vui lòng nhập tiêu đề'],
    },
    message: {
      type: String,
      required: [true, 'Vui lòng nhập nội dung tin nhắn'],
    },
    isReplied: {
      type: Boolean,
      default: false,
    },
    replyMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Tự động thêm thời gian gửi (createdAt)
  }
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
