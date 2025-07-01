import cartModel from '../models/cart.model.js'
import logger from '../utils/logger.js'
import userModel from '../models/User.model.js'
import User from '../models/User.model.js';
import {createCart} from '../services/cart.service.js'
import productModel from '../models/Product.model.js';

export const addInCart = async (req,res)=>{   
    try {
        let finalCart
        const {productId}= req.body;
        
          
        if(!productId){
            return res.status(400).json({message: "product id is required"})
        }

        const productFromdb = await productModel.findOne({ _id: productId })
        if (!productFromdb) {
      return res.status(404).json({ message: "Product not found" });
    }

        const price = productFromdb.price;
        
        const user = await userModel.findOne({email: req.user.email})

        if(!user){
           return res.status(401).json({message: "unauthorized access"});
        }

        const cart = await cartModel.findOne({user:user._id})
        
        if (!cart) {
        finalCart= await createCart(user._id, productId, price)
            
        }else{
            // we check cart ke andr product array me jo bhi product hai unme se kisi bhi product ke id frontend se aai hui product id se match hoti hai ya nahi. and save in existingProductIndex variable
            const existingProductIndex = await cart.products.findIndex(
                (p) => p.product.toString() === productId
            );
            
            if(existingProductIndex !== -1){
                cart.products[existingProductIndex].quantity += 1;
            }else{
                cart.products.push({product: productId, quantity: 1, price: price})
            }
            finalCart = cart
        }

        finalCart.totalItems = await cart.products.reduce((sum,p)=> sum + p.quantity, 0);
        finalCart.totalPrice = await cart.products.reduce((sum,p) => sum + p.quantity*p.price, 0)
        await finalCart.save();
        return res.status(200).json({ message: "Product added to cart", cart: finalCart });

       
    } catch (error) {
          logger.error("Error in addInCart controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
    }
}