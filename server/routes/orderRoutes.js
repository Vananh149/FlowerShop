import express from 'express';
import { createOrder, getMyOrders, updateOrderStatus, getOrderById, getAllOrders } from '../controllers/orderController.js';

const router = express.Router();

// Đường dẫn: /api/orders
router.post('/', createOrder);
router.get('/', getAllOrders); // Thêm route này cho Admin
router.get('/myorders/:userId', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

export default router;
