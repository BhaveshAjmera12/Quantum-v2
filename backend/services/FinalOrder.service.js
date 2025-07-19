import OrderModel from '../models/FinalOrder.model.js';

export const createOrder = async (userId, products, shippingPrice) => {
  let productsTotal = 0;

  const processedProducts = products.map(item => {
    const totalPrice = item.price * item.quantity;
    productsTotal += totalPrice;

    return {
      productId: item.productId,
      name: item.name,
      brand: item.brand,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      totalPrice
    };
  });

  const grandTotal = productsTotal + shippingPrice;

  return await OrderModel.create({
    user: userId,
    products: processedProducts,
    shippingPrice,
    grandTotal,
    paymentMethod: "No Selection", // default
    isPaid: false,                 // default
    orderStatus: "Processing"     // default
  });
};
