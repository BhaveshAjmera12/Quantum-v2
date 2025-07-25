import React from 'react'
import { Routes, Route } from "react-router-dom";
import Register from '../screens/Register';
import Login from '../screens/Login';
import Home from '../screens/Home';
import Shop from '../screens/shop';
import CartPage from '../screens/CartPage';


const RouteFolder = () => {
  return (
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cartpage" element={<CartPage />} />
      </Routes>
  )
}

export default RouteFolder