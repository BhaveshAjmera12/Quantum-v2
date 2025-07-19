// finalOrder.model.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
      },
      name: { type: String, required: true },
      brand: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      totalPrice: { type: Number, required: true }
    }
  ],

  shippingAddress: {
    addressLine: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },

  paymentMethod: {
    type: String,
   enum: ["No Selection", "Cash on Delivery", "Online Payment"],
   default: "No Selection"

  },

  taxPrice: {
    type: Number,
    default: 0
  },

  shippingPrice: {
    type: Number,
    default: 50
  },

  grandTotal: {
    type: Number,
    required: true
  },

  isPaid: {
    type: Boolean,
    default: false
  },

  paidAt: Date,

  orderStatus: {
    type: String,
    enum: ["Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"],
    default: "Processing"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("FinalOrder", orderSchema);
