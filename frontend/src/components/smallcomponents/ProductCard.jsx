import React from 'react';

const ProductCard = ({ image, name, price, category }) => {
  return (
    <div className="max-w-xs bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500 mb-1">Category: {category}</p>
        <p className="text-xl font-bold text-green-600">₹{price}</p>
        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
