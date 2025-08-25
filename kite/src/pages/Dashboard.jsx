import React, { useState, useEffect, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import mockStockData from '../assets/mock_stock_data_50.json';
import { userContext } from '../context/userContext';
import { assets } from '../assets/assets';
import { jwtDecode } from 'jwt-decode';

import Orders from '../../../backend/model/Orders';
import StockModal from '../components/StockModel';



const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [marketIndex, setMarketIndex] = useState([]);
  const [equityValue, setEquityValue] = useState(0);
  const [marginAvailable, setMarginAvailable] = useState(0);
  const [userId,setUserId] = useState('')
  const [showModal, setShowModal] = useState(false);
  const [commodityValue, setCommodityValue] = useState(0);


  const {showBuyModal,showDepth,showChartModal} = useContext(userContext)

  


  useEffect(() => {
  setMarketIndex(mockStockData[0].history);
}, []);


  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded);
    setUserId(decoded.id); // or decoded.userId depending on your JWT payload
  }
}, []); // Runs only once on mount

useEffect(() => {
  if (!userId) return; // Wait until userId is available

  const fetchOrders = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/order/getorder/${userId}`);
    const orders = await res.json();
    console.log("Fetched Orders:", orders);

    const equity = orders.reduce((acc, order) => {
      if (
        order.segment === 'EQUITY' &&
        order.tabType === 'Regular' &&
        order.productType === 'Intraday'
      ) {
        return acc + order.price * order.quantity;
      }
      return acc;
    }, 0);

    const commodity = orders.reduce((acc, order) => {
      if (
        order.segment === 'COMMODITY' &&
        order.tabType === 'Regular' &&
        order.productType === 'Intraday'
      ) {
        return acc + order.price * order.quantity;
      }
      return acc;
    }, 0);

    setEquityValue(equity);
    setCommodityValue(commodity);
    setMarginAvailable(100000 - (equity + commodity)); // Optional combined margin
    setStocks(orders);
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
  }
};


  fetchOrders();
}, [userId]); 

  return (
    <div className="p-6  w-full h-[calc(100vh-56px)] overflow-y-auto">
      <div className="bg-gray-50 w-full p-4 ">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-700">Hi</h1>
        </div>

        <div className="px-6 py-4 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-gray-500 text-sm">Equity</h2>
            <p className="text-xl font-semibold text-blue-600">₹{equityValue.toFixed(2)}</p>
            <p className="text-xs text-gray-400">Margin used: ₹0</p>
            <p className="text-xs text-gray-400">Opening balance: ₹0</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-gray-500 text-sm">Commodity</h2>
            <p className="text-xl font-semibold text-yellow-600">₹{commodityValue.toFixed(2)}</p>
            <p className="text-xs text-gray-400">Margin used: ₹0</p>
            <p className="text-xs text-gray-400">Opening balance: ₹0</p>
          </div>
        </div>

        {equityValue === 0 && (
          <div className="bg-white p-4 pt-20 pb-20 rounded shadow mb-6 text-center">
            <img className='mx-auto w-20' src={assets.holdings} alt="" />
            <h3 className="text-md font-semibold text-gray-600">You don't have any stocks in your DEMAT yet.</h3>
            <p className="text-sm text-gray-500 mt-1">Get started with absolutely free equity investments.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
            >
              Start Investing
            </button>

          </div>
        )}

      <div className="px-6">
      <div className={`flex gap-4 items-start ${showBuyModal ? 'pointer-events-none' : ''}`}>
      
      <div className={`w-2/3  p-4 z-0 relative transition-all duration-300 ${
        showBuyModal || showDepth || showChartModal  ? 'filter blur-sm opacity-30 pointer-events-none' : ''
      }`}>
        <h3 className="text-md font-semibold mb-2 text-gray-600">Market Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={marketIndex}>
            <XAxis dataKey="time" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="close" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      
      <div className="w-1/3 bg-white p-6 pt-20 pb-20 rounded shadow text-center">
        <img src={assets.anchoricon} alt="Anchor" className="mx-auto w-12 mb-3 opacity-50" />
        <h3 className="text-md font-semibold text-gray-600">You don't have any positions yet</h3>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition"
        >
          Get started
        </button>

      </div>
    </div>
    {showModal && <StockModal onClose={() => setShowModal(false)} />}
  </div>

      </div>
    </div>
  );
};

export default Dashboard;