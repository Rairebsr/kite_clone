import React from 'react'
import { useState } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const LoginPg = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [showAccountNo,setShowAccountNo] = useState(false)
    const [qrCode,setQrCode] = useState([])
    const navigate = useNavigate()

    const handleLogin = async () => {
        try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
            userId,
            password,
        });

        if (res.status === 200) {
            setQrCode(res.data.qrCode); // ← display this
            setStep(2); // Show OTP input
        }
        } catch (err) {
        console.error(err);
        toast.error('Wrong password or userId')
        
        }
    };

    const handleOtpVerify = async () => {
        try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-totp`, {
            userId,
            token:otp,
        });

        if (res.status === 200) {
            toast.success('Login successful')
            localStorage.setItem('token', res.data.token);
            // localStorage.setItem('userId', userId); 
            navigate('/dashboard')
        }
        } catch (err) {
        console.error(err);
        toast.error('OTP verification failed')
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-center mb-6">
                <img className='w-12 flex item-center justify-center' src={assets.kite} alt="" />    
            </div>
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Login to Kite
            </h2>

            {step === 1 && (
            <>
                <input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="User ID"
                className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required
                />
                <div className="relative mb-4">
                    <input
                        type={showAccountNo ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowAccountNo(!showAccountNo)}
                        className="absolute right-3 top-2.5 text-gray-500"
                    >
                        {showAccountNo ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <button
                onClick={handleLogin}
                className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-400 transition"
                >
                Continue
                </button>
            </>
            )}

            {step === 2 && (
            <>
                <p className="text-center text-sm text-gray-600 mb-2">
                Scan this QR code with Google Authenticator
                </p>
                <img src={qrCode} alt="QR Code" className="mx-auto mb-4 w-40 h-40" />

                <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                onClick={handleOtpVerify}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
                >
                Verify
                </button>
            </>
            )}
        </div>
        </div>
    );
};

export default LoginPg
