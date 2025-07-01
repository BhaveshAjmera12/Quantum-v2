import express from 'express';
import { addInCart } from '../controllers/cart.controller.js';
import {authUser} from '../middleware/auth.middleware.js' 

const router = express.Router();

router.post('/add', authUser, addInCart);

export default router;
