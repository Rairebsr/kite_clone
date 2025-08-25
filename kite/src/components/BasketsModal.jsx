import React, { useState, useEffect } from 'react';
import stockData from '../assets/mock_stock_data_50.json';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { toast } from 'react-toastify';

const BasketsPopup = ({ searchTerm, basketName }) => {
  const [selectedStock, setSelectedStock] = useState(null);
    const [basketOrders, setBasketOrders] = useState([]);

    const token = localStorage.getItem('token');
const decoded = token ? jwtDecode(token) : null;
const userId = decoded?.id;
useEffect(() => {
  if (!basketName || !userId) return;

  axios
    .get(`${import.meta.env.VITE_API_URL}/api/order/basketorders`, {
      params: { userId, basketName },
    })
    .then((res) => setBasketOrders(res.data))
    .catch((err) => console.error("Failed to fetch basket orders:", err));
}, [basketName, userId]);

  const filteredStocks = stockData.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <ul>
        {filteredStocks.map((stock, index) => (
          <li
            key={index}
            className="flex justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => setSelectedStock(stock)} // ✅ open modal
          >
            <span>{stock.symbol}</span>
            <span className="text-gray-500">{stock.name}</span>
            <span className="bg-red-100 text-red-600 text-xs px-2 rounded">
              NSE
            </span>
          </li>
        ))}
      </ul>

      {/* ✅ Show BuyOrderModal inside same file */}
      {selectedStock && (
        <BuyOrderModal
          stock={selectedStock}
          closeModal={() => setSelectedStock(null)}
          basketName={basketName}
        />
      )}
    </div>
  );
};

// ---------------------------
// BuyOrderModal merged here
// ---------------------------
const BuyOrderModal = ({ closeModal, stock, basketName }) => {
  const [activeTab, setActiveTab] = useState('Regular');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(stock?.price || 100);
  const stopLossTrigger = (stock?.price * 0.97).toFixed(2);
  const disclosedQty = Math.floor(qty / 2);
  const estimatedCost = (qty * price).toFixed(2);
  const [segment, setSegment] = useState('EQUITY');

  const textColor = 'text-blue-600';
  const bgColor = 'bg-blue-600';
  const hoverBgColor = 'hover:bg-blue-700';

  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.id;

  useEffect(() => {
    console.log(stock);
  }, [stock]);

  const handleBuyOrder = async () => {
  const orderData = {
    userId,
    stockSymbol: stock.symbol,
    stockName: stock.name,
    price,
    quantity: qty,
    stopLoss: activeTab === 'Cover' ? stopLossTrigger : null,
    orderType:
      document.querySelector('input[name="orderType"]:checked')?.nextSibling
        ?.textContent?.trim() || 'Market',
    productType:
      document.querySelector('input[name="type"]:checked')?.nextSibling
        ?.textContent?.trim() || 'Intraday',
    tabType: activeTab,
    validity:
      document.querySelector('input[name="validity"]:checked')?.nextSibling
        ?.textContent?.trim() || 'Day',
    disclosedQty,
    val: 'Buy',
    timestamp: new Date().toISOString(),
    segment,
    exchange: segment === 'EQUITY' ? 'NSE' : 'MCX',
    basketName: basketName, // ✅ add basket name here
};

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/order/addorder`,
        orderData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      toast.success(res.data.message || 'Order placed');
      closeModal();
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Order failed';
      toast.error(errorMsg);
      console.error('Order failed', err);
    }
  };

  const tabs = ['Quick', 'Regular', 'Iceberg', 'Cover'];

  const renderTabs = () => (
    <div className="flex gap-4 border-b mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-2 font-medium text-sm ${
            activeTab === tab
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  const renderCommonFields = () => (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <label className="text-sm font-medium">Qty.</label>
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Trigger Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      {activeTab === 'Cover' && (
        <div>
          <label className="text-sm font-medium">Stoploss trigger</label>
          <input
            type="number"
            defaultValue={stopLossTrigger}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
      )}
      {activeTab === 'Iceberg' && (
        <div>
          <label className="text-sm font-medium">Number of legs</label>
          <input
            type="number"
            defaultValue={2}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
      )}
    </div>
  );

  const renderAdvancedFields = () => (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div>
        <label className="text-sm font-medium">Validity</label>
        <div className="flex gap-2 mt-1">
          <label>
            <input type="radio" name="validity" defaultChecked /> Day
          </label>
          <label>
            <input type="radio" name="validity" /> Immediate
          </label>
          <label>
            <input type="radio" name="validity" /> Minutes
          </label>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Disclosed qty.</label>
        <input
          type="number"
          defaultValue={disclosedQty}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="max-w-lg w-full bg-white rounded shadow-md p-4">
        <div className={`${bgColor} text-white p-2 flex justify-between items-center`}>
          <span>{stock.name}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`font-bold ${textColor} text-md`}>{stock.symbol}</h2>
            <div className="text-sm text-gray-600">
              BSE ₹{stock?.open} | NSE ₹{stock?.price}
            </div>
          </div>
        </div>

        {renderTabs()}

        {/* Segment */}
        <div className="flex gap-4 mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="segment"
              value="EQUITY"
              checked={segment === 'EQUITY'}
              onChange={() => setSegment('EQUITY')}
              className="hidden peer"
            />
            <span className="px-3 py-1 rounded border border-gray-300 peer-checked:bg-green-600 peer-checked:text-white">
              Equity
            </span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="segment"
              value="COMMODITY"
              checked={segment === 'COMMODITY'}
              onChange={() => setSegment('COMMODITY')}
              className="hidden peer"
            />
            <span className="px-3 py-1 rounded border border-gray-300 peer-checked:bg-yellow-500 peer-checked:text-white">
              Commodity
            </span>
          </label>
        </div>

        {/* Product Type */}
        <div className="flex gap-4 mb-4">
          <label className="flex items-center cursor-pointer">
            <input type="radio" name="type" defaultChecked className="hidden peer" />
            <span className="px-3 py-1 rounded border border-gray-300 peer-checked:bg-blue-600 peer-checked:text-white">
              Intraday
            </span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input type="radio" name="type" className="hidden peer" />
            <span className="px-3 py-1 rounded border border-gray-300 peer-checked:bg-blue-600 peer-checked:text-white">
              Longterm
            </span>
          </label>
        </div>

        {/* Order Type */}
        <div className="flex gap-4 mb-4">
          <label>
            <input type="radio" name="orderType" defaultChecked /> Market
          </label>
          <label>
            <input type="radio" name="orderType" /> Limit
          </label>
          <label>
            <input type="radio" name="orderType" /> SL
          </label>
          <label>
            <input type="radio" name="orderType" /> SL-M
          </label>
        </div>

        {renderCommonFields()}

        <button
          className={`${textColor} text-sm font-medium flex items-center gap-1`}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          Advanced {showAdvanced ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {showAdvanced && renderAdvancedFields()}

        <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
          <div>
            Required: <span className={`${textColor} font-medium`}>₹{estimatedCost}</span> +0.63
          </div>
          <div>Available: N/A</div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            className={`flex-1 ${bgColor} text-white py-2 rounded ${hoverBgColor}`}
            onClick={handleBuyOrder}
          >
            Buy
          </button>

          <button
            onClick={closeModal}
            className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasketsPopup;
