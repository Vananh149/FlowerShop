import express from 'express';
import { createReview, getProductReviews, getAllReviews, deleteReview, getUserReviewedOrders } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', createReview);
router.get('/', getAllReviews);
router.get('/user/:userId', getUserReviewedOrders);
router.get('/:productId', getProductReviews);
router.delete('/:id', deleteReview);

export default router;
