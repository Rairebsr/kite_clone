import React, { useState, useEffect } from "react";
import ipoData from "../assets/mock_stock_data_50.json";
import FundamentalsView from "./FundamentalView"; // Adjust path if needed
import { X } from "lucide-react"; 
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

const ApplyModal = ({ isOpen, onClose, ipo }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedIPO, setSelectedIPO] = useState(null);
const [showApplyModal, setShowApplyModal] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [upiProvider, setUpiProvider] = useState("");
  const [bidQty, setBidQty] = useState(1); // number of lots
  const [bidPrice, setBidPrice] = useState(ipo?.high || 0);
  const [showFundamentals, setShowFundamentals] = useState(false);
  const [bids, setBids] = useState([{ qty: 0, price: 0 }]);
  // const upiRegex = /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/;
  const [upiError, setUpiError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [userId, setUserId] = useState(null);

useEffect(() => {
  if (selectedCategory !== "Individual") {
    setDiscount(12); // Fixed discount for Employee
  } else {
    setDiscount(0);
  }
}, [selectedCategory]);
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    setUserId(decoded.id); // 👈 sets userId state
  }
}, []);

  useEffect(() => {
  if (ipo) {
    setBidQty(1); // default 1 lot
    setBidPrice(ipo.high); // prefill with upper band price
  }
}, [ipo]);

  if (!isOpen) return null;

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const resetModal = () => {
    setSelectedCategory(null);
    setUpiId("");
    setUpiProvider("");
    setBidQty(1);
    setBidPrice(ipo?.high || 0);
    onClose();
  };

  const calculateAmountPayable = () => {
    if (!ipo?.lot || !bidQty || !bidPrice) return 0;
    return bidQty * ipo.lot * bidPrice;
  };
  const totalDiscount = discount * ipo.lot;
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const handleBidChange = (index, field, value) => {
  const updated = [...bids];
  updated[index][field] = value;
  setBids(updated);
};

const addBid = () => {
  if (bids.length < 3) {
    setBids([...bids, { qty: 0, price: 0 }]);
  }
};

const deleteBid = (index) => {
  const updated = bids.filter((_, i) => i !== index);
  setBids(updated);
};
const isValidUpi = (upiId) => {
  const upiRegex = /^[\w.-]+@[\w.-]+$/;
  return upiRegex.test(upiId);
};
const isFormValid = isValidUpi(upiId) && upiProvider !== '';

const handleUpiChange = (e) => {
  const value = e.target.value;
  setUpiId(value);

  // live validate while typing (optional)
  if (upiError) {
    setUpiError(isValidUpi(value));
  }
};

const handleUpiBlur = () => {
  setUpiError(validateUpi(upiId));
};

const handleSubmit = async () => {
  try {
    if (!userId || !ipo?.symbol || !upiId || !upiProvider ) {
      alert('Please fill all fields before submitting.');
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ipo/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        symbol: ipo.symbol,
        upiId,
        upiProvider,// ✅ corrected here
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success('IPO Application submitted successfully!');
    } else {
      toast.error(`Failed: ${data.message}`);
    }
  } catch (error) {
    console.error('Submit error:', error);
    toast.error('Something went wrong. Try again.');
  }
};

// const calculateTotalAmount = () => lotQuantity * lotValue * bidPrice;

const calculateAmountPayableDiscount = () => {
  return Math.max(0, calculateAmountPayable() - totalDiscount); // Ensure it doesn't go below 0
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[95%] max-w-4xl">
        {!selectedCategory ? (
          <>
            <h2 className="text-lg font-semibold mb-4 text-center">
              Select Investor Category
            </h2>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleCategorySelect("individual")}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Individual Investor
              </button>
              <button
                onClick={() => handleCategorySelect("employee")}
                className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
              >
                Employee Category
              </button>
            </div>
            <button
              onClick={onClose}
              className="mt-5 text-sm text-gray-500 underline w-full text-center"
            >
              Cancel
            </button>
          </>
        ) : selectedCategory === "individual" ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Section */}
            <div className="md:w-1/2 space-y-3 text-sm">
              <div>
                <strong className="text-gray-500">Investor type:</strong>{" "}
                Individual investor
              </div>
              <div>
                <strong className="text-gray-500">Issue dates:</strong>{" "}
                {formatDate(ipo?.dates?.start)} — {formatDate(ipo?.dates?.end)}
              </div>
              <div>
                <strong className="text-gray-500">Issue size:</strong>{" "}
                {ipo?.size}
              </div>
              <div>
                <strong className="text-gray-500">Issue price:</strong> ₹
                {ipo?.low} – ₹{ipo?.high}
              </div>
              <div>
                <strong className="text-gray-500">Lot size:</strong>{" "}
                {ipo?.lot} shares
              </div>
              <div>
                <strong className="text-gray-500">Discount:</strong> NA
              </div>
              <div
  className="text-blue-600 underline cursor-pointer"
  onClick={() => setShowFundamentals(true)}
