import Review from '../models/Review.js';

// @desc    Tạo đánh giá mới
// @route   POST /api/reviews
export const createReview = async (req, res) => {
    try {
        const { productId, userId, name, rating, content, image, orderId, avatarLetter, avatarBg } = req.body;

        const review = new Review({
            productId,
            userId,
            orderId,
            name,
            rating,
            content,
            image: image || "",
            avatarLetter,
            avatarBg
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

// @desc    Lấy danh sách ID đơn hàng mà người dùng đã đánh giá
// @route   GET /api/reviews/user/:userId
export const getUserReviewedOrders = async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.params.userId }).select('orderId');
        const orderIds = reviews.map(review => review.orderId).filter(id => id);
        res.json(orderIds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Lấy danh sách đánh giá của một sản phẩm
// @route   GET /api/reviews/:productId
export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 }).lean();
        const mappedReviews = reviews.map(r => ({
            ...r,
            name: r.name || r.userName || "Khách hàng",
            content: r.content || r.comment || ""
        }));
        res.json(mappedReviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Lấy toàn bộ danh sách đánh giá (cho trang Reviews tổng)
// @route   GET /api/reviews
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 }).lean();
        // Map để đảm bảo có cả name và content (cho backward compatibility)
        const mappedReviews = reviews.map(r => ({
            ...r,
            name: r.name || r.userName || "Khách hàng",
            content: r.content || r.comment || ""
        }));
        res.json(mappedReviews);
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
