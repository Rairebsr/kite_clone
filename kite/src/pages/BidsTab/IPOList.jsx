// File: src/pages/BidsTab/IPOList.jsx
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ipoData from "../../assets/mock_stock_data_50.json";
import ApplyModal from "../../components/ApplyModal";

// Helpers
function formatDateRange(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${startDate.getDate()}${getOrdinalSuffix(startDate.getDate())} ${startDate.toLocaleDateString("en-IN", { month: "short" })} — ${endDate.getDate()}${getOrdinalSuffix(endDate.getDate())} ${endDate.toLocaleDateString("en-IN", { month: "short" })}`;
}

function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function getIPOStatus(endDate) {
  const today = new Date();
  return today <= new Date(endDate) ? "Apply" : "Closed";
}

// Logic to calculate other dates
function calculateMilestoneDates({ start, end }) {
  const endDate = new Date(end);

  return {
    start,
    end,
    allotment: new Date(endDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    refund: new Date(endDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    demat: new Date(endDate.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    listing: new Date(endDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    mandate: new Date(endDate.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  };
}

// Get active milestone based on current date
function getActiveMilestoneIndex(dates) {
  const keys = ["start", "end", "allotment", "refund", "demat", "listing", "mandate"];
  const today = new Date();
  let activeIndex = 0;
  for (let i = 0; i < keys.length; i++) {
    const date = new Date(dates[keys[i]]);
    if (today >= date) activeIndex = i;
  }
  return activeIndex;
}

const IPOList = () => {
  const [expanded, setExpanded] = useState(null);
  const [selectedIPO, setSelectedIPO] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isApplyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

   const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setApplyModalOpen(false);

    // Optional: proceed to UPI/quantity modal, console log, etc.
    console.log("Selected category:", category);
  };
  return (
    <div>
      <div className="grid grid-cols-5 text-sm text-gray-500 font-semibold border-b pb-2">
        <span>Instrument</span>
        <span>Date</span>
        <span>Price (₹)</span>
        <span>Min. amount (₹)</span>
        <span></span>
      </div>

      {ipoData.map((ipo, index) => {
        const calculatedDates = calculateMilestoneDates(ipo.dates);
        const status = getIPOStatus(calculatedDates.end);
        const isOpen = expanded === index;
        const activeIndex = getActiveMilestoneIndex(calculatedDates);
        const value = ipo.high*ipo.qty;
        return (
          <div key={index}>
            <div
              className="grid grid-cols-5 text-sm items-center py-3 border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => setExpanded(isOpen ? null : index)}
            >
              <div>
                <div className="font-medium text-gray-800 flex items-center gap-1">
                  {ipo.symbol}
                  {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                <div className="text-xs text-gray-500">{ipo.name}</div>
              </div>
              <div>{formatDateRange(calculatedDates.start, calculatedDates.end)}</div>
              <div>{`${ipo.low} - ${ipo.high}`}</div>
              <div>
                {ipo.cutoff}
                <div className="text-[10px]">
                  <div className="text-[14px]">{value}</div>
                  {ipo.qty} Qty.</div>
              </div>
              <div>
                <button
  onClick={(e) => {
    e.stopPropagation();
    if (status === "Apply") {
      setSelectedIPO({ ...ipo, dates: calculatedDates }); // attach calculated timeline
      setShowApplyModal(true);
    }
  }}
  className={`px-4 py-1 text-sm rounded ${
    status === "Apply"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-300 text-gray-600 cursor-not-allowed"
  }`}
>
  {status}
</button>
              </div>
            </div>

            {isOpen && (
              <div className="bg-gray-100 px-6 py-4 border-b">
                <div className="flex justify-between items-start text-xs relative">
                  {[
                    { label: "Offer start", date: calculatedDates.start },
                    { label: "Offer end", date: calculatedDates.end },
                    { label: "Allotment", date: calculatedDates.allotment },
                    { label: "Refund initiation", date: calculatedDates.refund },
                    { label: "Demat transfer", date: calculatedDates.demat },
                    { label: "Listing", date: calculatedDates.listing },
                    { label: "Mandate end", date: calculatedDates.mandate },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center text-gray-600 w-full z-10">
                      <div
                        className={`w-3 h-3 rounded-full mb-1 ${
                          idx <= activeIndex ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      />
                      <div className="text-[11px] font-medium text-center whitespace-nowrap">{item.label}</div>
                      <div className="text-[10px] text-gray-500 text-center whitespace-nowrap">
                        {new Date(item.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                      </div>
                    </div>
                  ))}
                  <div className="absolute top-[6px] left-[8px] right-[8px] h-1 bg-gray-300" style={{ zIndex: 0 }}>
                    <div
                      className="h-1 bg-blue-600"
                      style={{ width: `${(activeIndex / 6) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <ApplyModal
  isOpen={showApplyModal}
  onClose={() => setShowApplyModal(false)}
  ipo={selectedIPO}
/>

    </div>
  );
};

export default IPOList;
