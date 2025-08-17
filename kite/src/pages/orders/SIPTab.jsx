import React, { useState } from "react";
import sipIcon from "../../assets/sip.png";
import NewSIPModal from "../../components/SIPModal";

const SIPTab = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Example baskets (replace with API later)
  const baskets = [{ _id: 1, name: "john" }];

  const handleCreate = (sipData) => {
    console.log("New SIP created:", sipData);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full py-10 text-gray-600">
      <img src={sipIcon} alt="SIP" className="w-28 h-28 mb-6 opacity-70" />
      <p className="mb-4 text-lg">You haven't created any SIPs.</p>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-600 transition"
      >
        Create new SIP
      </button>

      {isCreateModalOpen && (
        <NewSIPModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreate}
          baskets={baskets}
        />
      )}
    </div>
  );
};

export default SIPTab;
