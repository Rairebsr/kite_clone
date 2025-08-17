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
    <div className="p-6">
      {/* Tab heading */}
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Govt. securities ({gsecData.length})
      </h2>

      {/* Table */}
      <div className="overflow-x-auto">
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
                {/* Type (GSEC tag) */}
                <td className="py-2 px-3">
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                    GSEC
                  </span>
                </td>

                {/* Instrument name */}
                <td className="py-2 px-3 text-gray-800 font-medium">
                  {gsec.name}
                </td>

                {/* Yield */}
                <td className="py-2 px-3">{gsec.yield}%</td>

                {/* End Date */}
                <td className="py-2 px-3">{gsec.endsOn}</td>

                {/* Order value (not shown yet) */}
                <td className="py-2 px-3 text-gray-400">—</td>

                {/* Apply button */}
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
                  onClick={() => window.open('https://support.zerodha.com/category/trading-and-markets/general-kite/govt-securities/articles/indicative-yield', '_blank')}
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
