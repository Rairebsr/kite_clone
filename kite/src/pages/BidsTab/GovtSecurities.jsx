// src/pages/BidsTab/GsecList.jsx
import React, { useState } from "react";
import gsecData from "../../assets/mock_gsec_data.json";
import GsecApplyModal from "../../components/GsecApplyModal";

const GsecList = () => {
  const [selectedGsec, setSelectedGsec] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleApplyClick = (gsec) => {
    setSelectedGsec(gsec);
    setShowModal(true);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Tab heading */}
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Govt. securities ({gsecData.length})
      </h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-2 px-3">Type</th>
              <th className="text-left py-2 px-3">Instrument</th>
              <th className="text-left py-2 px-3">Yield*</th>
              <th className="text-left py-2 px-3">Ends on</th>
              <th className="text-left py-2 px-3">Order value</th>
              <th className="py-2 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {gsecData.map((gsec) => (
              <tr
                key={gsec.symbol}
                className="border-b hover:bg-gray-50 transition duration-150"
              >
                <td className="py-2 px-3">
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                    GSEC
                  </span>
                </td>
                <td className="py-2 px-3 text-gray-800 font-medium">
                  {gsec.name}
                </td>
                <td className="py-2 px-3">{gsec.yield}%</td>
                <td className="py-2 px-3">{gsec.endsOn}</td>
                <td className="py-2 px-3 text-gray-400">—</td>
                <td className="py-2 px-3">
                  <button
                    onClick={() => handleApplyClick(gsec)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded"
                  >
                    Place bid
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-4">
        {gsecData.map((gsec) => (
          <div
            key={gsec.symbol}
            className="border rounded-lg p-3 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                GSEC
              </span>
              <button
                onClick={() => handleApplyClick(gsec)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
              >
                Place bid
              </button>
            </div>
            <div className="text-sm text-gray-800 font-medium mb-1">
              {gsec.name}
            </div>
            <div className="text-xs text-gray-600">
              <p>
                <span className="font-medium">Yield:</span> {gsec.yield}%
              </p>
              <p>
                <span className="font-medium">Ends on:</span> {gsec.endsOn}
              </p>
              <p>
                <span className="font-medium">Order value:</span> —
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <GsecApplyModal
          gsec={selectedGsec}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Yield Info */}
      <p className="text-xs text-gray-500 mt-4">
        * Learn more about{" "}
        <a
          onClick={() =>
            window.open(
              "https://support.zerodha.com/category/trading-and-markets/general-kite/govt-securities/articles/indicative-yield",
              "_blank"
            )
          }
          className="text-blue-600 cursor-pointer"
        >
          yields
        </a>
        .
      </p>
    </div>
  );
};

export default GsecList;
