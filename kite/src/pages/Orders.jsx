// src/pages/Orders.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Orders = () => {
  const tabStyle = ({ isActive }) =>
    `px-4 py-2 text-sm font-medium border-b-2 ${
      isActive ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'
    }`;

  return (
    <div className="p-4">
      {/* Tabs Navbar */}
      <div className="flex gap-4 border-b mb-4">
        <NavLink to="/orders/orders" className={tabStyle}>
          Orders
        </NavLink>
        <NavLink to="/orders/gtt" className={tabStyle}>
          GTT
        </NavLink>
        <NavLink to="/orders/baskets" className={tabStyle}>
          Baskets
        </NavLink>
        <NavLink to="/orders/sip" className={tabStyle}>
          SIP
        </NavLink>
        <NavLink to="/orders/alerts" className={tabStyle}>
          Alerts
        </NavLink>
      </div>

      {/* ✅ This renders the active tab's component */}
      <Outlet />
    </div>
  );
};

export default Orders;
