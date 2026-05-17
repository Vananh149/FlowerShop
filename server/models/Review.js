import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    productId: {
        type: String, // Dùng String để khớp với ID sản phẩm hiện tại (nếu dùng UUID) hoặc ObjectId
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        alias: 'userName'
    },
    orderId: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    content: {
        type: String,
        required: true,
        alias: 'comment'
    },
    image: {
        type: String, // Lưu link ảnh (Cloudinary hoặc base64)
        default: ""
    },
    avatarLetter: {
        type: String,
        default: "K"
    },
    avatarBg: {
        type: String,
        default: "#8C5D5D"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
