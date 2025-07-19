import React from 'react'
import { Routes, Route } from "react-router-dom";
import Register from '../screens/Register';
import Login from '../screens/Login';
import Home from '../screens/Home';
import Shop from '../screens/shop';

const RouteFolder = () => {
  return (
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
  )
}

export default RouteFolder