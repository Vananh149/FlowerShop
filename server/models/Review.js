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
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    image: {
        type: String, // Lưu link ảnh (Cloudinary hoặc base64)
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
