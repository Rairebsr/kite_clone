import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import axios from 'axios';

const Funds = () => {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [equity, setEquity] = useState({});
  const [commodity, setCommodity] = useState({});
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedPaymentApp, setSelectedPaymentApp] = useState('RAZORPAY');
  const [selectedSegment,setSelectedSegment] = useState('EQUITY');
  const [amount, setAmount] = useState('');

  const handleWithdraw = async () => {
        const withdrawAmt = parseFloat(amount);
        if (isNaN(withdrawAmt) || withdrawAmt <= 0) {
          toast.error("Please enter a valid amount.")
          return;
        }

        const currentSegment = selectedSegment === "EQUITY" ? equity : commodity;

      if (withdrawAmt > currentSegment.availableMargin) {
        toast.error("Insufficient balance to withdraw!")
        return;
      }
      if (selectedSegment === "EQUITY") {
        setEquity((prev) => ({
          ...prev,
          availableMargin: prev.availableMargin - withdrawAmt,
          payout: prev.payout + withdrawAmt
        }));
      } else {
        setCommodity((prev) => ({
          ...prev,
          availableMargin: prev.availableMargin - withdrawAmt,
          payout: prev.payout + withdrawAmt
        }));
      }

        try {
          const res = await fetch(`http://localhost:4000/api/funds/withdraw`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ userId, amount: withdrawAmt, segment: selectedSegment })
          });

          const result = await res.json();
          if (res.ok) {
            toast.success("Withdrawal successful!")
            setEquity((prev) => ({
              ...prev,
              availableMargin: prev.availableMargin - withdrawAmt,
              payout: prev.payout + withdrawAmt
            }));
          } else {
            toast.error(result.message || "Withdrawal failed!")
          }
        } catch (err) {
          console.error("Withdraw error:", err);
        }

        setShowWithdrawModal(false);
        setAmount('');
      };

      useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        axios
          .get('http://localhost:4000/api/auth/profile', {
            headers: { Authorization: token },
          })
          .then((res) => {
            setUser(res.data);
            console.log(res.data);
          })
          .catch((err) => {
            console.error(err);
          });
      }, []);

      

const handleAddFunds = async () => {
  const addAmt = parseFloat(amount);
  if (isNaN(addAmt) || addAmt <= 0) {
    toast.error("Enter a valid amount.")
    return;
  }

  try {
    const res = await fetch("http://localhost:4000/api/funds/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        amount: addAmt,
        segment:selectedSegment
      })
    });

    const result = await res.json();
    if (res.ok) {
      toast.success("Funds added successfully!")
      if (selectedSegment === "EQUITY") {
      setEquity(result.fund.equity);
    } else {
      setCommodity(result.fund.commodity);
    }

    } else {
      toast.info(result.message)
    }
  } catch (err) {
    console.error("Error:", err);
  }

  setShowAddFundsModal(false);
  setAmount('');
};

  // Decode token and get userId
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

  // Fetch orders once userId is set
  useEffect(() => {
  if (!userId) return;

  const fetchFunds = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/funds/get/${userId}`);
      const data = await res.json();
      setEquity(data.equity);
      setCommodity(data.commodity);
    } catch (err) {
      console.error("Error fetching fund data:", err);
    }
  };

  fetchFunds();
}, [userId]);

const launchRazorpay = () => {
  const options = {
    key: "RAZORPAY_KEY_ID", // Replace with your Razorpay key
    amount: amount * 100, // Amount in paise
    currency: "INR",
    name: "Stock App",
    description: "Add Funds",
    handler: function (response) {
      // send response.razorpay_payment_id to backend
      toast.success("Payment Successful");
      setShowAddFundsModal(false);
      setAmount('');
    },
    prefill: {
      contact: user.phone,
    },
    theme: {
      color: "#0f9d58",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


  

  const renderSection = (title, data, isEquity = true) => (
    <div className="w-full lg:w-1/2 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 h-full">
        <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">{title}</h2>
        <div className="space-y-4 text-base text-gray-700">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">Available margin:</span> 
            <span className="font-semibold">₹{data.availableMargin?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">Used margin:</span> 
            <span className="font-semibold">₹{data.usedMargin?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">Available cash:</span> 
            <span className="font-semibold">₹{data.availableMargin?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">Opening balance:</span> 
            <span className="font-semibold">₹{data.openingBalance?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">Payin:</span> 
            <span className="font-semibold">₹{data.payin}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">Payout:</span> 
            <span className="font-semibold">₹{data.payout}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">SPAN:</span> 
            <span className="font-semibold">₹{data.span}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">Delivery margin:</span> 
            <span className="font-semibold">₹{data.delivery}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">Exposure:</span> 
            <span className="font-semibold">₹{data.exposure}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">Options premium:</span> 
            <span className="font-semibold">₹{data.options}</span>
          </div>
          {isEquity && (
            <>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium">Collateral (Liquid funds):</span> 
                <span className="font-semibold">₹{data.collateralLiquid}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium">Collateral (Equity):</span> 
                <span className="font-semibold">₹{data.collateralEquity}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Total collateral:</span> 
                <span className="font-semibold text-blue-600">₹{(data.collateralLiquid + data.collateralEquity).toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Funds Overview</h1>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowAddFundsModal(true)}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors"
            >
              Add Funds
            </button>
            <button 
              onClick={() => setShowWithdrawModal(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
            >
              Withdraw
            </button>
          </div>
        </div>

        <div className="flex flex-wrap -mx-4">
          {renderSection('Equity Funds', equity, true)}
          {renderSection('Commodity Funds', commodity, false)}
        </div>
      </div>

      {/* Add Funds Modal */}
      {/* Add Funds Modal */}
{showAddFundsModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Add Funds</h2>

      {/* Segment Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Segment</label>
        <select
          value={selectedSegment}
          onChange={(e) => setSelectedSegment(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="EQUITY">Equity</option>
          <option value="COMMODITY">Commodity</option>
        </select>
      </div>

      {/* Payment App */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Choose Payment Method</label>
        <select
          value={selectedPaymentApp}
          onChange={(e) => setSelectedPaymentApp(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="RAZORPAY">Razorpay</option>
          <option disabled>Paytm (Coming soon)</option>
          <option disabled>PhonePe (Coming soon)</option>
        </select>
      </div>

      {/* Bank Info Display */}
      {user ? (
  <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
    <p><strong>Bank Verified</strong></p>
    <p>Phone: {user.phone}</p>
    <p>User ID: {user.userId}</p>
  </div>
) : (
  <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
    <p>Loading user details...</p>
  </div>
)}


      {/* Amount */}
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount (₹)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter amount"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            setShowAddFundsModal(false);
            setAmount('');
          }}
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleAddFunds}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
        >
          Make Payment
        </button>
      </div>
    </div>
  </div>
)}

      {/* Withdraw Modal */}
{showWithdrawModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Withdraw Funds</h2>

      {/* Segment Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Segment</label>
        <select
          value={selectedSegment}
          onChange={(e) => setSelectedSegment(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="EQUITY">Equity</option>
          <option value="COMMODITY">Commodity</option>
        </select>
      </div>

      {/* Bank Info Display */}
      <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
        <p><strong>Bank Verified</strong></p>
        <p>Phone: {user.phone}</p>
        <p>User ID: {user.userId}</p>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount to Withdraw (₹)
        </label>
        <input
          type="number"
          id="withdraw-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter amount"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            setShowWithdrawModal(false);
            setAmount('');
          }}
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleWithdraw}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Withdraw Funds
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Funds;