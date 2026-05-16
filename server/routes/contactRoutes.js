import express from 'express';
import { createContact } from '../controllers/contactController.js';

const router = express.Router();

// Đường dẫn: /api/contacts
router.post('/', createContact);

export default router;