>
  Fundamentals
</div>
              <div
                  onClick={() => window.open('https://zerodha.com/ipo/415843/highway-infrastructure/', '_blank')}
                  className="text-blue-600 underline cursor-pointer"
                >
                  More information
                </div>
              <div className="text-xs text-gray-700 border p-2 rounded bg-gray-100">
                High risk: This stock will trade with a lot size of{" "}
                {ipo?.lot ? ipo.lot / 2 : "-"} shares in the SME segment.
              </div>
            </div>

            {/* Right Section */}
            <div className="md:w-1/2 space-y-4">
              <div>
                <label className="text-gray-600 text-sm">UPI ID</label>
                <div className="flex gap-2 mt-1">
                  <input
  type="text"
  placeholder="Enter your UPI ID"
  value={upiId}
  onChange={(e) => setUpiId(e.target.value)}
  className="border p-2 rounded w-full"
/>

  {upiError && (
    <p className="text-red-500 text-xs mt-1">{upiError}</p>
  )}
                  <select
  value={upiProvider}
  onChange={(e) => setUpiProvider(e.target.value)}
  className="border p-2 rounded w-full mt-2"
>
  <option value="">Select UPI Provider</option>
  <option value="Google Pay">Google Pay</option>
  <option value="PhonePe">PhonePe</option>
  <option value="Paytm">Paytm</option>
  <option value="BHIM">BHIM</option>
</select>
                </div>
              </div>

              <div>
  <div className="font-medium">Bids ({bids.length}/3)</div>

  {bids.map((bid, index) => (
    <div key={index} className="flex gap-2 mt-2 items-center">
      <input
        type="number"
        min="1"
        value={ipo?.lot}
        onChange={(e) =>
          handleBidChange(index, "qty", Number(e.target.value))
        }
        className="w-1/2 border p-2 rounded"
        placeholder="Lot Qty"
      />
      <input
                    type="number"
                    min={ipo?.low}
                    max={ipo?.high}
                    value={bidPrice}
                    onChange={(e) => setBidPrice(Number(e.target.value))}
                    className="w-1/2 border p-2 rounded"
                  />

      {bids.length > 1 && (
        <button
          onClick={() => deleteBid(index)}
          className="text-red-500 hover:text-red-700 ml-2"
        >
          ✕
        </button>
      )}
    </div>
  ))}

  {bids.length < 3 && (
    <button
      onClick={addBid}
      className="mt-3 text-blue-600 text-sm hover:underline"
    >
      + Add another bid
    </button>
  )}
</div>

              <div className="text-sm">
                <div className="text-gray-500">Amount payable</div>
                <div className="text-green-600 font-bold text-lg">
                  ₹{calculateAmountPayable().toLocaleString("en-IN")}.00
                </div>
              </div>

              <div className="text-xs text-gray-600">
                By submitting, I agree to the{" "}
                <div
                  onClick={() => window.open('https://zerodha.com/tos/ipo', '_blank')}
                  className="text-blue-600 underline cursor-pointer"
                >
                  More information
                </div>
                .
              </div>

              <div className="flex justify-end gap-4 mt-2">
                <button
  className={`px-4 py-2 rounded text-white ${
    isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
  }`}
  disabled={!isFormValid}
  onClick={handleSubmit}
>
  Submit
</button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={resetModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Section */}
            <div className="md:w-1/2 space-y-3 text-sm">
              <div>
                <strong className="text-gray-500">Investor type:</strong>{" "}
                Employee
              </div>
              <div>
                <strong className="text-gray-500">Issue dates:</strong>{" "}
                {formatDate(ipo?.dates?.start)} — {formatDate(ipo?.dates?.end)}
              </div>
              <div>
                <strong className="text-gray-500">Issue size:</strong>{" "}
                {ipo?.size}
              </div>
              <div>
                <strong className="text-gray-500">Issue price:</strong> ₹
                {ipo?.low} – ₹{ipo?.high}
              </div>
              <div>
                <strong className="text-gray-500">Lot size:</strong>{" "}
                {ipo?.lot} shares
              </div>
              <div>
                <strong className="text-gray-500">Discount:</strong> {discount}
              </div>
              <div
  className="text-blue-600 underline cursor-pointer"
  onClick={() => setShowFundamentals(true)}
