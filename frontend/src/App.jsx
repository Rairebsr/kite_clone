import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Pricing from './pages/Pricing';
import Supports from './pages/Supports';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import BrokerageCalculator from './components/BrokerageCalculator';
import Signin from './pages/Signin';
import Pan from './signup/Pan';
import ProtectedRoute from './components/ProtectedRoute';
import Finalise from './signup/Finalise';
import Aadhaar from './signup/Aadhaar';
import Profile from './signup/Profile';
import Bank from './signup/Bank';
import WebcamVerification from './signup/WebcamVerification';
import {ToastContainer} from 'react-toastify';


const App = () => {
  const location = useLocation();

  const fullWidthRoutes = ['/support'];
  const isFullWidth = fullWidthRoutes.includes(location.pathname);

  const hideLayoutRoutes = ['/pan', '/finalize', '/aadhaar', '/profile', '/bank', '/webcam'];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);


  return (
    <div>
      <ToastContainer/>
      {/* Always full-width */}
      {!shouldHideLayout && <NavBar />}

      {/* Conditionally padded main content */}
      <div className={isFullWidth ? '' : 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signin' element={<Signin/>}/>
          <Route path='/about' element={<About />} />
          <Route path='/products' element={<Products />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/support' element={<Supports />} />
          <Route path="/brokerage-calculator" element={<BrokerageCalculator />} />

          {/*sign up route */}
          <Route path='/pan' element={
            <ProtectedRoute>
              <Pan />
            </ProtectedRoute>
          } />
          <Route path='/finalize' element={
            <ProtectedRoute>
              <Finalise/>
            </ProtectedRoute>
          } />
          <Route path='/aadhaar' element={
            <ProtectedRoute>
              <Aadhaar/>
            </ProtectedRoute>
          } />
          <Route path='/profile' element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          } />
          <Route path='/bank' element={
            <ProtectedRoute>
              <Bank/>
            </ProtectedRoute>
          } />
          <Route path='/webcam' element={
            <ProtectedRoute>
              <WebcamVerification/>
            </ProtectedRoute>
          } />
        </Routes>
        
      </div>

      {/* Always full-width */}
      {!shouldHideLayout && <Footer />}
    </div>
  );
};

export default App;
