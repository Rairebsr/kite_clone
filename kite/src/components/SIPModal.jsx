// src/components/SIP/NewSIPModal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const NewSIPModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [selectedBaskets, setSelectedBaskets] = useState([]);
  const [schedules, setSchedules] = useState([{ date: "1st", time: "09:30" }]);
  const [baskets, setBaskets] = useState([]);
  const [userId, setUserId] = useState(null);

  // ✅ for inline create-basket
  const [newBasketName, setNewBasketName] = useState("");
  const [showNewBasketInput, setShowNewBasketInput] = useState(false);

  // ✅ get userId from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

  // ✅ fetch baskets created by user
  const fetchBaskets = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:4000/api/baskets/user/${userId}`);
      setBaskets(res.data);
    } catch (err) {
      console.error("Error fetching baskets", err);
    }
  };

  useEffect(() => {
    fetchBaskets();
  }, [userId]);

  // ✅ toggle selection
  const handleBasketChange = (basketId) => {
    setSelectedBaskets((prev) =>
      prev.includes(basketId)
        ? prev.filter((b) => b !== basketId)
        : [...prev, basketId]
    );
  };

  // ✅ create new basket inline
  const handleCreateBasket = async () => {
    if (!newBasketName.trim()) return;
    try {
      await axios.post("http://localhost:4000/api/baskets", {
        name: newBasketName,
        userId,
      });
      setNewBasketName("");
      setShowNewBasketInput(false);
      fetchBaskets(); // refresh list
    } catch (err) {
      console.error("Error creating basket", err);
    }
  };

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

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Please enter a SIP name");
      return;
    }
    if (selectedBaskets.length === 0) {
      alert("Please select at least one basket");
      return;
    }
    onCreate({ name, selectedBaskets, schedules });
    onClose();
  };

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
            <label className="block text-sm font-medium text-gray-700">Select Baskets</label>
            <button
              onClick={() => setShowNewBasketInput((prev) => !prev)}
              className="text-blue-500 text-sm hover:underline"
            >
              + New basket
            </button>
          </div>

          {/* create basket inline */}
          {showNewBasketInput && (
            <div className="flex mb-3 space-x-2">
              <input
                type="text"
                value={newBasketName}
                onChange={(e) => setNewBasketName(e.target.value)}
                placeholder="Basket name"
                className="flex-1 border rounded-md px-3 py-1"
              />
              <button
                onClick={handleCreateBasket}
                className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          )}

          {baskets.length === 0 ? (
            <p className="text-gray-500 text-sm">You haven’t created any baskets yet.</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
              {baskets.map((basket) => (
                <label
                  key={basket._id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedBaskets.includes(basket._id)}
                    onChange={() => handleBasketChange(basket._id)}
                  />
                  <span>{basket.name}</span>
                </label>
              ))}
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
                <option>5th</option>
                <option>10th</option>
                <option>15th</option>
                <option>20th</option>
                <option>25th</option>
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
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewSIPModal;
