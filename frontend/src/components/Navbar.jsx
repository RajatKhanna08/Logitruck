import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { FaGlobe, FaPhone, FaClipboardList, FaUser } from 'react-icons/fa6';
import { IoMail, IoNotifications } from 'react-icons/io5';
import { FiLogOut, FiMenu, FiPackage } from 'react-icons/fi';
import { RiDashboardFill } from "react-icons/ri";

import { servicesData } from '../constants/ServicePageConstants';
import { useUserProfile } from '../hooks/useUserProfile';
import { logoutCompany } from '../api/companyApi';
import { logoutTransporter } from '../api/transporterApi';
import { logoutDriver } from '../api/driverApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../store/useUserStore';

const Navbar = () => {
    const { data: userProfile, isLoading } = useUserProfile();
    console.log(userProfile);
    const role = userProfile?.role;
    const isLoggedIn = !!userProfile && !!role;

    const queryClient = useQueryClient();
    const setUser = useUserStore((state) => state.setUser);

    const location = useLocation();
    const navigate = useNavigate();
    const { pathname } = location;

    //show/hide navbar
    const [showNavbar, setShowNavbar] = useState(true);
    let lastScrollY = window.scrollY;
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setShowNavbar(!(currentScrollY > lastScrollY && currentScrollY > 50));
            lastScrollY = currentScrollY;
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const logoutMutations = {
        company: useMutation({ mutationFn: logoutCompany }),
        transporter: useMutation({ mutationFn: logoutTransporter }),
        driver: useMutation({ mutationFn: logoutDriver }),
    };

    const handleLogout = async () => {
        try {
            if (role && logoutMutations[role]) {
                await logoutMutations[role].mutateAsync();
            }
            setUser(null);
            queryClient.invalidateQueries(['userProfile']);
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err.message);
            alert('Logout failed. Please try again.');
        }
    };

    //profile image dropdown
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    //menu bar hamburger
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const hamburgerRef = useRef(null);
    const toggleHamburger = () => setIsHamburgerOpen(!isHamburgerOpen);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (hamburgerRef.current && !hamburgerRef.current.contains(e.target)) {
                setIsHamburgerOpen(false);
            }
        };
        if (isHamburgerOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isHamburgerOpen]);

    if (isLoading) return null;

    return (
        <div className='relative w-full h-full'>
            <nav className={`fixed px-8 pt-3 top-0 w-full h-${isLoggedIn ? "24" : "35"} z-[100] transition-transform duration-500 ${!isLoggedIn && !showNavbar ? '-translate-y-18' : 'translate-y-0'} bg-black/70 backdrop-blur-sm`}>
                {/* UPPER SECTION */}
                <div className={`flex items-center h-${isLoggedIn ? "18" : "28"} justify-between`}>

                {/* Left - Hamburger + Logo */}
                <div className="flex items-center gap-4">
                    {isLoggedIn && (
                        <button onClick={toggleHamburger} className="text-white cursor-pointer hover:text-yellow-300 focus:outline-none">
                            <FiMenu size={28} />
                        </button>
                    )}

                    <Link to={"/"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        <img src="/LogiTruckLogoWhite.png" alt="Logi Truck Logo" className={`w-${showNavbar ? 32 : 2} sm:w-60`} />
                    </Link>
                </div>

                {/* Right - Auth or User Options */}
                <ul className={`list-none text-white flex gap-4 text-lg font-medium select-none text-right ${isLoggedIn ? "h-11 items-center" : "ml-160"}`}>

                    {/* UPPER SECTION WHEN NO ONE IS LOGGED IN */}
                    {!isLoggedIn &&
                        <>
                            <li className='flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition-all duration-200'><FaPhone /> +91 9810508819</li>
                            <li className='flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition-all duration-200'><IoMail />support@logitruck.org.in</li>
                            <li className='flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition-all duration-200'><FaGlobe size={25} /></li>
                            <li className='flex items-center bg-white hover:bg-gray-200 text-black px-4 h-10 mt-1 text-[15px] font-bold rounded-xl cursor-pointer transition-all duration-200'>
                                <Link to="/role-select">Join Us</Link>
                            </li>
                        </>
                    }
                    {/* UPPER SECTION FOR COMPANY WHEN LOGGED IN */}
                    { isLoggedIn && role === "company" &&
                        <div className="flex items-center gap-8 relative">
                            <li className="flex items-center gap-2 cursor-pointer text-black bg-yellow-300 p-2 rounded-md font-bold hover:bg-yellow-400 transition-all duration-200">
                                <FaClipboardList />
                                <Link to={`/price-estimator`}>AI PRICE ESTIMATOR</Link>
                            </li>
                            <li className="flex items-center gap-2 cursor-pointer text-black bg-yellow-300 p-2 rounded-md font-bold hover:bg-yellow-400 transition-all duration-200">
                                <FaClipboardList />
                                <Link to={`/orders/book`}>Book Order</Link>
                            </li>
                            <div className="relative" ref={dropdownRef}>
                                <img
                                    src={userProfile.role === "company" ? userProfile.company.profileImg : userProfile.transporter.profileImg}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full bg-white object-cover border-2 border-yellow-300 cursor-pointer"
                                    onClick={toggleDropdown}
                                />
                                {showDropdown && (
                                    <ul className="absolute top-12 right-0 w-48 bg-gray-200 shadow-lg rounded-md text-black text-sm z-50">
                                        <li onClick={() => setShowDropdown(!showDropdown)} className="px-4 py-2 hover:bg-yellow-400 hover:rounded-md flex items-center gap-2">
                                            <FaUser />
                                            <Link to={`/${role}/profile`}>Profile</Link>
                                        </li>
                                        <li onClick={() => setShowDropdown(!showDropdown)} className="px-4 py-2 hover:bg-yellow-400 hover:rounded-md flex items-center gap-2">
                                            <RiDashboardFill />
                                            <Link to={`/company/dashboard`}>Dashboard</Link>
                                        </li>
                                        <li onClick={() => setShowDropdown(!showDropdown)} className="px-4 py-2 hover:bg-yellow-400 hover:rounded-md flex items-center gap-2">
                                            <FiPackage />
                                            <Link to={`/orders/all`}>View Orders</Link>
                                        </li>
                                        <li onClick={() => setShowDropdown(!showDropdown)} className="px-4 py-2 hover:bg-yellow-400 hover:rounded-md flex items-center gap-2">
                                            <IoNotifications />
                                            <Link to={`/notifications`}>Notifications</Link>
                                        </li>
                                        <li
                                            className="px-4 py-2 text-red-500 hover:bg-red-100 hover:rounded-md flex items-center gap-2 cursor-pointer"
                                            onClick={handleLogout}
                                        >
                                            <FiLogOut />
                                            Logout
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    }

                    {/* UPPER SECTION WHEN TRANSPORTER IS LOGGED IN */}
                    { isLoggedIn && role === "transporter" &&
                        <div className="flex items-center gap-8 relative">
                            <li className="flex items-center gap-2 cursor-pointer text-black bg-yellow-300 p-2 rounded-md font-bold hover:bg-yellow-400 transition-all duration-200">
                                <FaClipboardList />
                                <Link to={`/bids`}>View Bids</Link>
                            </li>
                            <li className="flex items-center gap-2 cursor-pointer text-black bg-yellow-300 p-2 rounded-md font-bold hover:bg-yellow-400 transition-all duration-200">
                                <FaClipboardList />
                                <Link to={`/transporter/dashboard`}>Dashboard</Link>
                            </li>
                            <div className="relative" ref={dropdownRef}>
                                <img
                                    src={userProfile.transporter.profileImg}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full bg-white object-cover border-2 border-yellow-300 cursor-pointer"
                                    onClick={toggleDropdown}
                                />
                                {showDropdown && (
                                    <ul className="absolute top-12 right-0 w-48 bg-gray-200 shadow-lg rounded-md text-black text-sm z-50">
                                        <li onClick={() => setShowDropdown(!showDropdown)} className="px-4 py-2 hover:bg-yellow-400 hover:rounded-md flex items-center gap-2">
                                            <FaUser />
                                            <Link to={`/${role}/profile`}>Profile</Link>
                                        </li>
                                        <li onClick={() => setShowDropdown(!showDropdown)} className="px-4 py-2 hover:bg-yellow-400 hover:rounded-md flex items-center gap-2">
                                            <RiDashboardFill />
                                            <Link to={`/${role}/dashboard`}>Dashboard</Link>
                                        </li>
                                        <li onClick={() => setShowDropdown(!showDropdown)} className="px-4 py-2 hover:bg-yellow-400 hover:rounded-md flex items-center gap-2">
                                            <FiPackage />
                                            <Link to={`/transporter/view-trucks`}>My Trucks</Link>
                                        </li>
                                        <li onClick={() => setShowDropdown(!showDropdown)} className="px-4 py-2 hover:bg-yellow-400 hover:rounded-md flex items-center gap-2">
                                            <IoNotifications />
                                            <Link to={`/notifications`}>Notifications</Link>
                                        </li>
                                        <li
                                            className="px-4 py-2 text-red-500 hover:bg-red-100 hover:rounded-md flex items-center gap-2 cursor-pointer"
                                            onClick={handleLogout}
                                        >
                                            <FiLogOut />
                                            Logout
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    }

                    {/* UPPER SECTION WHEN DRIVER IS LOGGED IN */}
                    { isLoggedIn && role === "driver" &&
                        <div className="flex items-center gap-8 relative">
                            <li className="flex items-center gap-2 cursor-pointer text-black bg-yellow-300 p-2 rounded-md font-bold hover:bg-yellow-400 transition-all duration-200">
                                <FaClipboardList />
                                <Link to={`/driver/bookings`}>View Bookings</Link>
                            </li>
                            <li className="flex items-center gap-2 cursor-pointer text-black bg-yellow-300 p-2 rounded-md font-bold hover:bg-yellow-400 transition-all duration-200">
                                <FaClipboardList />
                                <Link to={`/${role}/dashboard`}>Dashboard</Link>
                            </li>
                            <div className="relative" ref={dropdownRef}>
                                <img
                                    src={userProfile.driver.profileImg}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full bg-white object-cover border-2 border-yellow-300 cursor-pointer"
                                    onClick={toggleDropdown}
                                />
                                {showDropdown && (
                                    <ul className="absolute top-12 right-0 w-48 bg-gray-200 shadow-lg rounded-md text-black text-sm z-50">
                                        <li onClick={() => setShowDropdown(!showDropdown)} className="px-4 py-2 hover:bg-yellow-400 hover:rounded-md flex items-center gap-2">
                                            <FaUser />
                                            <Link to={`/${role}/profile`}>Profile</Link>
                                        </li>
                                        <li onClick={() => setShowDropdown(!showDropdown)} className="px-4 py-2 hover:bg-yellow-400 hover:rounded-md flex items-center gap-2">
                                            <RiDashboardFill />
                                            <Link to={`/${role}/dashboard`}>Dashboard</Link>
                                        </li>
                                        <li onClick={() => setShowDropdown(!showDropdown)} className="px-4 py-2 hover:bg-yellow-400 hover:rounded-md flex items-center gap-2">
                                            <FiPackage />
                                            <Link to={`/driver/bookings`}>View Bookings</Link>
                                        </li>
                                        <li onClick={() => setShowDropdown(!showDropdown)} className="px-4 py-2 hover:bg-yellow-400 hover:rounded-md flex items-center gap-2">
                                            <IoNotifications />
                                            <Link to={`/notifications`}>Notifications</Link>
                                        </li>
                                        <li
                                            className="px-4 py-2 text-red-500 hover:bg-red-100 hover:rounded-md flex items-center gap-2 cursor-pointer"
                                            onClick={handleLogout}
                                        >
                                            <FiLogOut />
                                            Logout
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    }
                </ul>
                </div>

                {/* Separator */}
                <span className={`absolute bottom-14 ${isLoggedIn ? "opacity-0" : "opacity-100"} left-7 w-[96%] h-[1px] bg-yellow-300/40`} />

                {/* LOWER SECTION (Shown only if NOT logged in) */}
                {!isLoggedIn && (
                    <ul className='flex py-4 pl-4 items-center text-shadow justify-end gap-10 text-white text-lg font-medium'>
                        <li className="relative group cursor-pointer transition-all duration-200">
                            <Link to="/" onClick={() => window.scroll({ top: 0, behavior: "smooth" })}
                                className={`${pathname === '/' ? 'text-yellow-300' : 'hover:text-yellow-300'}`}>
                                Home
                                <span className={`absolute left-0 bottom-0 h-[2px] bg-yellow-300 transition-all duration-300 ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </Link>
                        </li>
                        <li className="relative group cursor-pointer transition-all duration-200">
                            <Link to="/about" className={`${pathname === '/about' ? 'text-yellow-300' : 'hover:text-yellow-300'}`}>
                                About Us
                                <span className={`absolute left-0 bottom-0 h-[2px] bg-yellow-300 transition-all duration-300 ${pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </Link>
                        </li>
                        <li className="relative group cursor-pointer transition-all duration-200">
                            <div className="group relative">
                                <Link to="/services/multi-stop-delivery"
                                    className={`${pathname.startsWith('/services') ? 'text-yellow-300' : 'hover:text-yellow-300'}`}>
                                    Services
                                    <span className={`absolute left-0 bottom-0 h-[2px] bg-yellow-300 transition-all duration-300 ${pathname.startsWith('/services') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                </Link>
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
                            <Link to="/help-centre"
                                className={`${pathname === '/help-centre' ? 'text-yellow-300' : 'hover:text-yellow-300'}`}>
                                Help Centre
                                <span className={`absolute left-0 bottom-0 h-[2px] bg-yellow-300 transition-all duration-300 ${pathname === '/help-centre' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </Link>
                        </li>
                        <li className="relative group cursor-pointer transition-all duration-200">
                            <Link to="/community"
                                className={`${pathname === '/community' ? 'text-yellow-300' : 'hover:text-yellow-300'}`}>
                                Community Centre
                                <span className={`absolute left-0 bottom-0 h-[2px] bg-yellow-300 transition-all duration-300 ${pathname === '/community' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </Link>
                        </li>
                        <li className="relative group cursor-pointer transition-all duration-200">
                            <Link to="/contact"
                                className={`${pathname === '/contact' ? 'text-yellow-300' : 'hover:text-yellow-300'}`}>
                                Contact Us
                                <span className={`absolute left-0 bottom-0 h-[2px] bg-yellow-300 transition-all duration-300 ${pathname === '/contact' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </Link>
                        </li>
                    </ul>
                )}
            </nav>

            {/* Hamburger Side Drawer */}
                {isLoggedIn && (
                    <>
                        {/* Side Panel */}
                        <div
                            ref={hamburgerRef}
                            className={`fixed top-25 rounded-r z-100 left-0 h-20 w-270 bg-black/70 backdrop-blur-sm shadow-lg transform transition-transform duration-300 ease-in-out
                            ${isHamburgerOpen ? 'translate-x-0' : '-translate-x-full'}`}
                        >
                            <ul className="flex justify-center items-center h-full w-full px-12 text-white text-lg font-medium">
                                <li className='w-40 hover:text-yellow-300 transition-all duration-300 cursor-pointer'><Link to="/" onClick={() => setIsHamburgerOpen(false)}>Home</Link></li>
                                <li className='w-40 hover:text-yellow-300 transition-all duration-300 cursor-pointer'><Link to="/about" onClick={() => setIsHamburgerOpen(false)}>About Us</Link></li>
                                <li className='w-40 hover:text-yellow-300 transition-all duration-300 cursor-pointer'><Link to="/services/multi-stop-delivery" onClick={() => setIsHamburgerOpen(false)}>Services</Link></li>
                                <li className='w-40 hover:text-yellow-300 transition-all duration-300 cursor-pointer'><Link to="/help-centre" onClick={() => setIsHamburgerOpen(false)}>Help Centre</Link></li>
                                <li className='w-40 hover:text-yellow-300 transition-all duration-300 cursor-pointer'><Link to="/contact" onClick={() => setIsHamburgerOpen(false)}>Contact Us</Link></li>
                                <li className='w-40 hover:text-yellow-300 transition-all duration-300 cursor-pointer'><Link to="/community" onClick={() => setIsHamburgerOpen(false)}>Community Centre</Link></li>
                            </ul>
                        </div>
                    </>
                )}
        </div>
    );
};

export default Navbar;