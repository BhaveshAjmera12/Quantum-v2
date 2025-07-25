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
        await createCart(user._id, productId, price);
        finalCart = await cartModel.findOne({user: user._id})
            
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

        finalCart.totalItems = finalCart.products.reduce((sum, p) => sum + p.quantity, 0);
        finalCart.totalPrice = finalCart.products.reduce((sum, p) => sum + p.quantity * p.price, 0);

        await finalCart.save();
        return res.status(200).json({ message: "Product added to cart", cart: finalCart });

       
    } catch (error) {
          logger.error("Error in addInCart controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const decreaseQuantity = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(400).json({ message: "Unauthorized user" });

    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    const cart = await cartModel.findOne({ user: user._id });
    if (!cart) return res.status(400).json({ message: "No cart found" });

    const existingProductIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (existingProductIndex === -1) {
      return res.status(400).json({ message: "Product not in cart" });
    }

    const currentQuantity = cart.products[existingProductIndex].quantity;

    if (currentQuantity > 1) {
      cart.products[existingProductIndex].quantity -= 1;
    } else {
      // Remove product
      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId
      );
    }

    // Check if cart is empty, delete if yes
    if (cart.products.length === 0) {
      await cartModel.deleteOne({ _id: cart._id });
      return res.status(200).json({ message: "Product removed and cart deleted (empty)" });
    }

    // Recalculate totals
    cart.totalItems = cart.products.reduce((sum, p) => sum + p.quantity, 0);
    cart.totalPrice = cart.products.reduce((sum, p) => sum + p.quantity * p.price, 0);

    await cart.save();
    return res.status(200).json({ message: "Product quantity decreased", cart });

  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(401).json({ message: "Unauthorized user" });

    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    const cart = await cartModel.findOne({ user: user._id });
    if (!cart) return res.status(400).json({ message: "No cart found" });

    const exists = cart.products.some(p => p.product.toString() === productId);
    if (!exists) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    // Remove product
    cart.products = cart.products.filter(
      item => item.product.toString() !== productId
    );

    // If cart becomes empty
    if (cart.products.length === 0) {
      await cartModel.deleteOne({ _id: cart._id });
      return res.status(200).json({ message: "Product removed and cart deleted (empty)" });
    }

    // Recalculate totals
    cart.totalItems = cart.products.reduce((sum, p) => sum + p.quantity, 0);
    cart.totalPrice = cart.products.reduce((sum, p) => sum + p.quantity * p.price, 0);

    await cart.save();
    return res.status(200).json({ message: "Product removed from cart", cart });

  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(401).json({ message: "Unauthorized user" });

    const cart = await cartModel.findOne({ user: user._id });
    if (!cart) return res.status(400).json({ message: "No cart found" });

    await cartModel.deleteOne({ _id: cart._id });

    return res.status(200).json({ message: "Cart cleared successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const showCart = async (req, res) => {
  try {
    console.log("req.user from token:", req.user);
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const cart = await cartModel.findOne({ user: user._id }).populate("products.product");

    if (!cart || cart.products.length === 0) {
      return res.status(200).json({ message: "Cart is empty", cart: null });
    }

    return res.status(200).json({
      message: "Cart fetched successfully",
      cart: {
        products: cart.products.map(item => ({
          productId: item.product._id,
          title: item.product.title,
          price: item.price,
          quantity: item.quantity,
          image: item.product.images[0], // only if you store image
        })),
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice
      }
    });

  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const increaseQuantity = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(401).json({ message: "Unauthorized user" });

    const { productId } = req.params;
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    const cart = await cartModel.findOne({ user: user._id });
    if (!cart) return res.status(400).json({ message: "No cart found" });

    const existingProductIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (existingProductIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products[existingProductIndex].quantity += 1;

    cart.totalItems = cart.products.reduce((sum, p) => sum + p.quantity, 0);
    cart.totalPrice = cart.products.reduce((sum, p) => sum + p.quantity * p.price, 0);

    await cart.save();
    return res.status(200).json({ message: "Quantity increased", cart });

  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


