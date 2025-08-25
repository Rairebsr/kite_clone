import React, { useState, useRef, useEffect } from "react";
import basketIcon from "../../assets/basket.jpeg";
import marketwatch from "../../assets/marketwatch.svg";
import { jwtDecode } from "jwt-decode";
import BasketsPopup from '../../components/BasketsModal';
import axios from "axios";

const API_BASE_URL = "/api/baskets"; // ✅ match backend port

const BasketsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBasketDetailOpen, setIsBasketDetailOpen] = useState(false);
  const [basketName, setBasketName] = useState("");
  const [currentBasket, setCurrentBasket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const createModalRef = useRef(null);
  const detailModalRef = useRef(null);
  const [basketOrders, setBasketOrders] = useState([]);
  const [baskets, setBaskets] = useState([]);   // 👈 add this
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.id;
  
  useEffect(() => {
  const fetchBaskets = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);   // ✅ extract userId
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/baskets/${decoded.id}`);
      setBaskets(res.data);
    } catch (err) {
      console.error("Error fetching baskets:", err.response?.data || err.message);
    }
  };

  fetchBaskets();
}, []);

  useEffect(() => {
  if (userId) {
    fetch(`${import.meta.env.VITE_API_URL}/api/baskets/${userId}`)
      .then((res) => res.json())
      .then((data) => setBaskets(data))   // 👈 store in state
      .catch((err) => console.error("Error fetching baskets:", err));
  }
}, [userId]);

  const handleCreate = async () => {
  if (!basketName.trim()) {
    alert("Please enter a basket name");
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/baskets/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name: basketName }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create basket");
    }

    const newBasket = await res.json();

    // ✅ update UI with new basket
    setBaskets((prev) => [...prev, newBasket]);
    setCurrentBasket(newBasket.name);
    setBasketName("");
    setIsCreateModalOpen(false);
    setIsBasketDetailOpen(true);

  } catch (error) {
    console.error("Error creating basket:", error);
    alert(error.message || "Error creating basket");
  }
};


  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isCreateModalOpen &&
        createModalRef.current &&
        !createModalRef.current.contains(event.target)
      ) {
        setIsCreateModalOpen(false);
      }
      if (
        isBasketDetailOpen &&
        detailModalRef.current &&
        !detailModalRef.current.contains(event.target)
      ) {
        setIsBasketDetailOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCreateModalOpen, isBasketDetailOpen]);

  useEffect(() => {
  const fetchBasketOrders = async () => {
    if (!currentBasket) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/order/basketorders`,
        { params: { userId, basketName: currentBasket } } // ✅ filter by basketName
      );
      setBasketOrders(res.data);
    } catch (err) {
      console.error('Error fetching basket orders:', err);
    }
  };

  fetchBasketOrders();
}, [currentBasket, userId]);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      {/* Empty State */}
     {baskets.length === 0 ? (
  // ✅ Empty state
  <div className="flex flex-col items-center">
    <img src={basketIcon} alt="Basket" className="w-20 h-20 opacity-70 mb-4" />
    <p className="text-gray-500 mb-6">You haven't created any baskets.</p>
    <button
      className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600"
      onClick={() => setIsCreateModalOpen(true)}
    >
      New basket
    </button>
  </div>
) : (
  // ✅ Stacked vertically in a scrollable area
  <div className="w-full max-w-3xl h-full flex flex-col">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Your Baskets</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => setIsCreateModalOpen(true)}
      >
        + New basket
      </button>
    </div>

    {/* ✅ Scrollable list */}
   <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-3">
  {baskets.map((basket) => (
    <div
      key={basket._id}
      className="p-5 border rounded-xl shadow-md hover:shadow-lg transition bg-white relative"
      onClick={() => {
        setCurrentBasket(basket.name);
        setIsBasketDetailOpen(true);
      }}
    >
      {/* ✅ Top row with name + instruments */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">{basket.name}</h3>
        <span className="text-sm text-gray-500">
          {basketOrders.length || 0} instruments
        </span>
      </div>

      {/* ✅ Created date */}
      <div className="text-sm text-gray-400">
        Created on{" "}
        {new Date(basket.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </div>

      {/* ✅ Delete button (top-right corner) */}
      <button
        onClick={async (e) => {
          e.stopPropagation(); // Prevent card click
          try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/baskets/${basket._id}`);
            setBaskets((prev) => prev.filter((b) => b._id !== basket._id));
          } catch (err) {
            console.error("Delete failed:", err.response?.data || err.message);
          }
        }}
        className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-sm"
      >
        🗑 Delete
      </button>
    </div>
  ))}
</div>
  </div>
)}

      {/* Create Basket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div
            ref={createModalRef}
            className="bg-white rounded-lg shadow-lg p-6 w-96"
          >
            <h2 className="text-2xl font-semibold mb-4">Create basket</h2>
            <hr className="mb-4" />
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={basketName}
              onChange={(e) => setBasketName(e.target.value)}
              className="border rounded w-full px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
            />
            <button
              className="bg-blue-500 text-white px-5 py-2 w-full rounded hover:bg-blue-600"
              onClick={handleCreate}
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Basket Detail Modal */}
      {/* Basket Detail Modal */}
      {isBasketDetailOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div
            ref={detailModalRef}
            className="bg-white rounded-lg shadow-lg w-3/4 h-5/6 flex flex-col relative"
          >
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-medium">✏ {currentBasket}</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsBasketDetailOpen(false)}
              >
                ✖
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center border rounded m-6 relative">
              <span className="px-3 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search and add instruments"
                className="w-full px-2 py-2 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Popup should appear when user types */}
              {searchTerm.trim() !== '' && (
                <div className="absolute top-12 left-0 w-full bg-white shadow-lg border rounded z-50">
                  <BasketsPopup searchTerm={searchTerm} setBasketOrders={setBasketOrders} basketName={currentBasket}/>
                </div>
              )}
            </div>

            {/* Empty instruments message */}
            {basketOrders.length === 0 ? (
  <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
    <img src={marketwatch} alt="Empty" className="w-20 h-20 opacity-70 mb-4" />
    <p className="font-medium text-gray-700">Nothing here</p>
    <p className="text-sm">Use the search bar to add instruments.</p>
  </div>
) : (
  <div className="space-y-4 overflow-y-auto p-4">
    {basketOrders.map((order) => (
      <div key={order._id} className="border rounded-lg p-4 shadow-sm bg-white">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-blue-500 font-semibold mr-2">{order.stockName}</span>
            <span className="font-medium">{order.stockSymbol}</span>{" "}
            <span className="text-gray-500 text-sm">{order.exchange}</span>
          </div>
          <div className="text-sm text-gray-600">
            Qty: {order.quantity} | Price: ₹{order.price}
          </div>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span>Margin req: ₹{order.price * order.quantity}</span>
          <span className="text-green-600 font-medium">
            Final margin: ₹{order.price * order.quantity}
          </span>
        </div>
      </div>
    ))}
  </div>
)}

            {/* Footer */}
            <div className="border-t p-4 flex justify-end bg-gray-50">
              <button
                className="border border-gray-400 px-4 py-1 rounded hover:bg-gray-200"
                onClick={() => setIsBasketDetailOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasketsPage;
