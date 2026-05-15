import Product from '../models/Product.js';

// @desc    Lấy tất cả sản phẩm hoa
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        // Dùng lệnh .find() của Mongoose để lấy toàn bộ dữ liệu trong bảng products
        const products = await Product.find();
        
        // Trả về mã 200 (Thành công) và gửi đống dữ liệu đó cho người gọi (React)
        res.status(200).json(products);
    } catch (error) {
        // Nếu có lỗi (ví dụ rớt mạng database), trả về lỗi 500
        res.status(500).json({ 
            message: "Server không lấy được danh sách hoa rồi bạn ơi!",
            error: error.message 
        });
    }
};

// @desc    Lấy chi tiết 1 bông hoa theo ID
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Không tìm thấy bông hoa này!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
};
