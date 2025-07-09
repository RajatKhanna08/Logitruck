import React from 'react';
import { FaFacebookF, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Scroll to top handler
  const handleScrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full relative bg-gradient-to-r from-[#0a1633] via-[#1a2347] via-60% to-[#f7c873] overflow-hidden">
      {/* Background image overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/footerBackground.gif"
          alt="footer background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1633]/90 via-[#1a2347]/80 via-60% to-[#f7c873]/70" />
      </div>
      {/* Content */}
      <div className="relative z-10 flex flex-col px-8 md:px-16 py-12 min-h-[350px]">
        {/* Logo at the top */}
        <div className="flex justify-start mb-6">
          <a
            href="#top"
            onClick={handleScrollTop}
            className="flex items-center gap-3 group"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            <img
              src="/LogiTruckLogoWhite.png"
              alt="LogiTruck Logo"
              className="w-72  object-contain drop-shadow-lg"
              draggable="false"
            />
          </a>
        </div>
        {/* Headings Row */}
        <div className="flex flex-row justify-between items-center w-full mb-6">
          <div className="flex-1 min-w-[220px] flex items-center">
            <span className="font-bold text-3xl text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Contact Us
            </span>
          </div>
          <div className="flex-1 min-w-[220px] flex items-center justify-center">
            <span className="font-bold text-3xl text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Services
            </span>
          </div>
          <div className="flex-1 min-w-[220px] flex items-center justify-end">
            <span className="font-bold text-3xl text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Follow Us
            </span>
          </div>
        </div>
        {/* Main Content Row */}
        <div className="flex flex-row justify-between items-start w-full">
          {/* Left: Contact */}
          <div className="flex-1 min-w-[220px]">
            <div className="text-lg mb-1 text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Corporate Contacts</div>
            <div className="text-lg mb-1 text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Customer Support</div>
            <div className="text-lg mb-0.5 text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>8130-038-836</div>
            <div className="text-lg text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>9958-760-011</div>
          </div>
          {/* Center: Services */}
          <div className="flex-2 min-w-[260px] flex flex-wrap flex-col items-center">
            <ul className="list-none pl-6 text-lg space-y-1.5 text-left max-w-[260px] text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <li className="group relative">
                  <Link to="/multi-stop-delivery" className="relative inline-block transition-colors duration-200 hover:text-white">
                    Multi Stop Delivery
                    <span className="block absolute left-0 -bottom-1 h-0.5 bg-white transition-all duration-300 w-0 group-hover:w-full"></span>
                  </Link>
                </li>
                <li className="group relative">
                  <Link to="/real-time-tracking" className="relative inline-block transition-colors duration-200 hover:text-white">
                    Real time Tracking
                    <span className="block absolute left-0 -bottom-1 h-0.5 bg-white transition-all duration-300 w-0 group-hover:w-full"></span>
                  </Link>
                </li>
                <li className="group relative">
                  <Link to="/bidding" className="relative inline-block transition-colors duration-200 hover:text-white">
                    Bidding
                    <span className="block absolute left-0 -bottom-1 h-0.5 bg-white transition-all duration-300 w-0 group-hover:w-full"></span>
                  </Link>
                </li>
                <li className="mr-6 group relative">
                  <Link to="/ai-price-estimator" className="relative inline-block transition-colors duration-200 hover:text-white">
                    AI Price Estimator
                    <span className="block absolute left-0 -bottom-1 h-0.5 bg-white transition-all duration-300 w-0 group-hover:w-full"></span>
                  </Link>
                </li>
                <li className="group relative">
                  <Link to="/ai-truck-recommendation" className="relative inline-block transition-colors duration-200 hover:text-white">
                    AI Truck Recommendation
                    <span className="block absolute left-0 -bottom-1 h-0.5 bg-white transition-all duration-300 w-0 group-hover:w-full"></span>
                  </Link>
                </li>
            </ul>
          </div>
          {/* Right: Social & Truck */}
          <div className="flex-1 min-w-[220px] flex flex-col items-end relative">
            <div className="flex gap-6 mb-10 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#1877f2] transition-colors rounded-full p-2 shadow-lg">
                <FaFacebookF className="text-2xl text-white" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="bg-white/10 hover:bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 transition-colors rounded-full p-2 shadow-lg">
                <FaInstagram className="text-2xl text-white" />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer"
                className="bg-white/10 hover:bg-black transition-colors rounded-full p-2 shadow-lg">
                <FaXTwitter className="text-2xl text-white" />
              </a>
            </div>
            {/* Truck image */}
            <img
              src="/truckForFooter.png"
              alt="truck"
              className="absolute right-0 bottom-[-120px] w-[170px] drop-shadow-2xl select-none pointer-events-none"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