>
  Fundamentals
</div>
              <div
                  onClick={() => window.open('https://zerodha.com/ipo/415843/highway-infrastructure/', '_blank')}
                  className="text-blue-600 underline cursor-pointer"
                >
                  More information
                </div>
              <div className="text-xs text-gray-700 border p-2 rounded bg-gray-100">
                High risk: This stock will trade with a lot size of{" "}
                {ipo?.lot ? ipo.lot / 2 : "-"} shares in the SME segment.
              </div>
            </div>

            {/* Right Section */}
            <div className="md:w-1/2 space-y-4">
              <div>
                <label className="text-gray-600 text-sm">UPI ID</label>
                <div className="flex gap-2 mt-1">
                  <input
  type="text"
  placeholder="Enter your UPI ID"
  value={upiId}
  onChange={(e) => setUpiId(e.target.value)}
  className="border p-2 rounded w-full"
/>
  {upiError && (
    <p className="text-red-500 text-xs mt-1">{upiError}</p>
  )}
<select
  value={upiProvider}
  onChange={(e) => setUpiProvider(e.target.value)}
  className="border p-2 rounded w-full mt-2"
>
  <option value="">Select UPI Provider</option>
  <option value="Google Pay">Google Pay</option>
  <option value="PhonePe">PhonePe</option>
  <option value="Paytm">Paytm</option>
  <option value="BHIM">BHIM</option>
</select>
                </div>
              </div>

              <div>
  <div className="font-medium">Bids ({bids.length}/3)</div>

  {bids.map((bid, index) => (
    <div key={index} className="flex gap-2 mt-2 items-center">
      <input
        type="number"
        min="1"
        value={ipo?.lot}
        onChange={(e) =>
          handleBidChange(index, "qty", Number(e.target.value))
        }
        className="w-1/2 border p-2 rounded"
        placeholder="Lot Qty"
      />
      <input
                    type="number"
                    min={ipo?.low}
                    max={ipo?.high}
                    value={bidPrice}
                    onChange={(e) => setBidPrice(Number(e.target.value))}
                    className="w-1/2 border p-2 rounded"
                  />

      {bids.length > 1 && (
        <button
          onClick={() => deleteBid(index)}
          className="text-red-500 hover:text-red-700 ml-2"
        >
          ✕
        </button>
      )}
    </div>
  ))}

  {bids.length < 3 && (
    <button
      onClick={addBid}
      className="mt-3 text-blue-600 text-sm hover:underline"
    >
      + Add another bid
    </button>
  )}
</div>

              <div className="text-sm">
                <div className="text-gray-500">Total Amount</div>
<div className="text-green-600 font-bold text-lg">
  ₹{calculateAmountPayable().toLocaleString("en-IN")}.00
</div>

<div className="text-gray-500">Discount</div>
<div className="text-green-600 font-bold text-lg">
  ₹{totalDiscount.toLocaleString("en-IN")}.00
</div>

<div className="text-gray-500">Amount Payable</div>
<div className="text-green-600 font-bold text-lg">
  ₹{calculateAmountPayableDiscount().toLocaleString("en-IN")}.00
</div>

              </div>

              <div className="text-xs text-gray-600">
                By submitting, I agree to the{" "}
                <div
                  onClick={() => window.open('https://zerodha.com/tos/ipo', '_blank')}
                  className="text-blue-600 underline cursor-pointer"
                >
                  More information
                </div>
                .
              </div>

              <div className="flex justify-end gap-4 mt-2">
                <button
  className={`px-4 py-2 rounded text-white ${
    isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
  }`}
  disabled={!isFormValid}
  onClick={handleSubmit}
>
  Submit
</button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={resetModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {showFundamentals && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white max-w-3xl w-full mx-4 rounded">
      <FundamentalsView
        ipo={{
          ...ipo,
          sector: "Aviation",
          description:
            "To be from mock data",
          peRatio: 13.71,
          pbRatio: 2.59,
          sectorPE: 33.34,
          sectorPB: 7.99,
          ipoSize: 102,
          ofsSize: 0,
          marketCap: 389,
          financials: [
            { year: "2023", revenue: 34.11, profit: 3.44, debt: 3.36 },
            { year: "2024", revenue: 106, profit: 11.25, debt: 2.56 },
            { year: "2025", revenue: 194, profit: 28.41, debt: 17.93 },
          ],
        }}
        onClose={() => setShowFundamentals(false)}
      />
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default ApplyModal;
