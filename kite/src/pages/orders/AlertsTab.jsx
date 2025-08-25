import React, { useState, useEffect } from 'react';
import NewAlertModal from './../Alerts/NewAlertModal';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const AlertsTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [userId, setUserId] = useState(null); // ✅ Dynamic
 // Replace with dynamic user ID if needed

  
useEffect(() => {
  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("No token found in localStorage.");
        return;
      }

      const decoded = jwtDecode(token);
      setUserId(decoded.id); // state
      localStorage.setItem("userId", decoded.id); // also persist for create

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/alerts/user/${decoded.id}`);

      if (response.data.success) {
        const validAlerts = response.data.alerts.filter(
          alert => alert.name && alert.condition // match what you actually store
        );
        setAlerts(validAlerts);
      } else {
        console.warn("No alerts fetched from backend");
      }
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  fetchAlerts();
}, []);

  // const [alerts, setAlerts] = useState([
  //   {
  //     name: 'GOLDBEES',
  //     condition: 'Last price of NSE:GOLDBEES ≥ 93.27',
  //     status: 'ENABLED',
  //     type: 'SIMPLE',
  //     triggered: 'N/A',
  //     createdOn: '2025-06-26'
  //   }
  // ]);

  const handleCreateAlert = async (newAlert) => {
  if (!userId) {
    console.error("No userId available");
    return;
  }

  const formatted = {
    userId,
    name: newAlert.symbol,
    condition: `Last price of NSE:${newAlert.symbol} ${newAlert.condition} ${newAlert.price}`,
    status: "ENABLED",
    type: newAlert.alertType === "Only alert" ? "SIMPLE" : "ATO",
    triggered: "N/A",
    createdOn: new Date().toISOString().split("T")[0],
  };

  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/alerts`, formatted);
    if (res.data.success) {
      setAlerts((prev) => [...prev, res.data.alert]);
    }
  } catch (err) {
    console.error("Error saving alert:", err);
  }
};

  return (
    <div className="p-6 text-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Alerts ({alerts.length})</h2>
        <div className="flex gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm rounded"
            onClick={() => setIsModalOpen(true)}
          >
            New alert
          </button>
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none"
          />
        </div>
      </div>

      <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
        <thead className="text-gray-500">
          <tr>
            <th className="pl-2"><input type="checkbox" /></th>
            <th>Name</th>
            <th>Status</th>
            <th>Type</th>
            <th>Triggered</th>
            <th>Created on</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, idx) => (
            <tr key={idx} className="bg-white rounded shadow-sm">
              <td className="pl-2"><input type="checkbox" /></td>
              <td>
                <div>
                  <p className="font-medium text-gray-800">{alert.name}</p>
                  <p className="text-xs text-gray-500">{alert.condition}</p>
                </div>
              </td>
              <td>
                <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-xs">
                  {alert.status}
                </span>
              </td>
              <td>
                <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded text-xs">
                  {alert.type}
                </span>
              </td>
              <td>{alert.triggered}</td>
              <td>{alert.createdOn}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <NewAlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateAlert}
      />
    </div>
  );
};

export default AlertsTab;
