import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="max-w-xs bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-1">Category: {product.category}</p>
        <p className="text-xl font-bold text-green-600">₹{product.price}</p>
        <button
         onClick={onAddToCart} 
         className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
