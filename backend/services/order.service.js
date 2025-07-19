import Ordermodel from '../models/order.model.js';

export const createOrder = async (userId, products, shippingPrice) => {
  // Calculate product-level totals and grand total
  let productsTotal = 0;
  
  const processedProducts = products.map(item => {
    const totalPrice = item.price * item.quantity;
    productsTotal += totalPrice;
    
    return {
      productid: item.productid,
      name: item.name,
      brand: item.brand,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      totalPrice  // product total = price * quantity
    };
  });

  // Calculate final totals
  const grandTotal = productsTotal + shippingPrice;

  // Create order with embedded products and calculated totals
  return await Ordermodel.create({
    user:userId,
    products: processedProducts,
    shippingPrice,
    grandTotal
  });
};

