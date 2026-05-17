import express from 'express';
import { createContact, getContacts, deleteContact, replyContact } from '../controllers/contactController.js';

const router = express.Router();

// Đường dẫn: /api/contacts
router.post('/', createContact);
router.get('/', getContacts);
router.delete('/:id', deleteContact);
router.put('/reply/:id', replyContact);

export default router;
