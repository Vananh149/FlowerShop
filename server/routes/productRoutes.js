import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

// Định nghĩa: Khi ai đó gửi yêu cầu GET tới địa chỉ "/" (tương đương /api/products)
// thì hãy chạy hàm getProducts trong Controller.
router.get('/', getProducts);

// Khi ai đó muốn xem 1 bông hoa cụ thể (ví dụ /api/products/123)
router.get('/:id', getProductById);

export default router;
