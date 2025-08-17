import React, { useState,useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify'; 



const GTTModal = ({ stock, closeModal }) => {
  const [transactionType, setTransactionType] = useState('Buy');
  const [triggerType, setTriggerType] = useState('Single');
  const [triggerPrice, setTriggerPrice] = useState(stock.price || '');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(stock.price || '');
  const [userId, setUserId] = useState('');
  const [holdings, setHoldings] = useState([]);

  useEffect(()=>{
    console.log(stock);
    
  })

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);
  useEffect(() => {
    if (userId) fetchHoldings();
  }, [userId]);

  const fetchHoldings = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/order/getorder/${userId}`);
      setHoldings(res.data);
     
      
    } catch (error) {
      console.error("Error fetching holdings:", error);
    }
  };
  

  

const handlePlaceOrder = async () => {
  if (!userId) {
    toast.error('User not logged in');
    return;
  }

  // Validate positive inputs
  if (quantity <= 0 || price <= 0 || triggerPrice <= 0) {
    toast.error("Quantity, Trigger Price, and Price must be positive numbers.");
    return;
  }

  if (transactionType === 'Sell') {
    // Find the stock in user's holdings
    const matchedStock = holdings.find(
      (h) =>
        h.stockSymbol === stock.stockSymbol || h.stockName === stock.stockName
    );

    const ownedQty = matchedStock?.quantity || 0;

    if (quantity > ownedQty) {
      toast.error(`Insufficient quantity. You own only ${ownedQty} shares.`);
      return;
    }
  }

  const gttOrder = {
    userId,
    stockSymbol: stock.stockSymbol || stock.symbol,
    stockName: stock.stockName || stock.name,
    triggerPrice: parseFloat(triggerPrice),
    quantity: parseInt(quantity),
    price: parseFloat(price),
    transactionType,
    triggerType,
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await axios.post('http://localhost:4000/api/gtt/add', gttOrder);
    toast.success("GTT order placed successfully");
    closeModal();
  } catch (error) {
    console.error('Failed to place GTT order:', error);
    toast.error('Failed to place GTT order. Try again later.');
  }
};


  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-[600px] rounded-lg shadow-lg p-6 relative">
        <button className="absolute top-3 right-4 text-gray-500" onClick={closeModal}>
          <FaTimes size={20} />
        </button>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">{stock.name} <span className="text-sm text-black-400 ml-1">{stock.symbol}</span></h2>
          <p className="text-sm text-gray-500">LTP: ₹{stock.price}</p>
        </div>

        {/* Transaction Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Transaction type</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input type="radio" name="txn" value="Buy" checked={transactionType === 'Buy'} onChange={() => setTransactionType('Buy')} />
              <span className="ml-2">Buy</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="txn" value="Sell" checked={transactionType === 'Sell'} onChange={() => setTransactionType('Sell')} />
              <span className="ml-2">Sell</span>
            </label>
          </div>
        </div>

        {/* Trigger Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Trigger type</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input type="radio" name="trigger" value="Single" checked={triggerType === 'Single'} onChange={() => setTriggerType('Single')} />
              <span className="ml-2">Single</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="trigger" value="OCO" disabled className="opacity-50 cursor-not-allowed" />
              <span className="ml-2 text-gray-400">OCO (Coming Soon)</span>
            </label>
          </div>
          <p className="text-xs text-gray-400 mt-1">The order is placed when the LTP crosses the trigger price.</p>
        </div>

        {/* Trigger Price, Qty, Price */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Trigger Price</label>
            <input
              type="number"
              className="w-full border px-2 py-1 rounded"
              value={triggerPrice}
              onChange={(e) => setTriggerPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Qty</label>
            <input
              type="number"
              className="w-full border px-2 py-1 rounded"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              className="w-full border px-2 py-1 rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 mb-4">
          By placing, I agree to the <a href="#" className="text-blue-600 underline">terms</a> and accept that trigger executions are not guaranteed. Trigger expires on <b>{new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10)}</b>
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button onClick={closeModal} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handlePlaceOrder} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Place</button>
        </div>
      </div>
    </div>
  );
};

export default GTTModal;