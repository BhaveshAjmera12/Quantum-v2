import React, { useState } from "react";
import { FaUserPlus, FaShoppingCart, FaList } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import AccountTypeSelector from "../smallcomponents/AccountTypeSelector";


const SecondaryNavbar = () => {

const navigate = useNavigate();
const location = useLocation();
const hiddenRoutes = ['/login', '/register']

const [visibility, setvisibility] = useState(false)
const visible = ()=>{
  setvisibility(prev => !prev);
}


if (hiddenRoutes.includes(location.pathname)) return null;
  
  return (
    <div className="bg-gray-100 py-3 px-6 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Left Side - Search Bar */}
        <div className="w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Right Side - Buttons */}
        <div className="hidden md:flex items-center space-x-4 ">
          {/* Sign Up Button */}
          <button onClick={visible} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            <FaUserPlus className="mr-2" />
            Sign Up
          </button>

           {/* select user Registration or a seller Registration */}
          {visibility && (
            <div className="absolute mt-[14vw] right-[5vw]">
            <AccountTypeSelector />
          </div>
          )}

          

          {/* Cart Button */}
          <button
          onClick={()=> navigate('/cartpage')} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
            <FaShoppingCart />
          </button>

          {/* Categories Button */}
          <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition">
            <FaList />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNavbar;
