import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const initiateRazorpayOrder = async (amount) => {
  const options = {
    amount: amount * 100, // in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);
  return order;
};
