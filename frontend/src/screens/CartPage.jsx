import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showCart, increaseQty, decreaseQty, removeFromCart } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(showCart());
  }, [dispatch]);

  const handleIncrease = (productId) => {
  dispatch(increaseQty(productId))
  .unwrap()
  .then(() => dispatch(showCart()))
  .catch((err) => console.log("Error", err));

  };

  const handleDecrease = (productId) => {
    dispatch(decreaseQty(productId))
    .unwrap()
    .then(()=> dispatch(showCart))
    .catch((err)=> console.log('error',err))
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!items || items.length === 0)
    return <p className="text-center mt-10 text-gray-500">Your cart is empty</p>;

  // 🧠 Calculate total from items because state.items only has products
  const grandTotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.product._id}
            className="flex justify-between items-center border-b pb-4"
          >
            {/* Left Side - Image + Info + Quantity Controls */}
            <div className="flex items-center gap-4">
              <img
                src={item.product.images[0]}
                alt={item.product.modelname}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">{item.product.brand} {item.product.modelname}</h2>
                <p className="text-gray-600">₹{item.product.price}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <button
                    onClick={() => handleDecrease(item.product._id)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrease(item.product._id)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Total per item + Remove */}
            <div className="flex flex-col items-end">
              <button
                onClick={() => handleRemove(item.product._id)}
                className="text-red-500 hover:underline text-sm"
              >
                Remove
              </button>
              <p className="text-sm mt-2">
                Total: ₹{item.product.price * item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Total and Checkout */}
      <div className="flex justify-between items-center mt-8 border-t pt-4">
        <h2 className="text-xl font-semibold">Grand Total: ₹{grandTotal}</h2>
        <button
          onClick={handleCheckout}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
