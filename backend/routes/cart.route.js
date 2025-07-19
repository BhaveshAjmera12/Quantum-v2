import express from 'express';
import { addInCart, decreaseQuantity, removeFromCart, clearCart, showCart } from '../controllers/cart.controller.js';
import {authUser} from '../middleware/auth.middleware.js' 

const router = express.Router();

router.post('/add', authUser, addInCart);
router.post('/decrease', authUser, decreaseQuantity);
router.post('/remove', authUser, removeFromCart);
router.post('/clear', authUser, clearCart);
router.post('/showCart', authUser, showCart);

export default router;
