// src/components/GsecApplyModal.jsx
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

const GsecApplyModal = ({ gsec, onClose }) => {
  const [amount, setAmount] = useState(gsec.minAmount); // example min
  const [quantity, setQuantity] = useState(100);
  const [userId, setUserId] = useState(null);
  const minAmount = gsec.minAmount;
  const pricePerUnit = gsec.price;

//   const quantity = 100;
  const totalAmount = (quantity * pricePerUnit).toFixed(2);

 useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded);  // ✅ check this in browser console
    setUserId(decoded.id);
  } else {
    console.log("No token found in localStorage");
  }
}, []);

//   const handleSubmit = async () => {
//     if (amount < minAmount) {
//       alert(`Minimum amount is ₹${minAmount}`);
//       return;
//     }

    const handleAmountChange = (value) => {
    const enteredAmount = Number(value);
    if (enteredAmount < minAmount) {
      setAmount(enteredAmount);
      setQuantity(100);
      return;
    }

    const units = Math.floor(enteredAmount / pricePerUnit / 100) * 100 || 100;
    const adjustedAmount = units * pricePerUnit;

    setAmount(adjustedAmount);
    setQuantity(units);
  };
    // const token = localStorage.getItem("token");
    // const { userId } = jwtDecode(token);

    const handleSubmit = async () => {
  if (!userId) {
    alert("User not logged in");
    return;
  }

  const token = localStorage.getItem("token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/gsec/apply`, {
  method: "POST",
  headers: {
  "Content-Type": "application/json",
  "Authorization": localStorage.getItem("token"),
},
  body: JSON.stringify({
  symbol: gsec.symbol,
  name: gsec.name,
  price: pricePerUnit,
  amount: Number(totalAmount),
}),
});

  const data = await res.json();

  if (res.ok) {
    toast.success("Bid placed successfully");
    onClose();
  } else {
    toast.alert(data.message || "Failed to place bid");
  }
};

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-[95%] max-w-xl p-6 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">GSEC</span>
            <h3 className="text-lg font-semibold">{gsec.name}</h3>
          </div>
          <span className="text-sm text-gray-500">GOI dated bond</span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
          <div>
            <p className="text-gray-500">Indicative yield</p>
            <p>{gsec.yield}%</p>
          </div>
          <div>
            <p className="text-gray-500">Price</p>
            <p>{pricePerUnit}</p>
          </div>
          <div>
            <p className="text-gray-500">Maturity</p>
            <p>{gsec.maturityDate}</p>
          </div>
          <div>
            <p className="text-gray-500">Last bid</p>
            <p>{gsec.endsOn}, 20:00</p>
          </div>
          <div>
            <p className="text-gray-500">Settlement</p>
            <p>Mon, 11 Aug 2025</p>
          </div>
          <div>
            <p className="text-gray-500">Amount (₹)</p>
            <input
              type="number"
              className="w-full border rounded px-2 py-1 mt-1"
              value={totalAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              min={minAmount}
              step={pricePerUnit * 100}
            />
            <p className="text-xs text-gray-400 mt-1">Min. amount ₹{minAmount}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="flex justify-between text-sm border-t pt-3 text-gray-800">
          <p>Total qty. <span className="font-semibold">{quantity}</span></p>
          <p>Total amount <span className="font-semibold">₹{totalAmount}</span></p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Place bid
          </button>
          <button
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GsecApplyModal;
