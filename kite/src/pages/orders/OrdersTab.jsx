import React, { useState } from 'react';
import notebook from '../../assets/notebook.jpeg';
import StockModal from '../../components/StockModel'; // use StockModal here
import { Link } from 'react-router-dom';

const OrdersTab = () => {
  const [showModal, setShowModal] = useState(false); // Controls StockModal visibility

  return (
    <div className="flex justify-center items-center h-[70vh] bg-white">
      <div className="text-center">
        <img
          src={notebook}
          alt="Orders notebook"
          className="mx-auto mb-4 w-12 opacity-80"
        />

        <p className="text-gray-600 text-base mb-2">
          You haven't placed any orders today
        </p>

        <button
          className="bg-blue-600 text-white px-5 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
        >
          Get started
        </button>

        <div className="mt-2">
          <Link
            to="/orders/history"
            className="text-blue-600 text-sm hover:underline"
          >
            View history
          </Link>
        </div>

        {/* Show StockModal conditionally */}
        {showModal && <StockModal onClose={() => setShowModal(false)} />}
      </div>
    </div>
  );
};

export default OrdersTab;
