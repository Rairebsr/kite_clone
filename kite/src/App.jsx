import React from 'react'
import {Routes,Route,useLocation} from 'react-router-dom'
import LoginPg from './pages/LoginPg'
import {ToastContainer} from 'react-toastify';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Holdings from './pages/Holdings';
import Position from './pages/Position';
import Bids from './pages/Bids';
import Funds from './pages/Funds';
import Sidebar from './components/Sidebar';
// import Layout from './components/Layout';
import OrdersTab from './pages/orders/OrdersTab';
import GTTTab from './pages/orders/GTTTab';
import BasketsTab from './pages/orders/BasketsTab';
import SIPTab from './pages/orders/SIPTab';
import AlertsTab from './pages/orders/AlertsTab';
import BidsTab from './pages/Bids';
import NewAlertModal from './pages/Alerts/NewAlertModal';
import { useState } from 'react';

const App = () => {
    const location = useLocation();
    const hideLayoutRoutes = ['/'];
    const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebar, setIsSidebar] = useState(false);



  return (
    <div>
  <ToastContainer />
  {!shouldHideLayout && <Navbar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />}

  <div className="flex">
    {!shouldHideLayout && <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />}
    
    <div className="flex-1">
      <Routes>
        <Route path='/' element={<LoginPg />} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/holdings' element={<Holdings />} />
        <Route path='/position' element={<Position />} />
        <Route path='/bids' element={<BidsTab />} />
        <Route path='/funds' element={<Funds />} />
        {/* <Route path="alerts" element={<AlertsTab />} /> */}

      <Route path="/orders" element={<Orders />}>
  {/* 👇 This makes OrdersTab the default */}
  <Route index element={<OrdersTab />} /> 

  <Route path="orders" element={<OrdersTab />} />
  <Route path="gtt" element={<GTTTab />} />
  <Route path="baskets" element={<BasketsTab />} /> 
  <Route path="sip" element={<SIPTab />} />
  <Route path="alerts" element={<AlertsTab />} />
</Route>
      </Routes>
    </div>
  </div>
</div>

  )
}

export default App
