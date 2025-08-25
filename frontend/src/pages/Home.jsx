import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'


const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
        <div className='flex flex-col items-center justify-center h-screen text-center px-4'>
          <img className='w-[30rem] md:w-[42rem] object-contain' src={assets.home} alt="" />
          
          <p className='text-5xl text-gray-700 font-bold mb-2 py-2'>Invest in Everything</p>
          
          <p className='text-xl text-gray-500 mb-6'>
            Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.
          </p>
          
          <button 
          onClick={() => navigate('/signin')}
          className='bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition'
        >
          Sign Up for free
        </button>
        </div>

      <div className='flex flex-col md:flex-row items-center justify-between px-6 py-10 bg-white'>
    
        <div className='md:w-1/2 space-y-6'>
          <h3 className='text-3xl font-bold mb-4'>Trust with confidence</h3>

          <div>
            <h5 className='text-lg font-semibold mb-1'>Customer-first always</h5>
            <span className='text-gray-500'>
              <p>That's why 1.6+ crore customers trust Zerodha with ~ ₹6</p>
              <p>lakh crores of equity investments and contribute to 15%</p>
              <p>of daily retail exchange volumes in India.</p>
            </span>
          </div>

          <div>
            <h5 className='text-lg font-semibold mb-1'>No spam or gimmicks</h5>
            <span className='text-gray-500'>
              
              <p>No gimmicks, spam, "gamification", or annoying push </p>
              <p>notifications. High quality apps that you use at your </p>
              <p>pace, the way you like. Our philosophies.</p>
            
            </span>
          </div>

          <div>
            <h5 className='text-lg font-semibold mb-1'>The Zerodha universe</h5>
            <span className='text-gray-500'>
                <p>Not just an app, but a whole ecosystem. Our investments</p>
              <p>in 30+ fintech startups offer you tailored services</p> 
              <p>specific to your needs.</p>
            </span>
          </div>

          <div>
            <h5 className='text-lg font-semibold mb-1'>Do better with money</h5>
            <span className='text-gray-500'>
              <p>With initiatives like Nudge and Kill Switch, we don't just</p>
              <p>facilitate transactions, but actively help you do better</p>
              <p>with your money.</p>
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center mt-20 px-4 relative">
          
          <img
            className="w-full max-w-4xl object-contain"
            src={assets.ecosystem}
            alt="Ecosystem"
          />

          
          <div className="mt-6 flex flex-wrap justify-center gap-8">
            <a href="/explore" className="text-blue-600 text-xl font-medium hover:text-gray-600">
              Explore our products&nbsp;&rarr;
            </a>
            <a href="/try" className="text-blue-600 text-xl font-medium hover:text-gray-600">
              Try Kite Demo&nbsp;&rarr;
            </a>
          </div>

          {/* Press Logo*/}
          <div className="mt-12 flex justify-center">
            <img src={assets.press} alt="Press" className="w-[710px] h-[40px]" />
          </div>
        </div>

      </div>
      

      <div className='flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-white'>

        {/* Left Side  Text  */}
        <div className='md:w-1/2 space-y-6 text-center md:text-left mt-10 md:mt-0'>
          <h3 className='text-3xl md:text-4xl font-bold'>Unbeatable pricing</h3>
            <span className='text-gray-500'>
              <p>We pioneered the concept of discount broking and price</p>
              <p>transparency in India. Flat fees and no hidden charges.</p>              
            </span>
          <a href="/price" className="inline-block text-blue-600 text-xl font-medium hover:text-gray-600">
            See Pricing &rarr;
          </a>
        </div>

        {/* Right Side  Horizontal Images */}
        <div className='md:w-1/2 flex flex-col md:flex-row items-center justify-center gap-6 mt-10 md:mt-0'>

          
          <div className='flex items-center gap-3'>
            <img src={assets.pg0} alt="Free account opening" className='w-[120px] h-[85px]  object-contain' />
            <span className='text-[10px] text-gray-700 font-medium'>Free account<br />opening</span>
          </div>

        
          <div className='flex items-center gap-3'>
            <img src={assets.pg0} alt="Free equity delivery" className='w-[150px] h-[90px] object-contain' />
            <span className='text-[10px] text-gray-700 font-medium'>
              <p>Free equity delivery</p>
              <p>and direct mutual funds</p>
            </span>
          </div>

          
          <div className='flex items-center gap-3'>
            <img src={assets.pg20} alt="" className='w-[150px] h-[90px] object-contain' />
            <span className='text-[10px] text-gray-700 font-medium'>Intraday and<br />F&amp;O</span>
          </div>
          
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-white">

        {/* Left – Image */}
        <div className="md:w-1/2 flex justify-center mb-10 md:mb-0">
          <img src={assets.education} alt="" className="w-full max-w-md object-contain" />
        </div>

        {/* Right – Text Content */}
        <div className="md:w-1/2 space-y-6 space-x-4 text-center md:text-left">
          <h3 className="text-3xl md:text-4xl font-bold">Free and open market education</h3>
          <p className="text-gray-500">
            Varsity, our education initiative, is an extensive and in-depth resource on trading and investment. 
            Everything is completely open and accessible to all.
          </p>
          <a href="/varsity" className="inline-block text-blue-600 text-xl font-medium hover:text-gray-600">
            Explore Varsity &rarr;
          </a>
          <p className="text-gray-500">
            TradingQ&A, the most active trading and investment community in India 
            for all your market related queries.
          </p>
          <a href="/varsity" className="inline-block text-blue-600 text-xl font-medium hover:text-gray-600">
              TradingQ&amp;A&rarr;
          </a>
        </div>
      </div>

      <div className='flex flex-col items-center justify-center text-center mt-10 mb-10 py-6 px-4'>

        <p className='text-3xl text-gray-700 font-semibold mb-[38px]'>
          Open a Zerodha account
        </p>

        <p className='text-xl text-gray-500 mb-[38px]'>
          Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.
        </p>

        <button className='bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition'>
          Sign Up for free
        </button>

      </div>

    </div>

  )
}

export default Home
