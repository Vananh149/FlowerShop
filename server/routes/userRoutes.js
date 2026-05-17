import express from 'express';
import { registerUser, authUser, updateUserProfile, getUsers, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.put('/profile/:id', updateUserProfile);
router.get('/', getUsers);
router.delete('/:id', deleteUser);

export default router;
