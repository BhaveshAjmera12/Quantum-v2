import mongoose from 'mongoose'

const orderSchema =  new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
      },
      products: [{
    productid:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required:true,
    },
    name: { type: String, required: true },       // Embedded product data
    brand: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },     // Price per unit at checkout
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true } // price * quantity
  }],
     taxPrice: { type: Number, default: 0 },
     shippingPrice: { type: Number, default: 50 },  // Fixed, set by backend
     grandTotal: { type: Number,  },
      createdAt: { type: Date, default: Date.now }
})

const ordermodel = mongoose.model('orders', orderSchema)
export default ordermodel