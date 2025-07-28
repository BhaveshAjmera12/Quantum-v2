import cartModel from '../models/cart.model.js';
import logger from '../utils/logger.js';
import userModel from '../models/User.model.js';
import { createCart } from '../services/cart.service.js';
import productModel from '../models/Product.model.js';

// Helper function to get populated cart
const getFormattedCart = async (cartId) => {
  if (!cartId) return null;
  
  const cart = await cartModel.findById(cartId)
    .populate({
      path: "products.product",
      model: "product",
      select: "title price images"
    });

  if (!cart) return null;

  return {
    products: cart.products.filter(item => item.product !== null),
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice
  };
};

export const addInCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const productFromdb = await productModel.findById(productId);
    if (!productFromdb) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    let cart = await cartModel.findOne({ user: user._id });
    
    if (!cart) {
      await createCart(user._id, productId, productFromdb.price);
      cart = await cartModel.findOne({ user: user._id });
    } else {
      const existingProductIndex = cart.products.findIndex(
        p => p.product.toString() === productId
      );
      
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({
          product: productId,
          quantity: 1,
          price: productFromdb.price
        });
      }
      
      cart.totalItems = cart.products.reduce((sum, p) => sum + p.quantity, 0);
      cart.totalPrice = cart.products.reduce(
        (sum, p) => sum + p.quantity * p.price, 0
      );
      
      await cart.save();
    }

    const formattedCart = await getFormattedCart(cart._id);
    return res.status(200).json({
      message: "Product added to cart",
      cart: formattedCart
    });

  } catch (error) {
    logger.error("Error in addInCart controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const decreaseQuantity = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(401).json({ message: "Unauthorized user" });

    const { productId } = req.params;
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    let cart = await cartModel.findOne({ user: user._id });
    if (!cart) return res.status(404).json({ message: "No cart found" });

    const existingProductIndex = cart.products.findIndex(
      p => p.product.toString() === productId
    );

    if (existingProductIndex === -1) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    if (cart.products[existingProductIndex].quantity > 1) {
      cart.products[existingProductIndex].quantity -= 1;
    } else {
      cart.products.splice(existingProductIndex, 1);
    }

    // Delete cart if empty
    if (cart.products.length === 0) {
      await cartModel.deleteOne({ _id: cart._id });
      return res.status(200).json({ 
        message: "Cart emptied and deleted" 
      });
    }

    // Recalculate totals
    cart.totalItems = cart.products.reduce((sum, p) => sum + p.quantity, 0);
    cart.totalPrice = cart.products.reduce(
      (sum, p) => sum + p.quantity * p.price, 0
    );

    await cart.save();
    const formattedCart = await getFormattedCart(cart._id);
    return res.status(200).json({ 
      message: "Quantity decreased", 
      cart: formattedCart 
    });

  } catch (error) {
    logger.error("Error in decreaseQuantity:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(401).json({ message: "Unauthorized user" });

    const { productId } = req.params;
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    let cart = await cartModel.findOne({ user: user._id });
    if (!cart) return res.status(404).json({ message: "No cart found" });

    const initialLength = cart.products.length;
    cart.products = cart.products.filter(
      item => item.product.toString() !== productId
    );

    // If no products were removed
    if (initialLength === cart.products.length) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Delete cart if empty
    if (cart.products.length === 0) {
      await cartModel.deleteOne({ _id: cart._id });
      return res.status(200).json({ 
        message: "Cart emptied and deleted" 
      });
    }

    // Recalculate totals
    cart.totalItems = cart.products.reduce((sum, p) => sum + p.quantity, 0);
    cart.totalPrice = cart.products.reduce(
      (sum, p) => sum + p.quantity * p.price, 0
    );

    await cart.save();
    const formattedCart = await getFormattedCart(cart._id);
    return res.status(200).json({ 
      message: "Product removed", 
      cart: formattedCart 
    });

  } catch (error) {
    logger.error("Error in removeFromCart:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(401).json({ message: "Unauthorized user" });

    await cartModel.deleteOne({ user: user._id });
    return res.status(200).json({ message: "Cart cleared successfully" });

  } catch (error) {
    logger.error("Error in clearCart:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const showCart = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(401).json({ message: "Unauthorized user" });

    const cart = await cartModel.findOne({ user: user._id });
    if (!cart) return res.status(200).json({ message: "Cart is empty", cart: null });

    const formattedCart = await getFormattedCart(cart._id);
    return res.status(200).json({
      message: "Cart fetched successfully",
      cart: formattedCart
    });

  } catch (error) {
    logger.error("Error in showCart:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const increaseQuantity = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(401).json({ message: "Unauthorized user" });

    const { productId } = req.params;
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    const cart = await cartModel.findOne({ user: user._id });
    if (!cart) return res.status(404).json({ message: "No cart found" });

    const existingProductIndex = cart.products.findIndex(
      p => p.product.toString() === productId
    );

    if (existingProductIndex === -1) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    cart.products[existingProductIndex].quantity += 1;
    
    cart.totalItems = cart.products.reduce((sum, p) => sum + p.quantity, 0);
    cart.totalPrice = cart.products.reduce(
      (sum, p) => sum + p.quantity * p.price, 0
    );

    await cart.save();
    const formattedCart = await getFormattedCart(cart._id);
    return res.status(200).json({ 
      message: "Quantity increased", 
      cart: formattedCart 
    });

  } catch (error) {
    logger.error("Error in increaseQuantity:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};