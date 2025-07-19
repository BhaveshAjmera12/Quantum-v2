import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        unique: true // Each user has only one cart
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            },
            price: { 
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
  type: Number,
  default: 0 // ✅ Add default value
  // required: true // Remove required
},
     totalItems: { type: Number, default: 0 },
}, {
    timestamps: true
});

const cartmodel = mongoose.model('cart', cartSchema);

export default cartmodel;
