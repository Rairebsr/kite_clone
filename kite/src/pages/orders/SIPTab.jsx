// src/pages/SIPsPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Pencil, Trash2 } from "lucide-react";
import NewSIPModal from "../../components/SIPModal";

const SIPsPage = () => {
  const [sips, setSips] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSip, setEditSip] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
      fetchSIPs(decoded.id);
    }
  }, []);

  const fetchSIPs = async (uid) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/sips/${uid}`);
      setSips(res.data);
    } catch (err) {
      console.error("Error fetching SIPs:", err);
    }
  };

  const handleDelete = async (id) => {
    // if (!window.confirm("Delete this SIP?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/sips/${id}`);
      setSips(sips.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting SIP:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          SIP ({sips.length})
        </h2>
        <button
          onClick={() => {
            setEditSip(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          New SIP
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-300 text-gray-500">
            <th className="py-3">Name</th>
            <th>Status</th>
            <th>Monthly schedule</th>
            <th>Baskets</th>
            <th>Created on</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sips.map((sip) => (
            <tr key={sip._id} className="border-b-2 border-gray-300 hover:bg-gray-50">
              <td className="py-3">{sip.name}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    sip.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : sip.status === "PAUSED"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {sip.status}
                </span>
              </td>
              <td className="flex flex-col gap-1">
                {sip.schedules.map((sch, idx) => {
                  const nextDate = new Date();
                  nextDate.setDate(sch.day);
                  if (nextDate < new Date()) {
                    nextDate.setMonth(nextDate.getMonth() + 1);
                  }
                  const daysLeft = Math.ceil(
                    (nextDate - new Date()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                        {sch.day}th
                      </span>
                      <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                        {sch.time}
                      </span>
                      <span className="text-gray-500">
                        in {daysLeft} days
                      </span>
                    </div>
                  );
                })}
              </td>
              <td>
                <ul className="list-disc ml-5 text-gray-700 text-sm">
                  {sip.baskets.map((b, i) => (
                    <li key={i}>{b.name}</li>
                  ))}
                </ul>
              </td>
              <td>{new Date(sip.createdAt).toISOString().split("T")[0]}</td>
              <td className="flex justify-end gap-3 pr-3">
                <button
                  onClick={() => {
                    setEditSip(sip);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(sip._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <NewSIPModal
          onClose={() => setIsModalOpen(false)}
          onCreate={() => fetchSIPs(userId)}
          sipData={editSip} // pass SIP for editing
        />
      )}
    </div>
  );
};

export default SIPsPage;
