import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {assets} from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { features } from './Features'

const NavBar = () => {
    const [open,setOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b py-4 shadow-md'>
      <div className='flex items-center justify-between py-3 px-6 max-w-7xl mx-auto'>
        <Link to='/'><img src={assets.logo} className='w-40' alt='logo'/></Link>
        
        <ul className='hidden sm:flex gap-10 text-m text-gray-700'>
            <NavLink to='/signin' className='flex flex-col items-center gap-1 hover:text-gray-900 transition-all duration-300'>
                <p>SignUp</p>
                <hr className='w-2/2 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
            <NavLink to='/about' className='flex flex-col items-center gap-1 hover:text-gray-900 transition-all duration-300'>
                <p>About</p>
                <hr className='w-2/2 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
            <NavLink to='/products' className='flex flex-col items-center gap-1 hover:text-gray-900 transition-all duration-300'>
                <p>Products</p>
                <hr className='w-2/2 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
            <NavLink to='/pricing' className='flex flex-col items-center gap-1 hover:text-gray-900 transition-all duration-300'>
                <p>Pricing</p>
                <hr className='w-2/2 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
            <NavLink to='/support' className='flex flex-col items-center gap-1 hover:text-gray-900 transition-all duration-300'>
                <p>Support</p>
                <hr className='w-2/2 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
            
            <div className='relative'>
                
                <div >
                <img
                    src={assets.drop_icon} 
                    alt="menu"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => setOpen(!open)}
                />
                </div>

                {open && (
                    <div className='absolute top-10 right-0 w-[28rem] bg-white shadow-xl border rounded-lg z-50 p-4 space-y-4'>
                        {/* top section */}
                    <div className="flex flex-wrap justify-between gap-4">
                        {features.map((item, index) => (
                            <div key={index} className="flex flex-col items-center text-center w-[6.5rem]">
                                <img src={item.icon} alt={item.title} className="w-8 h-8 mb-2" />
                                <h3 className="font-semibold text-sm">{item.title}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                            </div>
                        ))}
                    </div>
                    
                    <hr />
                    
                    {/* bottom section */}
                    <div className='flex justify-between bg-gray-100 p-4 rounded-lg'>
                        <div className="space-y-1">
                            <h4 className="font-semibold text-sm">Utilities</h4>
                            <a href="/calculator" className="text-xs text-blue-500 block">Calculator</a>
                            <a href="/Brokerage" className="text-xs text-blue-500 block">Brokerage Calculator</a>
                            <a href="/Margin" className="text-xs text-blue-500 block">Margin Calculator</a>
                            <a href="/sip" className="text-xs text-blue-500 block">SIP Calculator</a>
                        </div>

                        <div className="space-y-1">
                            <h4 className="font-semibold text-sm">Updates</h4>
                            <a href="/z-connect" className="text-xs text-blue-500 block">Z-connect Blog</a>
                            <a href="/cic-Bull" className="text-xs text-blue-500 block">Circulars/Bulletins</a>
                            <a href="/ipo" className="text-xs text-blue-500 block">IPOs</a>
                            <a href="/market" className="text-xs text-blue-500 block">Markets</a>
                        </div>
                        
                        <div className="space-y-1">
                            <h4 className="font-semibold text-sm">Education</h4>
                            <div className="flex gap-3 mt-1">
                                <img src={assets.varsity} alt="tool1" className="w-10 " />
                                <img src={assets.trade_qa} alt="tool2" className="w-10 " />
                            </div>
                        </div>
                    </div>
                </div>
                )}

            </div>
        </ul>
        
      <div className='sm:hidden flex items-center'>
                    <img
                        src={assets.drop_icon}
                        alt="menu"
                        className="w-6 h-6 cursor-pointer"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    />
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className='sm:hidden absolute top-20 left-0 right-0 bg-white shadow-lg border rounded-lg z-50 p-4 mx-4'>
                        <ul className='space-y-4'>

                            <div className='grid grid-cols-2 gap-4'>
                                <NavLink to='/signin' className='block py-2 px-4 hover:bg-gray-100 rounded' onClick={() => setMobileMenuOpen(false)}>
                                SignUp
                            </NavLink>
                            <NavLink to='/about' className='block py-2 px-4 hover:bg-gray-100 rounded' onClick={() => setMobileMenuOpen(false)}>
                                About
                            </NavLink>
                            <NavLink to='/products' className='block py-2 px-4 hover:bg-gray-100 rounded' onClick={() => setMobileMenuOpen(false)}>
                                Products
                            </NavLink>
                            <NavLink to='/pricing' className='block py-2 px-4 hover:bg-gray-100 rounded' onClick={() => setMobileMenuOpen(false)}>
                                Pricing
                            </NavLink>
                            <NavLink to='/support' className='block py-2 px-4 hover:bg-gray-100 rounded' onClick={() => setMobileMenuOpen(false)}>
                                Support
                            </NavLink>
                            </div>
                            
                            <div className='border-t pt-4'>
                                <h3 className='font-semibold px-4 mb-2'>Features</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {features.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
                                            <img src={item.icon} alt={item.title} className="w-6 h-6" />
                                            <div>
                                                <h4 className="font-medium text-sm">{item.title}</h4>
                                                <p className="text-xs text-gray-500">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className='flex justify-between bg-gray-100 p-4 rounded-lg'>
                        <div className="space-y-1">
                            <h4 className="font-semibold text-sm">Utilities</h4>
                            <a href="/calculator" className="text-xs text-blue-500 block">Calculator</a>
                            <a href="/Brokerage" className="text-xs text-blue-500 block">Brokerage Calculator</a>
                            <a href="/Margin" className="text-xs text-blue-500 block">Margin Calculator</a>
                            <a href="/sip" className="text-xs text-blue-500 block">SIP Calculator</a>
                        </div>

                        <div className="space-y-1">
                            <h4 className="font-semibold text-sm">Updates</h4>
                            <a href="/z-connect" className="text-xs text-blue-500 block">Z-connect Blog</a>
                            <a href="/cic-Bull" className="text-xs text-blue-500 block">Circulars/Bulletins</a>
                            <a href="/ipo" className="text-xs text-blue-500 block">IPOs</a>
                            <a href="/market" className="text-xs text-blue-500 block">Markets</a>
                        </div>
                        
                        <div className="space-y-1">
                            <h4 className="font-semibold text-sm">Education</h4>
                            <div className="flex gap-3 mt-1">
                                <img src={assets.varsity} alt="tool1" className="w-10 " />
                                <img src={assets.trade_qa} alt="tool2" className="w-10 " />
                            </div>
                        </div>
                    </div>
                        </ul>
                    </div>
                )}
            </div>
        </div>
  )
}

export default NavBar
