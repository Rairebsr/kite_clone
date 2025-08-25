import React, { useState } from "react";
import stockData from "../../assets/mock_stock_data_50.json"; // Mock data import
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const NewAlertModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    instrument: "NIFTY 50",
    condition: "Last price",
    type: ">=",
    value: "",
    alertType: "Only alert",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedToDelete, setSelectedToDelete] = useState([]);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    setUserId(decoded.id);
  }
}, []);
  const filteredStocks = stockData.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectInstrument = (instrument) => {
    setFormData({ ...formData, instrument: instrument.symbol });
    setSearchTerm("");
    if (formData.alertType === "Alert Triggers Order (ATO)") {
      const exists = selectedInstruments.find((i) => i.symbol === instrument.symbol);
      if (!exists) {
        const newInst = {
          ...instrument,
          exchange: "NSE",
          qty: 1,
          price: instrument.price,
          ltp: instrument.price,
          margin: 149.23,
        };
        const updatedList = [...selectedInstruments, newInst];
        setSelectedInstruments(updatedList);
        onCreate && onCreate(newInst);
      }
    }
  };

  const updateQty = (index, newQty) => {
    const updated = [...selectedInstruments];
    updated[index].qty = parseInt(newQty) || 1;
    setSelectedInstruments(updated);
  };

  const updatePrice = (index, newPrice) => {
    const updated = [...selectedInstruments];
    updated[index].price = parseFloat(newPrice) || 0;
    setSelectedInstruments(updated);
  };

  const handleCheckboxToggle = (symbol) => {
    setSelectedToDelete((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const handleClearBasket = () => {
    setSelectedInstruments([]);
    setSelectedToDelete([]);
  };

  const handleDeleteSelected = () => {
    setSelectedInstruments((prev) =>
      prev.filter((inst) => !selectedToDelete.includes(inst.symbol))
    );
    setSelectedToDelete([]);
  };

  const handleCreate = async () => {
  const alertData = {
    userId,
    instrument: formData.instrument,
    conditionType: formData.condition,
    comparator: formData.type,
    triggerValue: parseFloat(formData.value),
    alertType: formData.alertType === "Only alert" ? "SIMPLE" : "ATO",
    status: "ENABLED",
    triggered: "N/A",
    createdOn: new Date().toISOString().split("T")[0],
    basket: formData.alertType === "Alert Triggers Order (ATO)" ? selectedInstruments.map(inst => ({
      symbol: inst.symbol,
      exchange: inst.exchange,
      ltp: inst.ltp,
      qty: inst.qty,
      price: inst.price,
      orderType: "LIMIT",
      margin: inst.margin
    })) : []
  };

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/alerts`, alertData);
if (response.data.success) {
  onCreate(response.data.alert); // ✅ real backend alert sent to AlertsTab
  onClose();
}

  } catch (error) {
    console.error("Error saving alert:", error);
  }
};

  const buildAlertDescription = (instrument, triggerPrice) => {
  if (!instrument || !instrument.symbol || triggerPrice === undefined) return "Invalid alert";
  return `Last price of ${instrument.symbol} >= ${triggerPrice}`;
};

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-[750px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Alert Form */}
        <div className="flex gap-2 mb-4">
          <select
            name="condition"
            className="border p-2 rounded"
            onChange={handleChange}
            value={formData.condition}
          >
            <option>Last price</option>
          </select>
          <span className="flex items-center">of</span>
          <input
            type="text"
            value={`${formData.instrument} (INDICES)`}
            className="border p-2 rounded w-full"
            readOnly
          />
          <select
            name="type"
            className="border p-2 rounded"
            value={formData.type}
            onChange={handleChange}
          >
            <option value=">=">&ge;</option>
            <option value="<=">&le;</option>
            <option value="==">=</option>
          </select>
          <span className="flex items-center">than</span>
          <input
            name="value"
            type="number"
            className="border p-2 rounded w-28"
            placeholder="25461.00"
            value={formData.value}
            onChange={handleChange}
          />
        </div>

        {/* ATO Section */}
        {formData.alertType === "Alert Triggers Order (ATO)" && (
          <>
            {/* Search + Basket Controls */}
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 mr-2"
                placeholder="Search instrument (e.g., INFY, NIFTY FUT...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {selectedToDelete.length > 0 ? (
                <button className="text-blue-600 text-sm" onClick={handleDeleteSelected}>
                  🗑 Delete ({selectedToDelete.length})
                </button>
              ) : (
                selectedInstruments.length > 0 && (
                  <button className="text-blue-600 text-sm" onClick={handleClearBasket}>
                    ⟳ Clear basket
                  </button>
                )
              )}
            </div>

            {/* Search dropdown */}
            {searchTerm && (
              <ul className="max-h-48 overflow-y-auto border rounded mb-4 bg-white shadow z-10">
                {filteredStocks.length > 0 ? (
                  filteredStocks.map((stock) => (
                    <li
                      key={stock.symbol}
                      className="py-2 px-3 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleSelectInstrument(stock)}
                    >
                      {stock.name} ({stock.symbol})
                    </li>
                  ))
                ) : (
                  <li className="py-2 px-3 text-gray-500 italic">No results found</li>
                )}
              </ul>
            )}

            {/* Table Header */}
            {selectedInstruments.length > 0 && (
              <div className="flex items-center justify-between font-semibold text-sm text-gray-600 border-b py-2 mt-2">
                <span className="w-5"></span>
                <span className="w-10 text-center">Type</span>
                <span className="flex-1">Instrument ({selectedInstruments.length} / 20)</span>
                <span className="w-14 text-center">LTP</span>
                <span className="w-28 text-center">Order Type</span>
                <span className="w-10 text-center">Qty</span>
                <span className="w-14 text-center">Price</span>
                <span className="w-24 text-center">Req. margin</span>
              </div>
            )}

            {/* Rows */}
            {selectedInstruments.map((inst, index) => (
              <div key={index} className="flex items-center justify-between border-b py-2">
                <input
                  type="checkbox"
                  checked={selectedToDelete.includes(inst.symbol)}
                  onChange={() => handleCheckboxToggle(inst.symbol)}
                  className="w-5"
                />
                <div className="w-10 text-center">
                  <span className="px-2 py-1 text-xs bg-blue-100 rounded">B</span>
                </div>
                <div className="flex-1">
                  <span>
                    {inst.symbol}{" "}
                    <span className="text-xs text-gray-500">{inst.exchange}</span>
                  </span>
                </div>
                <span className="w-14 text-center">{inst.ltp}</span>
                <div className="w-28 flex gap-1 justify-center">
                  <button className="px-2 py-1 text-xs bg-gray-100 rounded">LIMIT</button>
                  <button className="px-2 py-1 text-xs bg-gray-100 rounded">MIS CO</button>
                </div>
                <input
                  type="number"
                  value={inst.qty}
                  onChange={(e) => updateQty(index, e.target.value)}
                  className="w-10 border rounded text-center"
                />
                <input
                  type="number"
                  value={inst.price}
                  onChange={(e) => updatePrice(index, e.target.value)}
                  className="w-14 border rounded text-center"
                />
                <span className="w-24 text-center">₹{inst.margin}</span>
              </div>
            ))}
          </>
        )}

        {/* Alert Type Radio */}
        <div className="mb-4 mt-4">
          <label className="mr-4">
            <input
              type="radio"
              name="alertType"
              value="Only alert"
              checked={formData.alertType === "Only alert"}
              onChange={handleChange}
            />{" "}
            Only alert
          </label>
          <label>
            <input
              type="radio"
              name="alertType"
              value="Alert Triggers Order (ATO)"
              checked={formData.alertType === "Alert Triggers Order (ATO)"}
              onChange={handleChange}
            />{" "}
            Alert Triggers Order (ATO)
          </label>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleCreate}
          >
            Create
          </button>
          <button className="border px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewAlertModal;
