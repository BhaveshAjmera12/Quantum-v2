import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
   company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  images: {
    type: [String], // Store multiple image URLs
    required: true
  },
  modelname: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  ram: {
    type: String,
    required: true
  },
  storage: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  }
  
})

const productmodel = mongoose.model('product', ProductSchema)


export default productmodel