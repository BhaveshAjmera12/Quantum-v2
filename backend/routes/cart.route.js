import express from 'express';
import {
  addInCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  showCart
} from '../controllers/cart.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/add', authUser, addInCart);                     // Add new product
router.patch('/increase/:productId', authUser, increaseQuantity); // 🔥 NEW
router.patch('/decrease/:productId', authUser, decreaseQuantity); // You already have logic
router.delete('/remove/:productId', authUser, removeFromCart);    // REST-style
router.delete('/clear', authUser, clearCart);
router.get('/', authUser, showCart);                              // REST-style GET

export default router;
