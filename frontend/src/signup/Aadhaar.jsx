import React, { useContext } from 'react'
import { useState } from 'react';
import SignupLayout from './SignupLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function generateCaptcha() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}


const Aadhaar = () => {

    const [aadhaar, setAadhaar] = useState('');
    const [captchaText, setCaptchaText] = useState(generateCaptcha());
    const [captchaInput, setCaptchaInput] = useState('');
    const navigate = useNavigate();
    

    const handleAadhaarVerify = async() => {
        const token = localStorage.getItem('token');
        
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/steps/aadhaar`,
                    {},
                    {
                    headers: {
                        Authorization: token,
                    },
                    }
                );
            
                // ✅ Navigate to Aadhaar step
                navigate('/profile');
                } catch (error) {
                console.error('Error updating PAN step:', error);
                alert('Something went wrong!');
                }
    };



    return (
  <SignupLayout step={2} title="Aadhaar Verification">
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Verify Aadhaar</h2>
        <h3 className="text-lg font-medium mb-6 text-gray-600">Enter your Aadhaar details</h3>

        <div className="space-y-5 text-left">
          {/* Aadhaar Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Aadhaar Number</label>
            <input
              type="text"
              placeholder="Enter 12-digit Aadhaar number"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Captcha Block */}
          <div>
            <label className="block text-sm font-medium mb-1">Captcha</label>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-gray-100 px-4 py-2 rounded font-mono tracking-widest text-lg">
                {captchaText}
              </div>
              <button
                type="button"
                onClick={() => setCaptchaText(generateCaptcha())}
                className="text-sm text-blue-600 hover:underline"
              >
                Refresh
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter the text above"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Verify Button */}
          <button
            onClick={handleAadhaarVerify}
            disabled={aadhaar.length !== 12 || captchaInput !== captchaText}
            className={`w-full bg-green-600 text-white px-6 py-2 rounded-md font-semibold ${
              aadhaar.length !== 12 || captchaInput !== captchaText
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-green-700'
            } transition`}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  </SignupLayout>
);


}

export default Aadhaar
