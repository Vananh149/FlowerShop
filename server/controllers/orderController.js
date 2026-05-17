import Order from '../models/Order.js';

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
export const createOrder = async (req, res) => {
    try {
        const { userId, name, items, totalAmount, shippingAddress, phone, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Giỏ hàng trống" });
        }

        const order = new Order({
            userId,
            name,
            items,
            totalAmount,
            shippingAddress,
            phone,
            paymentMethod,
            status: 'Chờ xác nhận'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error: error.message });
    }
};

// @desc    Lấy danh sách đơn hàng của người dùng đang đăng nhập
// @route   GET /api/orders/myorders/:userId
export const getMyOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId }).sort({ createdAt: -1 }); // Mới nhất hiện lên đầu
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng", error: error.message });
    }
};

// @desc    Cập nhật trạng thái đơn hàng (Dùng để test luồng Hoàn tất -> Đánh giá)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật trạng thái", error: error.message });
    }
};

// @desc    Lấy chi tiết một đơn hàng theo ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng", error: error.message });
    }
};
// @desc    Lấy toàn bộ danh sách đơn hàng (Cho Admin)
// @route   GET /api/orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy toàn bộ đơn hàng", error: error.message });
    }
};
