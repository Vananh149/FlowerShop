import Cart from '../models/Cart.js';

// @desc    Lấy giỏ hàng của người dùng
// @route   GET /api/cart/:userId
export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        let cart = await Cart.findOne({ userId });

        // Nếu người dùng chưa từng có giỏ hàng, tạo một cái trống
        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy giỏ hàng", error: error.message });
    }
};

// @desc    Cập nhật giỏ hàng (Thêm/Sửa/Xóa items)
// @route   POST /api/cart
export const updateCart = async (req, res) => {
    try {
        const { userId, items } = req.body;

        // Tìm giỏ hàng của user và cập nhật danh sách items mới
        // upsert: true nghĩa là nếu chưa có thì tạo mới luôn
        const cart = await Cart.findOneAndUpdate(
            { userId },
            { items, updatedAt: Date.now() },
            { new: true, upsert: true }
        );

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật giỏ hàng", error: error.message });
    }
};

// @desc    Xóa sạch giỏ hàng (Dùng sau khi đặt hàng thành công)
// @route   DELETE /api/cart/:userId
export const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOneAndUpdate(
            { userId },
            { items: [], updatedAt: Date.now() },
            { new: true }
        );
        res.status(200).json({ message: "Đã làm trống giỏ hàng", cart });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa giỏ hàng", error: error.message });
    }
};
