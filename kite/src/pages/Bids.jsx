// File: src/pages/BidsTab/BidsTab.jsx
import React, { useState } from "react";
import IPOList from "./BidsTab/IPOList";
import GovtSecurities from "./BidsTab/GovtSecurities";
import Auctions from "./BidsTab/Auctions";
import CorporateActions from "./BidsTab/CorporateActions";
const BidsTab = () => {
  const [activeTab, setActiveTab] = useState("IPO");

  const renderTab = () => {
    switch (activeTab) {
      case "IPO":
        return <IPOList />;
      case "Govt. securities":
        return <GovtSecurities />;
      case "Auctions":
        return <Auctions />;
      case "CorporateActions":
        return <CorporateActions />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="flex space-x-6 border-b pb-2 mb-4">
        {["IPO", "Govt. securities", "Auctions", "CorporateActions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 border-b-2 text-sm font-medium transition-all duration-200 ${
              activeTab === tab ? "border-orange-500 text-orange-600" : "border-transparent text-gray-600 hover:text-orange-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {renderTab()}
    </div>
  );
};

export default BidsTab;






