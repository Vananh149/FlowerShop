import Review from '../models/Review.js';

// @desc    Tạo đánh giá mới
// @route   POST /api/reviews
export const createReview = async (req, res) => {
    try {
        const { productId, userId, name, rating, content, image } = req.body;

        const review = new Review({
            productId,
            userId,
            userName: name,      // Khớp với name từ frontend
            rating,
            comment: content,    // Khớp với content từ frontend
            image: image || ""   // Thêm ảnh nếu có
        });

        const savedReview = await review.save();
        res.status(201).json({
            success: true,
            data: savedReview
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Lấy danh sách đánh giá của một sản phẩm
// @route   GET /api/reviews/:productId
export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Lấy toàn bộ danh sách đánh giá (cho trang Reviews tổng)
// @route   GET /api/reviews
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Xóa đánh giá (Cho Admin)
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (review) {
            res.json({ success: true, message: "Đã xóa đánh giá thành công" });
        } else {
            res.status(404).json({ success: false, message: "Không tìm thấy đánh giá" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
