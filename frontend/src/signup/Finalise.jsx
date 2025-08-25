import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'



const Finalise = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const generateUserId = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let prefix = '';
  for (let i = 0; i < 3; i++) {
    prefix += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  const suffix = String(Math.floor(100 + Math.random() * 900)); // 100-999
  return prefix + suffix; // e.g., 'XYZ321'
};


  useEffect(() => {
  const generateUniqueUserId = async () => {
    let unique = false;
    let newId = '';

    while (!unique) {
      newId = generateUserId();

      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/steps/check-userid`, {
          userId: newId,
        });
        if (!res.data.exists) {
          unique = true;
        }
      } catch (err) {
        console.error('Error checking user ID:', err);
      }
    }

    setUserId(newId);
  };

  generateUniqueUserId();
}, []);



  const handleCopy = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleContinue = async () => {
  if (password.length < 8 || !/[!@#$%^&*]/.test(password)) {
    alert('Password must be at least 8 characters and include a special character.');
    return;
  }

  const token = localStorage.getItem('token');
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/steps/finalize`,
      { userId, password },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    toast.success('Account created! Redirecting to Kite...');

    // ✅ Redirect to deployed Kite app
    setTimeout(() => {
      window.location.href = "https://kite-kitefrontend.vercel.app/";
    }, 1500); // wait 1.5s so toast can show
  } catch (err) {
    console.error('Error finalizing account:', err);
    alert('Something went wrong!');
  }
};


 return (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br ">
    <div className="text-center p-8 bg-blue-100 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
      {/* Header with icon */}
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Your Account is Ready!</h2>
        <p className="text-gray-500 mt-2">Welcome to your new trading account</p>
      </div>

      {/* User ID section */}
      <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
        <p className='text-sm font-medium text-gray-600 mb-2'>Your User ID</p>
        <div className="flex items-center justify-between bg-white px-4 py-2 rounded border border-gray-200">
          <span className="font-mono text-gray-800">{userId}</span>
          <button 
            onClick={handleCopy}
            className={`flex items-center gap-1 text-sm ${copied ? 'text-green-600' : 'text-blue-600 hover:text-blue-800'}`}
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Password section */}
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2 text-left">
          Set your password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-left">Use 8+ characters with numbers and symbols</p>
      </div>

      {/* Continue button */}
      <button
        onClick={handleContinue}
        disabled={!password}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${!password ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'}`}
      >
        Continue to Dashboard
      </button>

      {/* Security note */}
      <p className="text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Your data is securely encrypted
      </p>
    </div>
  </div>
);

  
};

export default Finalise;

