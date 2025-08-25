import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';
import StockModal from '../components/StockModel';

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [userId, setUserId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserId(decoded.id);
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) fetchPositions();
  }, [userId]);

  const fetchPositions = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/getposition/${userId}`);
      const enriched = res.data.map((pos) => {
        const price = pos.price;
        const fluctuation = price * (Math.random() * 0.1 - 0.05);
        const ltp = +(price + fluctuation).toFixed(2);
        const pnl = +((ltp - price) * pos.quantity).toFixed(2);
        return { ...pos, ltp, pnl };
      });
      setPositions(enriched);
    } catch (err) {
      console.error('Failed to fetch positions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Positions</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          New Trade
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : positions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
          <img
            src={assets.anchoricon}
            alt="No Positions"
            className="w-24 h-24 mx-auto mb-4 opacity-75"
          />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No active positions
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-4">
            Your active positions will appear here once you start trading.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors"
          >
            Place Your First Trade
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    LTP
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P&L
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {positions.map(pos => (
                  <tr key={pos._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pos.stockName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pos.stockSymbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {pos.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ₹{pos.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium text-right">
                      ₹{pos.ltp.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${pos.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {pos.pnl >= 0 ? '+' : ''}₹{Math.abs(pos.pnl).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${pos.orderType === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {pos.orderType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pos.productType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(pos.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showModal && <StockModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Positions;