import express from 'express';
import { createReview, getProductReviews, getAllReviews, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', createReview);
router.get('/', getAllReviews);
router.get('/:productId', getProductReviews);
router.delete('/:id', deleteReview);

export default router;
