import React, { useState } from 'react';
import SignupLayout from './SignupLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Pan = () => {
  const [pan, setPan] = useState('');
  const [dob, setDob] = useState('');
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async () => {
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/steps/pan`,
        { pan },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // ✅ Navigate to Aadhaar step
      navigate('/aadhaar');
    } catch (error) {
      console.error('Error updating PAN step:', error);
      alert('Something went wrong!');
    }
  };

  return (
  <SignupLayout step={1} title="PAN Verification">
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Let's Get Started</h2>
        <h3 className="text-lg font-medium mb-6 text-gray-600">Enter your PAN details</h3>

        {/* PAN Input */}
        <div className="mb-4 text-left">
          <label className="block text-sm font-medium mb-1">PAN Number</label>
          <input
            type="text"
            placeholder="Enter PAN Number"
            value={pan}
            onChange={(e) => setPan(e.target.value.toUpperCase())}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* DOB Input */}
        <div className="mb-4 text-left">
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Terms and Conditions */}
        <div className="mt-4 mb-6 text-left">
          <label className="text-sm flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            I agree to the terms and conditions
          </label>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!agree || pan.length !== 10 || !dob}
          className={`w-full bg-blue-600 text-white px-6 py-2 rounded-md font-semibold ${
            !agree || pan.length !== 10 || !dob
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-700'
          } transition`}
        >
          Continue
        </button>
      </div>
    </div>
  </SignupLayout>
);

};

export default Pan;
