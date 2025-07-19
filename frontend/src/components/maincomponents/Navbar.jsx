import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white py-3 px-6 rounded-4xl my-2 mx-2 border-black border-1">
      <div className="container mx-auto flex items-center justify-between">
        {/* Website Name */}
        <div className="text-2xl font-bold uppercase text-blue-600">Quantum</div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 text-gray-700 text-lg font-medium">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/shop" className="hover:text-blue-600 transition">Shop</Link>
          <Link to="/aboutus" className="hover:text-blue-600 transition">About Us</Link>
          <Link to="/contactus" className="hover:text-blue-600 transition">Contact Us</Link>
          <Link to="/blog" className="hover:text-blue-600 transition">Blog</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
