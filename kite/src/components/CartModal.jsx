import React, { useState, useEffect } from 'react';
import { FaSearch, FaShoppingBasket,FaEllipsisV } from 'react-icons/fa';
import stockData from '../assets/mock_stock_data_50.json';
import { jwtDecode } from 'jwt-decode';
import OrderModal from './OrderModel';
import { toast } from 'react-toastify';

const CartModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
const [showOrderModal, setShowOrderModal] = useState(false);
const [selectedChartStock, setSelectedChartStock] = useState(null);
const [orderState, setOrderState] = useState('B'); // or 'Sell'


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

  


  const calculateReqMargin = (price, qty) => {
    return price * qty * 0.15;
  };

  const handleAddToCart = async (stock) => {
    const item = {
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      quantity: 1,
      orderType: 'Limit',
      productType: 'Intraday',
      tabType: 'Regular',
      validity: 'Day',
      disclosedQty: 0,
      stopLoss: null,
      segment: 'EQUITY',
      exchange: 'NSE',
      ltp: stock.price,
      reqMargin: calculateReqMargin(stock.price, 1),
    };

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/order/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, item }),
      });
      setCartItems((prev) => [...prev, item]);
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateCartItem = async (itemId, updates) => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/api/order/updatecart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, itemId, updates }),
    });

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, ...updates } : item
      )
    );
  } catch (err) {
    console.error(err.message);
  }
};

  const handleRemove = async (itemId) => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/api/order/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, itemId }),
    });

    setCartItems((prev) => prev.filter((item) => item._id !== itemId));
  } catch (err) {
    console.error(err.message);
  }
};


  const fetchCart = async () => {
  if (!userId) return;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/order/getcart/${userId}`);
    const data = await res.json();
    setCartItems(data.items || []);
  } catch (err) {
    console.error('Fetch cart failed:', err.message);
  }
};

useEffect(() => {
  fetchCart();
  console.log(cartItems);
  
}, [userId, isOpen]);


  const filteredItems = stockData.filter((stock) =>
    stock.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-28 z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b font-semibold text-lg">
          <div className="flex items-center gap-2">
            <FaShoppingBasket className="text-gray-600" />
            Basket
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Search + Clear */}
        <div className="flex items-center p-4 border-b gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search & add"
              className="w-full pl-10 pr-4 py-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            onClick={async () => {
              try {
                await fetch(`${import.meta.env.VITE_API_URL}/api/order/clearcart`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId }),
                });
                setCartItems([]); // Clear frontend state
              } catch (err) {
                console.error('Failed to clear cart:', err);
              }
            }}
          >
            Clear Basket
          </button>

        </div>

        {/* Search results */}
        {searchTerm && (
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-2">Search Results</h3>
            {filteredItems.length === 0 ? (
              <p className="text-gray-500">No matching stocks</p>
            ) : (
              <ul className="space-y-1">
                {filteredItems.map((item) => (
                  <li key={item.symbol} className="flex justify-between">
                    <span>{item.name}</span>
                    <button
                      className="px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add
                    </button>

                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Cart Table */}
        <div className="p-4 max-h-80 overflow-y-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100 text-gray-600 border-b">
              <tr>
                <th className="p-2">Type</th>
                <th className="p-2">Instrument</th>
                <th className="p-2">LTP</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Price</th>
                <th className="p-2">Req. margin</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">B</td>
                  <td className="p-2">{item.name} ({item.symbol})</td>
                  <td className="p-2">{item.ltp}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="w-16 border rounded px-1"
                      value={item.quantity}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value);
                        updateCartItem(item._id, {
                          quantity: qty,
                          reqMargin: calculateReqMargin(item.price, qty),
                        });
                      }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      className="w-20 border rounded px-1"
                      value={item.price}
                      onChange={(e) => {
                        const price = parseFloat(e.target.value);
                        updateCartItem(item._id, {
                          price,
                          reqMargin: calculateReqMargin(price, item.quantity),
                        });
                      }}
                    />
                  </td>
                  <td className="p-2 text-right">₹{item.reqMargin?.toFixed(2)}</td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                  <td>
  <div className="relative inline-block text-left">
    <button
      onClick={() =>
        setActiveDropdown((prev) => (prev === item.symbol ? null : item.symbol))
      }
    >
      <FaEllipsisV className="text-gray-600 hover:text-black" />
    </button>

    {/* Dropdown menu */}
    {activeDropdown === item.symbol && (
      <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-50">
        <button
          className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
          onClick={() => {
            setSelectedChartStock(item);
            setOrderState('B');
            setShowOrderModal(true);
            setActiveDropdown(null);
          }}
        >
          Buy
        </button>
        <button
          className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
          onClick={() => {
            setSelectedChartStock(item);
            setOrderState('S');
            setShowOrderModal(true);
            setActiveDropdown(null);
          }}
        >
          Sell
        </button>
      </div>
    )}
  </div>
</td>

                </tr>
              ))}
              {cartItems.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-4">
                    Cart is empty
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-4 gap-2 border-t">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={async () => {
              try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/placeall`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId }), // Make sure userId is available
                });

                const result = await response.json();

                if (response.ok) {
                  setCartItems([]); // Clear cart state in UI
                  toast.success(result.message)
                } else {
                  toast.error(result.message)
                }
              } catch (err) {
                console.error('Failed to place all orders:', err);
              }
            }}
          >
            Place All
          </button>

          <button
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
      {showOrderModal && selectedChartStock && (
  <OrderModal
    closeModal={() => {
      setShowOrderModal(false);
      fetchCart();
    }}
    stock={selectedChartStock}
    st={orderState}
    userHoldings={cartItems}
  />
)}

    </div>
    
  );
  
};

export default CartModal;