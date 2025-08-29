import React, { useState } from 'react';
import { FaBell, FaShoppingCart, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import ProfileModal from './ProfileModel';
import CartModal from './CartModal';

const Navbar = ({isSidebarOpen,setIsSidebarOpen}) => {
  
  const [showModal, setShowModal] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-4 flex items-center justify-between w-full sticky top-0 z-50 h-14">
      
      {/* Left - Hamburger for Watchlist Sidebar */}
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden text-xl text-gray-700"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FaBars />
        </button>

        {/* Desktop Sensex/Nifty */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          <span className="text-green-600">SENSEX: 76,240.15 ▲ 0.28%</span>
          <span className="text-red-600">NIFTY: 23,212.55 ▼ 0.15%</span>
          <div className="h-10 w-px bg-gray-300"></div>
        </div>
      </div>

      {/* Middle - Logo */}
      <Link to='/dashboard'>
        <img src={assets.kite} className='w-8' alt='logo' />
      </Link>

      {/* Desktop NavLinks */}
      <div className="hidden md:flex gap-6 text-gray-700 text-sm font-semibold">
        <ul className='flex gap-10 text-m text-gray-700'>
          <NavLink to='/dashboard'>Dashboard</NavLink>
          <NavLink to='/orders'>Orders</NavLink>
          <NavLink to='/holdings'>Holdings</NavLink>
          <NavLink to='/position'>Positions</NavLink>
          <NavLink to='/bids'>Bids</NavLink>
          <NavLink to='/funds'>Funds</NavLink>
        </ul>
      </div>

      {/* Right - Icons + Mobile Nav Drawer Button */}
      <div className="flex items-center gap-4 text-xl text-gray-600">
        {/* Right-side Drawer Menu (mobile only) */}
        <button 
          className="md:hidden text-xl"
          onClick={() => setIsRightDrawerOpen(true)}
        >
          <FaBars />
        </button>

        <FaShoppingCart
          onClick={() => setIsCartOpen(true)}
          className="hover:text-orange-500 cursor-pointer"
        />
        <FaBell className="hover:text-orange-500 cursor-pointer" />
        <FaUserCircle
          className="hover:text-blue-600 cursor-pointer"
          onClick={() => setShowModal(true)}
        />
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Profile Modal */}
      <ProfileModal show={showModal} onClose={() => setShowModal(false)} />

      {/* Right Nav Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isRightDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold text-lg">Menu</h2>
          <button onClick={() => setIsRightDrawerOpen(false)} className="text-xl">
            <FaTimes />
          </button>
        </div>

        {/* NavLinks for Mobile */}
        <ul className="flex flex-col gap-4 p-4 text-gray-700 font-medium">
          <NavLink to='/dashboard' onClick={() => setIsRightDrawerOpen(false)}>Dashboard</NavLink>
          <NavLink to='/orders' onClick={() => setIsRightDrawerOpen(false)}>Orders</NavLink>
          <NavLink to='/holdings' onClick={() => setIsRightDrawerOpen(false)}>Holdings</NavLink>
          <NavLink to='/position' onClick={() => setIsRightDrawerOpen(false)}>Positions</NavLink>
          <NavLink to='/bids' onClick={() => setIsRightDrawerOpen(false)}>Bids</NavLink>
          <NavLink to='/funds' onClick={() => setIsRightDrawerOpen(false)}>Funds</NavLink>
        </ul>
      </div>

      {/* Right Drawer Backdrop */}
      {isRightDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsRightDrawerOpen(false)}
        ></div>
      )}

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
