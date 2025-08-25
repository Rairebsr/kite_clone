import React, { useEffect, useState, useContext } from 'react';
import { userContext } from '../context/userContext';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import StockModal from '../components/StockModel';
import OrderModal from '../components/OrderModel';
import GTTModal from '../components/GTTModal';
import { assets } from '../assets/assets';

const Holdings = () => {
  const { showBuyModal, setShowBuyModal } = useContext(userContext);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showGTTModal, setShowGTTModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [mode, setMode] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [equityFilter, setEquityFilter] = useState('All Equity');
  const [holdings, setHoldings] = useState([]);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/getorder/${userId}`);
      setHoldings(res.data);
    } catch (error) {
      console.error("Error fetching holdings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockModal = () => setShowStockModal(true);

  const handleBuySell = (stock, action) => {
    const normalizedStock = {
      name: stock.stockName,
      symbol: stock.stockSymbol,
      price: stock.currentPrice || 0,
      open: stock.open || stock.price || 0,
      ...stock
    };
    setSelectedStock(normalizedStock);
    setMode(action);
    setShowBuyModal(true);
  };

  const handleGTT = (stock) => {
    setSelectedStock(stock);
    setShowGTTModal(true);
  };

  const filteredHoldings = holdings.filter(
    (h) => activeTab === 'All' || (activeTab === 'Equity' && h.productType === 'Longterm')
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Holdings</h1>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          {['All', 'Equity', 'Mutual Funds'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === tab 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Equity Filter */}
      {activeTab === 'Equity' && (
        <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={equityFilter}
              onChange={(e) => setEquityFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {['All Equity', 'MTF', 'Kite', 'Smallcase'].map(filter => (
                <option key={filter} value={filter}>{filter}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {activeTab !== 'Mutual Funds' && filteredHoldings.length === 0 && (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm">
              <img 
                src={assets.holdings} 
                className="w-20 h-20 mx-auto mb-4 opacity-80" 
                alt="No holdings" 
              />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No holdings found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Your investments will appear here once you start building your portfolio.
              </p>
              <button
                onClick={handleStockModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors"
              >
                Make Your First Investment
              </button>
            </div>
          )}

          {/* Holdings Table */}
          {activeTab !== 'Mutual Funds' && filteredHoldings.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Instrument
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg. Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invested Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Value
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        P&L
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
  {filteredHoldings.map((h) => {
    const avgPrice = (h.price / h.quantity).toFixed(2);

    // Simulate current price with a fluctuation of +/-5%
    const fluctuation = (Math.random() * 10 - 5) / 100; // between -5% to +5%
    const currentPrice = (avgPrice * (1 + fluctuation)).toFixed(2);

    const investedAmount = h.price.toFixed(2);
    const currentValue = (currentPrice * h.quantity).toFixed(2);
    const pnl = (currentValue - investedAmount).toFixed(2);
    const pnlPercentage = ((pnl / investedAmount) * 100).toFixed(2);

    return (
      <tr key={h._id} className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {h.stockSymbol.substring(0, 2)}
              </span>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {h.stockName}
              </div>
              <div className="text-sm text-gray-500">
                {h.stockSymbol}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-right text-gray-500">
          {h.quantity}
        </td>
        <td className="px-6 py-4 text-sm text-right text-gray-500">
          ₹{avgPrice}
        </td>
        <td className="px-6 py-4 text-sm text-right text-gray-500">
          ₹{investedAmount}
        </td>
        <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
          ₹{currentValue}
        </td>
        <td className="px-6 py-4 text-sm text-right">
          <span className={`font-medium ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{Math.abs(pnl)} ({pnlPercentage}%)
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-right space-x-2">
          <button
            onClick={() => handleBuySell(h, 'B')}
            className="px-3 py-1 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded text-sm"
          >
            Buy
          </button>
          <button
            onClick={() => handleBuySell(h, 'S')}
            className="px-3 py-1 border border-orange-500 text-orange-500 hover:bg-orange-50 rounded text-sm"
          >
            Sell
          </button>
          <button
            onClick={() => handleGTT({ ...h, currentPrice })}
            className="px-3 py-1 border border-gray-500 text-gray-700 hover:bg-gray-50 rounded text-sm"
          >
            GTT
          </button>
        </td>
      </tr>
    );
  })}
</tbody>

                </table>
              </div>
            </div>
          )}

          {/* Mutual Funds CTA */}
          {activeTab === 'Mutual Funds' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-8 text-center">
                <div className="mx-auto flex justify-center mb-4">
                  <img src={assets.coin} alt="Coin Logo" className="h-16 w-16" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Invest in commission-free direct mutual funds
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Trusted by millions of investors. Get started with Coin today.
                </p>
                <button
                  onClick={() => window.open('https://coin.zerodha.com', '_blank')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Open Coin Account
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {showStockModal && <StockModal onClose={() => setShowStockModal(false)} />}
      {/* Modals */}
      {showBuyModal && selectedStock && (
        <OrderModal
          stock={selectedStock}
          st={mode}
          userHoldings={holdings}
          closeModal={() => {
            setShowBuyModal(false);
          }}
        />
      )}
      {showGTTModal && selectedStock && (
        <GTTModal
          stock={selectedStock}
          closeModal={() => setShowGTTModal(false)}
        />
      )}
    </div>
  );
};

export default Holdings;