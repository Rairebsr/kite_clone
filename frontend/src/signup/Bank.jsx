import React, { useState } from 'react';
import SignupLayout from './SignupLayout';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

const Bank = () => {
  const [ifsc, setIfsc] = useState('');
  const [micr, setMicr] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [bankName, setBankName] = useState('');
  const [branch, setBranch] = useState('');
  const [showAccountNo, setShowAccountNo] = useState(false); 
  const navigate = useNavigate();

  const handleContinue = async() => {
    
      const token = localStorage.getItem('token');
      
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/steps/bank`,
              {
  ifsc, micr, accountNo, bankName, branch
}
,
              {
                headers: {
                  Authorization: token,
                },
              }
            );
      navigate('/webcam');
    } catch (error) {
      console.error('Error updating details step:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <SignupLayout step={4} title="Bank Account Linking">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Link Your Bank Account</h2>
        <h3 className="text-lg font-medium mb-6">Provide your bank account details</h3>

        <div className="space-y-4 max-w-sm mx-auto text-left">
          <div>
            <label className="block text-sm font-medium mb-1 ml-1">IFSC Code</label>
            <input
              type="text"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value)}
              placeholder="IFSC Code"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 ml-1">MICR</label>
            <input
              type="text"
              value={micr}
              onChange={(e) => setMicr(e.target.value)}
              placeholder="MICR Code"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1 ml-1">Account Number</label>
            <input
                type={showAccountNo ? 'text' : 'password'}
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder="Account Number"
                className="w-full px-4 py-2 border rounded-md pr-10"
            />
            <button
                type="button"
                onClick={() => setShowAccountNo(!showAccountNo)}
                className="absolute right-3 top-9 text-gray-500"
            >
                {showAccountNo ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>


          <div>
            <label className="block text-sm font-medium mb-1 ml-1">Bank Name</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Bank Name"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 ml-1">Branch</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="Branch"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!ifsc || !micr || !accountNo || !bankName || !branch}
          className={`mt-6 bg-blue-600 text-white px-6 py-2 rounded ${
            !ifsc || !micr || !accountNo || !bankName || !branch
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-700'
          } transition`}
        >
          Continue
        </button>
      </div>
    </SignupLayout>
  );
};

export default Bank;
