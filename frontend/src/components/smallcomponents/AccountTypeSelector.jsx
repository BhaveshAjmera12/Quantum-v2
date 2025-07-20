import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccountTypeBox = () => {
  const navigate = useNavigate();

  return (
      <div className="bg-white shadow-lg rounded-3xl p-6 max-w-sm w-full text-center">
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/register')}
            className="w-full py-3 px-2 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            Register as User
          </button>

          <button
            onClick={() => navigate('/seller/register')}
            className="w-full py-3 px-2 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition"
          >
            Register as Seller
          </button>
        </div>
      </div>
   
  );
};

export default AccountTypeBox;
