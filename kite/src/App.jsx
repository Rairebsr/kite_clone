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
import Layout from './components/Layout';




const App = () => {
    const location = useLocation();
    const hideLayoutRoutes = ['/'];
    const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <div>
  <ToastContainer />
  {!shouldHideLayout && <Navbar />}

  <div className="flex">
    {!shouldHideLayout && <Sidebar />}
    
    <div className="flex-1">
      <Routes>
        <Route path='/' element={<LoginPg />} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/holdings' element={<Holdings />} />
        <Route path='/position' element={<Position />} />
        <Route path='/bids' element={<Bids />} />
        <Route path='/funds' element={<Funds />} />
      </Routes>
    </div>
  </div>
</div>

  )
}

export default App
