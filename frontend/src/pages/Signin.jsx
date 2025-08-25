import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { faqData } from '../components/Features';
import { FiChevronDown } from 'react-icons/fi';
import user from '../assets/user.png';
import group from '../assets/users-alt.png'
import child from '../assets/smiling-baby.png'
import corporate from '../assets/corporate.png';
import globe from '../assets/globe.png';
import axios from 'axios';
import { useAuth } from '../context/Authentication';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



const Signin = () => {

    const navigate = useNavigate()

    const {login} = useAuth();

    const [openIndex, setOpenIndex] = useState(null);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [phone, setPhone] = useState('');
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [generatedOtp, setGeneratedOtp] = useState('');


    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleOtpInput = (value, index) => {
        if (!/^\d?$/.test(value)) return; // Only allow one digit

        const newOtp = [...otpDigits];
        newOtp[index] = value;
        setOtpDigits(newOtp);

        // Move to next box automatically
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const otp = otpDigits.join('');

    

    return (
        <div>
            {/* Top Section */}
            <div className='flex flex-col items-center justify-center text-center mt-5 mb-10 px-4'>
                <h1 className='text-5xl text-gray-700 font-semibold mb-2 py-2'>
                Open a free demat and trading account online
                </h1>
                <p className='text-xl text-gray-500 mb-6'>
                Start investing brokerage free and join a community of 1.6+ crore investors and traders
                </p>
            </div>

            {/* Main Section */}
            <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 mb-6 bg-white">
                <div className="md:w-1/2 flex justify-center mb-10 md:mb-0">
                <img src={assets.sign1} alt="" className="w-full max-w-md object-contain" />
                </div>

                <div className="md:w-1/2 space-y-6 text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-semibold">Signup now</h3>
                <p className="text-gray-500 text-md">Or track your existing application</p>

                
                <div className="flex items-center justify-center md:justify-start space-x-2">
                    <span className="bg-gray-100 px-4 py-3 rounded-l text-gray-600 font-semibold">+91</span>
                    <input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border border-gray-300 px-4 py-3 rounded-r w-full max-w-sm focus:outline-none"
                    />

                </div>

                
                <button
                    onClick={async () => {
                        try {
                        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, { phone });
                        const data = res.data;

                        if (data.alreadyExists) {
                            toast.error('User already exists with this phone number. Please log in. via kite');
                            // Optionally redirect or show login option here
                            return;
                        }

                        setShowOtpModal(true);
                        setGeneratedOtp(data.otp);
                        console.log(data.otp);

                        } catch (error) {
                        console.error('Error sending OTP:', error);
                        alert('Failed to send OTP');
                        }
                    }}
                    disabled={phone.length !== 10}
                    className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                        phone.length === 10
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                    >
                    Get OTP
                </button>



                {showOtpModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white relative rounded-lg shadow-lg p-8 w-full max-w-sm">
                            <button
                                onClick={() => setShowOtpModal(false)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
                            >
                                &times;
                            </button>
                        <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Enter OTP</h3>
                        
                        <div className="flex justify-center gap-2 mb-4">
                            {otpDigits.map((digit, idx) => (
                                <input
                                    key={idx}
                                    id={`otp-input-${idx}`}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleOtpInput(e.target.value, idx)}
                                    maxLength={1}
                                    className="w-10 h-12 border text-center text-xl rounded-md border-gray-300 focus:outline-none"
                                />
                            ))}
                        </div>
                        {generatedOtp && (
                            <p className="text-sm text-gray-500 mt-2 text-center">
                                <span className="font-semibold">Demo OTP:</span> {generatedOtp}
                            </p>
                        )}



                        {otp.length === 6 && (
                            <button
                                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                                onClick={async () => {
                                try {
                                    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
                                    phone,
                                    otp,
                                    });

                                    if (res.data.message === 'OTP verified') {
                                        console.log('OTP verified successfully:', res.data);
                                        login(res.data.token);
                                        localStorage.setItem('phone', phone);
                                        const steps = res.data.stepsCompleted;

                                        if (!steps.pan) {
                                            navigate('/pan');
                                        } else if (!steps.aadhaar) {
                                            navigate('/aadhaar');
                                        } else if (!steps.profile) {
                                            navigate('/profile');
                                        } else if (!steps.bank) {
                                            navigate('/bank');
                                        } else if (!steps.webcam) {
                                            navigate('/webcam');
                                        } else {
                                            navigate('/finalize');
                                        }
                                        } else {
                                        alert('Invalid OTP');
                                        }
                                    } catch (error) {
                                        alert('OTP verification failed');
                                        console.error(error);
                                    }
                                }}

                            >
                                Continue
                            </button>
                            )}

                        </div>
                    </div>
                    )}

        
                <p className="text-xs text-gray-400 max-w-md">
                    By proceeding, you agree to the Zerodha terms & privacy policy.
                </p>
                </div>
            </div>

            
            <div className="text-center my-16 px-4">
                <h2 className="text-3xl font-semibold text-gray-600 mb-10">Investment options with Zerodha demat account</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">

                    <div className="flex items-center space-x-6">
                        <img src={assets.stock} alt="" className="w-24 h-24 object-contain" />
                        <div>
                        <h4 className="text-xl font-semibold text-gray-800">Stocks</h4>
                        <p className="text-gray-500 text-sm">Invest in all exchange-listed securities</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <img src={assets.mf} alt="" className="w-24 h-24 object-contain" />
                        <div>
                        <h4 className="text-xl font-semibold text-gray-800">Mutual Funds</h4>
                        <p className="text-gray-500 text-sm">Invest in commission-free direct mutual funds</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <img src={assets.ipo} alt="" className="w-24 h-24 object-contain" />
                        <div>
                        <h4 className="text-xl font-semibold text-gray-800">IPO</h4>
                        <p className="text-gray-500 text-sm">Apply to the latest IPOs instantly via UPI</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <img src={assets.fo} alt="" className="w-24 h-24 object-contain" />
                        <div>
                        <h4 className="text-xl font-semibold text-gray-800">Futures & Options</h4>
                        <p className="text-gray-500 text-sm">Hedge and mitigate market risk through simplified F&O trading</p>
                        </div>
                    </div>
                </div>

                
                <div className="mt-10">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200">
                    Explore Investment
                </button>
                </div>
            </div>

            {/* Steps Section */}
            <div className="bg-gray-100 py-16 px-6 md:px-20 mb-5">
                <h2 className="text-3xl font-semibold text-gray-600 text-center mb-12">
                    Steps to open a demat account with Zerodha
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    
                    <div className="md:w-1/2 flex justify-center">
                    <img
                        src={assets.step}
                        alt="Steps illustration"
                        className="w-full max-w-md object-contain"
                    />
                    </div>

                    <div className="md:w-1/2 space-y-8 relative pl-10">
                        <div className="absolute left-4 top-10 h-9 border-l-2  border-gray-400"></div>

                        {/* Step 1 */}
                        <div className="flex items-start space-x-4 relative">
                            <div className="w-8 h-8 rounded-full bg-gray-100 border border-black flex items-center justify-center font-bold z-10">
                            1
                            </div>
                            <div>
                            <h4 className="text-xl font-semibold text-gray-800">Enter the requested details</h4>
                            </div>
                        </div>
                        <div className="absolute left-4 top-15 h-9 border-l-2 border-gray-400"></div>

                        {/* Step 2 */}
                        <div className="flex items-start space-x-4 relative">
                            <div className="w-8 h-8 rounded-full bg-gray-100 border border-black flex items-center justify-center font-bold z-10">
                            2
                            </div>
                            <div>
                            <h4 className="text-xl font-semibold text-gray-800">Complete e-sign & verification</h4>
                            </div>
                        </div>
                        <div className="absolute left-4 top-30 h-9 border-l-2 border-gray-400"></div>

                        {/* Step 3 */}
                        <div className="flex items-start space-x-4 relative">
                            <div className="w-8 h-8 rounded-full bg-gray-100 border border-black flex items-center justify-center font-bold z-10">
                            3
                            </div>
                            <div>
                            <h4 className="text-xl font-semibold text-gray-800">Start investing</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-16 px-6 md:px-20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    
                    
                    <div className="md:w-1/2 flex flex-col items-center text-center md:text-left">
                    <img
                        src={assets.benefit}
                        alt="Benefits illustration"
                        className="w-full max-w-md object-contain mb-4"
                    />
                    <h3 className="text-3xl font-semibold text-gray-600">
                        Benefits of opening a Zerodha demat account
                    </h3>
                    </div>

                    
                    <div className="md:w-1/2 space-y-6 mb-5">
                        <div>
                            <h4 className="text-xl mb-3 font-semibold text-gray-800">Unbeatable pricing</h4>
                            <p className="text-gray-600">
                            Zero charges for equity & mutual fund investments. Flat ₹20 fees for intraday and F&O trades.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xl mb-3 font-semibold text-gray-800">Best investing experience</h4>
                            <p className="text-gray-600">
                            Simple and intuitive trading platform with an easy-to-understand user interface.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xl mb-3 font-semibold text-gray-800">No spam or gimmicks</h4>
                            <p className="text-gray-600">
                            Committed to transparency — no gimmicks, spam, "gamification", or intrusive push notifications.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xl mb-3 font-semibold text-gray-800">The Zerodha universe</h4>
                            <p className="text-gray-600">
                            More than just an app — gain free access to the entire ecosystem of our partner products.
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Account Types Section */}
            <div className="py-16 px-6 md:px-20 bg-white">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
                    Explore different account types
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
                    
                    
                    <div className="relative bg-white border border-gray-300 rounded-2xl pt-12 pb-6 px-6 text-center hover:shadow-md transition">
                    
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full border border-gray-300 shadow">
                        <img src={user} alt="Equity" className="w-12 h-12 object-contain" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 mt-2">Individual Account</h4>
                    <p className="text-sm text-gray-600">
                        Invest in equity,mutual funds and derivatives
                    </p>
                    </div>

                    
                    <div className="relative bg-white border border-gray-300 rounded-2xl pt-12 pb-6 px-6 text-center hover:shadow-md transition">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full border border-gray-300 shadow">
                        <img src={group} alt="F&O" className="w-12 h-12 object-contain" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 mt-2">HUF Account</h4>
                    <p className="text-sm text-gray-600">
                        Make tax-efficient investments for your family
                    </p>
                    </div>

                    
                    <div className="relative bg-white border border-gray-300 rounded-2xl pt-12 pb-6 px-6 text-center hover:shadow-md transition">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full border border-gray-300 shadow">
                        <img src={globe} alt="Mutual Fund" className="w-12 h-12 object-contain" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 mt-2">NRI Account</h4>
                    <p className="text-sm text-gray-600">
                        Invest in equity, mutual funds,debentures, and more
                    </p>
                    </div>

                    
                    <div className="relative bg-white border border-gray-300 rounded-2xl pt-12 pb-6 px-6 text-center hover:shadow-md transition">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full border border-gray-300 shadow">
                        <img src={child} alt="NRI" className="w-12 h-12 object-contain" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 mt-2">Minor Account</h4>
                    <p className="text-sm text-gray-600">
                        Teach your little ones about money & invest for their future with them.
                    </p>
                    </div>


                    <div className="relative bg-white border border-gray-300 rounded-2xl pt-12 pb-6 px-6 text-center hover:shadow-md transition">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full border border-gray-300 shadow">
                        <img src={corporate} alt="NRI" className="w-12 h-12 object-contain" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 mt-2">Corporate/LLP/Partnership</h4>
                    <p className="text-sm text-gray-600">
                        Manage your business surplus and investments easily
                    </p>
                    </div>

                </div>
            </div>

            <div className="py-20 px-6 md:px-20 bg-white">
               {/*FAQ section */} 
        <h2 className="text-2xl font-semibold text-center text-gray-600 mb-12">FAQs</h2>

            <div className="max-w-4xl mx-auto">
                {faqData.map((item, index) => (
                <div
                    key={index}
                    className="border-b border-gray-300 py-5 group cursor-pointer"
                    onClick={() => toggleFAQ(index)}
                >
                    <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium text-gray-800 relative w-fit">
                        <span className="hover:text-blue-600 transition">{item.question}</span>
                        <span
                        className="block h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
                        ></span>
                    </h4>

                    <FiChevronDown
                        className={`text-xl text-gray-500 transform transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180' : ''
                        }`}
                    />
                    </div>

                    {openIndex === index && (
                    <p className="mt-4 text-gray-600 transition-all duration-300">{item.answer}</p>
                    )}
                </div>
                ))}
            </div>
        </div>

        {/* Call-to-Action Section */}
            <div className="bg-white py-20 px-6 md:px-20 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-600 mb-4">
                    Open a Zerodha account
                </h2>
                <p className="text-lg text-gray-400 mb-8">
                    Simple and intuitive apps · ₹0 for investments · ₹20 for intraday and F&O trades.
                </p>
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-blue-400 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition"
                >
                    Sign up for free
                </button>
            </div>


        </div>
    );
};

export default Signin;
