import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import { FaGlobe, FaPhone } from 'react-icons/fa6';
import { HiMicrophone } from "react-icons/hi2";
import { IoMail } from 'react-icons/io5';
import { servicesData } from '../constants/ServicePageConstants';

const Navbar = () => {
    const [showNavbar, setShowNavbar] = useState(true);
    let lastScrollY = window.scrollY;

    useEffect(() => {
        const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            setShowNavbar(false);
        }
        else{
            setShowNavbar(true);
        }

        lastScrollY = currentScrollY;
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed px-8 pt-3 top-0 w-full h-35 z-[100] transition-transform duration-500 ${showNavbar ? 'translate-y-0' : '-translate-y-18'} bg-black/70 backdrop-blur-sm`}>
            {/* UPPER SECTION */}
            <div className='flex'>
                <div className={`absolute left-8 transition-all duration-500 ${showNavbar ? 'top-3' : 'top-20'}`}>
                    <Link to={"/"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        <img src="/LogiTruckLogoWhite.png" alt="Logi Truck Logo" className={`w-${showNavbar ? 32 : 2} sm:w-60`} />
                    </Link>
                </div>

                {/* Navigation Buttons */}
                <ul className='list-none text-white flex gap-5 text-lg font-medium select-none text-right ml-220'>
                    <li className='flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition-all duration-200'><FaPhone /> +91 1234567890</li>
                    <li className='flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition-all duration-200'><IoMail /> logitruck@gmail.com</li>
                    <li className='flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition-all duration-200'><FaGlobe size={25} /></li>
                    <li className='flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition-all duration-200'><HiMicrophone size={25} /></li>
                    <li className='flex items-center bg-white hover:bg-gray-200 text-black px-4 h-10 mt-1 text-[15px] font-bold rounded-xl cursor-pointer transition-all duration-200'>
                        <Link to={"/company/register"}>Join Us</Link>
                    </li>
                </ul>
            </div>

            {/* Seperator */}
            <span className="absolute bottom-17 left-7 w-[96%] h-[1px] bg-yellow-300/40" />

            {/* LOWER SECTION */}
            <ul className='flex mt-9  items-center text-shadow justify-end gap-10 text-white text-lg font-medium'>
                <li className="relative group cursor-pointer transition-all duration-200">
                    <Link to="/" onClick={() => window.scroll({ top: 0, behavior: "smooth" })} className="hover:text-yellow-300">
                        Home
                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </li>
                <li className="relative group cursor-pointer transition-all duration-200">
                    <Link to="/about" className="hover:text-yellow-300">
                        About Us
                        <span className="absolute left-0 -bottom-0 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </li>
                <li className="relative group cursor-pointer transition-all duration-200">
                    <div className="group relative">
                        <Link to="/services/multi-stop-delivery" className="hover:text-yellow-300">
                            Services
                            <span className="absolute left-0 -bottom-0 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                        </Link>

                        {/* Dropdown */}
                        <ul className="absolute bg-white top-full flex flex-col -right-20 w-[240px] shadow-lg rounded-md text-black opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 z-50 p-2">
                            {Object.entries(servicesData).map(([key, value]) => (
                                <li key={key}>
                                    <Link
                                      to={`/services/${value.key}`}
                                      className="block px-3 py-2 w-56 rounded-md hover:bg-[#192a67] hover:text-yellow-300 text-sm transition-all duration-200"
                                    >
                                        {value.buttons}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </li>
                <li className="relative group cursor-pointer transition-all duration-200">
                    <Link to="/help" className="hover:text-yellow-300">
                        Help Centre
                        <span className="absolute left-0 -bottom-0 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </li>
                <li className="relative group cursor-pointer transition-all duration-200">
                    <Link to="/community" className="hover:text-yellow-300">
                        Community Centre
                        <span className="absolute left-0 -bottom-0 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </li>
                <li className="relative group cursor-pointer transition-all duration-200">
                    <Link to="/contact" className="hover:text-yellow-300">
                        Contact Us
                        <span className="absolute left-0 -bottom-0 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </li>
            </ul>
        </nav>
  )
}

export default Navbar
