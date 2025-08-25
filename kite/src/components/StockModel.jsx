import React, { useState,useContext, useEffect } from 'react';
import { mockMarketDepth } from '../assets/depth';
import { FaTimes } from 'react-icons/fa';
import stockData from '../assets/mock_stock_data_50.json';
import MarketDepthTable from './MarketDepthTable';
import { assets } from '../assets/assets';
import { userContext } from '../context/userContext';
import OrderModal from './OrderModel';
import GTTModal from './GTTModal';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const StockModal = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [BuyModal, setBuyModal] = useState(false)
  const [showGTTModal,setShowGTTModal] = useState(false)
  const [state,setState] = useState('')
  const [holdings, setHoldings] = useState([]);
  const [userId, setUserId] = useState('');
  

  
  const filteredStocks = stockData.filter(stock =>
  stock.name.toLowerCase().startsWith(searchTerm.toLowerCase())
);


  const handleOrderClick = (action) => {
  setState(action);
  setBuyModal(true); 
};

useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

useEffect(()=>{
    console.log(selectedStock);
    
},[selectedStock])

useEffect(() => {
    if (userId) fetchHoldings();
  }, [userId]);

  const fetchHoldings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/getorder/${userId}`);
      setHoldings(res.data);
    } catch (error) {
      console.error("Error fetching holdings:", error);
    }
  };



  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-[600px] rounded shadow-lg p-6 relative">
        <button className="absolute top-2 right-3 text-gray-500" onClick={onClose}>
          <FaTimes />
        </button>

        {/* Search Input – Always visible */}
        <input
          id="stockSearch"
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="Search eg: infy, nifty fut..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value === '') setSelectedStock(null); // Reset selection on clearing
          }}
        />

        {/* Centered image/text when search is empty and no stock selected */}
        {!searchTerm && !selectedStock && (
          <div className='flex flex-col items-center justify-center text-center'>
            <img src={assets.bino} alt="" className="mb-2 w-12 h-12" />
            <h2 className="text-lg font-semibold mb-2">Find an instrument</h2>
            <p className='text-sm text-gray-400'>Use the above search bar to find an instrument</p>
          </div>
        )}

        {/* Show list of matching stocks while typing */}
        {searchTerm && !selectedStock && (
          <ul className="max-h-48 overflow-y-auto border rounded mb-4">
            {filteredStocks.map(stock => (
              <li
                key={stock.symbol}
                className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedStock(stock);
                }}
              >
                {stock.name} ({stock.symbol})
              </li>
            ))}
            {filteredStocks.length === 0 && (
              <li className="py-2 px-3 text-gray-500 italic">No results found</li>
            )}
          </ul>
        )}

        {/* Show market depth and buttons when stock is selected */}
        {selectedStock && (
          <>
            <h2 className="text-xl font-semibold mb-2">{selectedStock.name} ({selectedStock.symbol})</h2>
            <p className="text-sm text-gray-600 mb-3">₹{selectedStock.price}</p>

            <div className="mb-4 max-h-60 overflow-y-auto border rounded">
              <MarketDepthTable depth={mockMarketDepth} />
            </div>

            <button 
                    onClick={() => setShowGTTModal(true)}
                    className="border-2 border-blue-500 text-blue-600 px-4 py-6 rounded hover:bg-blue-200"
                    >
                    Create GTT
            </button>
            <div className="flex justify-end gap-3">
              <button onClick={() => handleOrderClick('B')} className="border-2 border-blue-500 text-blue-600  px-4 py-2 rounded hover:bg-blue-200">Buy</button>
              <button onClick={() => handleOrderClick('S')} className="border-2 border-orange-500 text-orange-600  px-4 py-2 rounded hover:bg-red-200">Sell</button>
              <button className="border-2 border-gray-500 text-gray-600  px-4 py-2 rounded" onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
      {BuyModal && selectedStock && (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm'>
    <OrderModal closeModal={() => {setBuyModal(false); fetchHoldings();}} stock={selectedStock} st={state} userHoldings={holdings} />
  </div>
)}

{showGTTModal && selectedStock &&(
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm'>
    <GTTModal closeModal={()=> setShowGTTModal(false)} stock={selectedStock}/>
  </div>
)}

    </div>
  );
};

export default StockModal;