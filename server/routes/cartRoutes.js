import express from 'express';
import { getCart, updateCart, clearCart } from '../controllers/cartController.js';

const router = express.Router();

// Tất cả các đường dẫn này đều bắt đầu bằng /api/cart
router.get('/:userId', getCart);
router.post('/', updateCart);
router.delete('/:userId', clearCart);

export default router;
