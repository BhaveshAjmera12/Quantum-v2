import {createOrder} from '../services/order.service.js'
import logger from '../utils/logger.js'
import userModel from '../models/User.model.js'
import User from '../models/User.model.js';
import ordermodel from '../models/order.model.js';
import { validationResult } from 'express-validator';

export const createOrderController = async (req, res) => {
   // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


  try {
      const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
          return res.status(401).json({ message: "Unauthorized user" });
        }
    
        const { products } = req.body;
    const userId = user._id; // From auth middleware
    const shippingPrice = 50; // Fixed shipping cost

    const order = await createOrder(
      userId,
      products,
      shippingPrice
    );

    res.status(201).json({
      success: true,
      orderId: order._id,
      grandTotal: order.grandTotal
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Order creation failed', details: error.message });
  }
};
