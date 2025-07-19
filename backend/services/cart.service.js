import cartModel from '../models/cart.model.js';

export const createCart = async (userId, productId, price) => {
  try {
    const newCart = new cartModel({
      user: userId,
      products: [{ product: productId, quantity: 1, price: price }],
       totalItems: 1,
       totalPrice: price,
    });

    await newCart.save();
    return newCart;
  } catch (error) {
    throw new Error("Error while creating cart: " + error.message);
  }
};
