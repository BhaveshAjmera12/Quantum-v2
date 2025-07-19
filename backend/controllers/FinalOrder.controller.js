import OrderModel from '../models/FinalOrder.model.js';
import userModel from '../models/User.model.js';
import { validationResult } from 'express-validator';
import { createOrder } from '../services/FinalOrder.service.js';

export const handleOrderCheckout = async (req, res) => {
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
    const userId = user._id;
    const shippingPrice = 50;

    // 🧹 Step 1: Remove existing unpaid "junk" order if exists
    await OrderModel.deleteMany({
      user: userId,
      paymentMethod: "No Selection",
      isPaid: false,
      orderStatus: "Processing"
    });

    // 🛒 Step 2: Create new order and calculate grand total
    const newOrder = await createOrder(userId, products, shippingPrice);

    return res.status(201).json({
      success: true,
      message: "Grand total calculated successfully",
      orderId: newOrder._id,
      grandTotal: newOrder.grandTotal
    });
  } catch (error) {
    console.error("Order creation failed:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};


export const finalizeOrderController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { orderId, shippingAddress, paymentMethod } = req.body;

  try {
    // ✅ Check payment method
    if (!["Cash on Delivery", "Online Payment"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid or missing payment method" });
    }

    // ✅ Authenticate user
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Find the order (unfinalized only)
    const order = await OrderModel.findOne({
      _id: orderId,
      user: user._id,
      paymentMethod: "No Selection",
      isPaid: false,
    });

    if (!order) {
      return res.status(400).json({ message: "Invalid or already finalized order" });
    }

    // ✅ Finalize order
    order.shippingAddress = shippingAddress;
    order.paymentMethod = paymentMethod;
    order.isPaid = paymentMethod === "Online Payment";
    order.paidAt = order.isPaid ? new Date() : null;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order finalized successfully",
    });
  } catch (error) {
    console.error("Finalizing order failed:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
