// src/components/SIP/NewSIPModal.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_URL;

const NewSIPModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [selectedBaskets, setSelectedBaskets] = useState([]);
  const [schedules, setSchedules] = useState([{ date: "1st", time: "09:30" }]);
  const [baskets, setBaskets] = useState([]);
  const [userId, setUserId] = useState(null);

  // --- Create Basket modal (same UX/logic as BasketsTab) ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [basketName, setBasketName] = useState("");
  const createModalRef = useRef(null);

  // get userId
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

  // fetch baskets (same as BasketsTab: GET /api/baskets/:userId)
  const fetchBaskets = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_BASE}/api/baskets/${userId}`);
      setBaskets(res.data || []);
    } catch (err) {
      toast.error("Error fetching baskets", err);
    }
  };

  useEffect(() => { fetchBaskets(); }, [userId]);

  // enforce max 3 baskets
  const handleBasketChange = (basketId) => {
    setSelectedBaskets((prev) => {
      const exists = prev.includes(basketId);
      if (exists) return prev.filter((b) => b !== basketId);
      if (prev.length >= 3) {
        toast.log("You can select up to 3 baskets.");
        return prev;
      }
      return [...prev, basketId];
    });
  };

  // Create basket (exactly like BasketsTab: POST /api/baskets/create)
  const handleCreateBasket = async () => {
    if (!basketName.trim()) {
      toast.error("Please enter a basket name");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/baskets/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: basketName }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create basket");
      }

      const newBasket = await res.json();
      setBaskets((prev) => [...prev, newBasket]);
      setBasketName("");
      setIsCreateModalOpen(false);

      // (optional) preselect the newly created basket
      setSelectedBaskets((prev) =>
        prev.length >= 3 ? prev : [...prev, newBasket._id]
      );
    } catch (err) {
      toast.error("Error creating basket:", err);
      alert(err.message || "Error creating basket");
    }
  };

  // Schedule handlers
  const handleScheduleChange = (index, field, value) => {
    const updated = [...schedules];
    updated[index][field] = value;
    setSchedules(updated);
  };

  const addSchedule = () => {
    if (schedules.length < 5) {
      setSchedules([...schedules, { date: "1st", time: "09:30" }]);
    }
  };

  const removeSchedule = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  // Submit SIP -> POST /api/sips
  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Please enter a SIP name");
    if (selectedBaskets.length === 0) return toast.error("Select at least one basket");

    try {
      const payload = {
        userId,
        name,
        baskets: selectedBaskets,
        schedules, // backend normalizes "8th" -> 8
      };
      const res = await axios.post(`${API_BASE}/api/sips`, payload);
      const created = res.data;
      if (onCreate) onCreate(created);
      onClose();
    } catch (err) {
      toast.error("Create SIP failed", err);
      alert(err?.response?.data?.message || "Failed to create SIP");
    }
  };

  // Close the create-basket modal when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (
        isCreateModalOpen &&
        createModalRef.current &&
        !createModalRef.current.contains(e.target)
      ) {
        setIsCreateModalOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isCreateModalOpen]);

  const reachedLimit = selectedBaskets.length >= 3;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-xl shadow-lg w-[500px] p-6 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">New SIP</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* SIP Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Enter SIP name"
          />
        </div>

        {/* Baskets */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Baskets <span className="text-xs text-gray-400">(max 3)</span>
            </label>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-blue-500 text-sm hover:underline"
            >
              + New basket
            </button>
          </div>

          {baskets.length === 0 ? (
            <p className="text-gray-500 text-sm">You haven’t created any baskets yet.</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
              {baskets.map((basket) => {
                const checked = selectedBaskets.includes(basket._id);
                const disabled = !checked && reachedLimit;
                return (
                  <label
                    key={basket._id}
                    className={`flex items-center space-x-2 cursor-pointer ${disabled ? "opacity-50" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => handleBasketChange(basket._id)}
                    />
                    <span>{basket.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Monthly Schedule */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Monthly schedule ({schedules.length} / 5)
            </label>
            {schedules.length < 5 && (
              <button onClick={addSchedule} className="text-blue-500 text-sm hover:underline">
                + Add
              </button>
            )}
          </div>

          {schedules.map((schedule, index) => (
            <div key={index} className="flex space-x-4 items-center mb-2">
              <select
                value={schedule.date}
                onChange={(e) => handleScheduleChange(index, "date", e.target.value)}
                className="border rounded-md px-3 py-2 w-1/2"
              >
              <option>1st</option>
              <option>2nd</option>
              <option>3rd</option>
              <option>4th</option>
              <option>5th</option>
              <option>6th</option>
              <option>7th</option>
              <option>8th</option>
              <option>9th</option>
              <option>10th</option>
              <option>11th</option>
              <option>12th</option>
              <option>13th</option>
              <option>14th</option>
              <option>15th</option>
              <option>16th</option>
              <option>17th</option>
              <option>18th</option>
              <option>19th</option>
              <option>20th</option>
              <option>21st</option>
              <option>22nd</option>
              <option>23rd</option>
              <option>24th</option>
              <option>25th</option>
              <option>26th</option>
              <option>27th</option>
              <option>28th</option>
              <option>29th</option>
              <option>30th</option>
              <option>31st</option>
              </select>

              <select
                value={schedule.time}
                onChange={(e) => handleScheduleChange(index, "time", e.target.value)}
                className="border rounded-md px-3 py-2 w-1/2"
              >
              <option>09:30</option>
              <option>10:00</option>
              <option>10:30</option>
              <option>11:00</option>
              <option>11:30</option>
              <option>12:00</option>
              <option>12:30</option>
              <option>13:00</option>
              <option>13:30</option>
              </select>

              {schedules.length > 1 && (
                <button
                  onClick={() => removeSchedule(index)}
                  className="text-red-500 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <p className="text-xs text-gray-500 mt-1">
            SIPs on weekends/holidays will be placed on next trading day. <br />
            Setup a <span className="text-blue-500 cursor-pointer">bank mandate</span> to add necessary funds.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">
            Create
          </button>
        </div>
      </div>

      {/* --- Create Basket Modal (identical UX to BasketsTab) --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
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
              onClick={handleCreateBasket}
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewSIPModal;
