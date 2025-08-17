import React, { useState } from 'react';
import gttImage from '../../assets/gtt.jpeg';
import StockModal from '../../components/StockModel';
import { Link } from 'react-router-dom';

const GTTTab = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex justify-center items-center h-[70vh] bg-white">
      <div className="text-center">
        <img
          src={gttImage}
          alt="GTT Icon"
          className="mx-auto mb-4 w-50 opacity-90"
        />

        <p className="text-gray-600 text-base mb-2 max-w-md mx-auto">
          You have not created any triggers.{' '}
          <Link to="/help/gtt" className="text-blue-600 hover:underline">
            Learn more
          </Link>{' '}
          about setting automatic stoploss and target orders for your holdings.
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition"
        >
          New GTT
        </button>

        {showModal && (
          <StockModal onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
};

export default GTTTab;
