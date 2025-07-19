import { initiateRazorpayOrder } from "../services/razorpay.service.js";

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await initiateRazorpayOrder(amount);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error.message);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};
