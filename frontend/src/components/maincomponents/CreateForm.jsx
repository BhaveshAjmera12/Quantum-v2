import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import { toast } from 'react-toastify';

const CreateForm = () => {
  const location = useLocation();
  const isLogIn = location.pathname === '/login';
  const navigate = useNavigate();

  // Always use consistent form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Common input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit handler with dynamic payload based on isLogIn
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = isLogIn
      ? { email: formData.email, password: formData.password }
      : formData;

    console.log("Send to backend:", payload);

    // Example:
   try {
     const response = await axiosInstance.post(isLogIn ? '/users/login' : '/users/register' , payload)
  
    console.log("Successful:", response.data.token);
    toast.success(`${isLogIn ? "Login" : "Registration"} Successful`);

    setTimeout(()=>{
      navigate('/home')
    },1000)

   } catch (error) {
    console.error("Error during form submission:", error);
    toast.error(error.response.data.message || "Registration Failed");

   }
    
  };

  const toggleAuthMode = () => {
    navigate(isLogIn ? '/register' : '/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogIn ? 'Login' : 'Register'}
        </h2>

        {!isLogIn && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {isLogIn ? "Login" : "Register"}
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          {isLogIn ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            type="button"
            onClick={toggleAuthMode}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogIn ? "Register" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
