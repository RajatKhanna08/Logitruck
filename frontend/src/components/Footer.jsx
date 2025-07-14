import axios from 'axios';
import React, { useState } from 'react';

import { FaCopyright, FaFacebookF, FaGlobe, FaGreaterThan, FaInstagram, FaPaperPlane, FaPhone, FaXTwitter } from 'react-icons/fa6';
import { IoMail } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
	const [email, setEmail] = useState("");
	const navigate = useNavigate();

	const handleFooterSubmit = (e) => {
		e.preventDefault();
		if(!email) return;

		navigate(`/company/register?email=${encodeURIComponent(email)}`);
	};

	return (
		<footer className="w-full h-[75vh] flex justify-center gap-5 p-18 relative bg-gradient-to-r from-[#0a1633] via-[#1a2347] via-60% to-[#f7c873] overflow-hidden">

			{/* Background image overlay */}
			<div className="absolute inset-0 z-0">
				<img
					src="/footerBackground.gif"
					alt="footer background"
					className="w-full h-full object-cover opacity-60"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-[#0a1633]/90 via-[#1a2347]/80 via-60% to-[#f7c873]/70" />
			</div>

			{/* LEFT SECTION */}
			<div className='flex flex-col mr-15 justify-start gap-4 w-[20%] h-[100%]'>
				{/* LOGO */}
				<Link className='z-10 w-64'>
					<img src="/LogiTruckLogoWhite.png" alt="LogiTruck Logo" />
				</Link>

				<div className='z-10 text-white w-xs'>32 Dora Creek, tuntable creek, New South Wales 2480, Australia</div>

				<ul className='z-10 text-white w-full mt-3 text-lg flex flex-col gap-2'>
					<li className='flex items-center justify-start gap-2'><FaPhone /> +91 1234567890</li>
					<li className='flex items-center justify-start gap-2'><IoMail /> logitruck@gmail.com</li>
					<li className='flex items-center justify-start gap-2'><FaGlobe /><a href='https://www.logitruck.org.in'> www.logitruck.org.in</a></li>
				</ul>

				<div className='z-10'>
					<div className="flex gap-6 mb-10 mt-2">
						<a href="https://facebook.com/harshitxrajput" target="_blank" rel="noopener noreferrer"
							className="bg-white/10 hover:bg-[#1877f2] transition-colors rounded-full p-2 shadow-lg duration-500">
							<FaFacebookF className="text-2xl text-white" />
						</a>
						<a href="https://instagram.com/harshitxrajput" target="_blank" rel="noopener noreferrer"
							className="bg-white/10 hover:bg-pink-500 transition-colors duration-500 rounded-full p-2 shadow-lg">
							<FaInstagram className="text-2xl text-white" />
						</a>
						<a href="https://x.com/harshitxrajput" target="_blank" rel="noopener noreferrer"
							className="bg-white/10 hover:bg-black transition-colors rounded-full p-2 shadow-lg duration-500">
							<FaXTwitter className="text-2xl text-white" />
						</a>
					</div>
				</div>
			</div>

			{/* MIDDLE SECTION */}
			<div className='z-10 flex justify-evenly items-start text-white w-[41%]'>
				{/* SERVICES */}
				<div className='flex flex-col'>
					{/* Heading */}
					<div className='relative ml-2 text-2xl font-bold mb-10'>
						Services
						<span className='absolute -bottom-5 left-0 inline-block w-15 h-1 bg-yellow-400 rounded-full' />
					</div>

					{/* Content */}
					<ul className='list-none text-lg flex flex-col justify-start gap-4 text-gray-300 w-[17vw]'>
						<Link to={"/"} className='flex gap-3 items-center hover:text-yellow-300 font-semibold transition-all duration-500'><MdOutlineKeyboardArrowRight className='size-7' />Multi-Stop Delivery</Link>
						<Link to={"/"} className='flex gap-3 items-center hover:text-yellow-300 font-semibold transition-all duration-500'><MdOutlineKeyboardArrowRight className='size-7' />Real-Time Tracking</Link>
						<Link to={"/"} className='flex gap-3 items-center hover:text-yellow-300 font-semibold transition-all duration-500'><MdOutlineKeyboardArrowRight className='size-7' />Bidding</Link>
						<Link to={"/"} className='flex gap-3 items-center hover:text-yellow-300 font-semibold transition-all duration-500'><MdOutlineKeyboardArrowRight className='size-7' />AI Price Estimator</Link>
						<Link to={"/"} className='flex gap-3 items-center hover:text-yellow-300 font-semibold transition-all duration-500'><MdOutlineKeyboardArrowRight className='size-7' />AI Truck Recommendation</Link>
					</ul>
				</div>

				{/* USEFUL LINKS */}
				<div className='flex items-start flex-col'>
					{/* HEADING */}
					<div className='relative ml-2 text-2xl font-bold mb-10'>
						Useful Links
						<span className='absolute -bottom-5 left-0 inline-block w-15 h-1 bg-yellow-400 rounded-full' />
					</div>

					{/* CONTENT */}
					<ul className='list-none text-lg flex flex-col gap-4 text-gray-300 w-[17vw]'>
						<Link to={"/"} className='flex gap-3 items-center hover:text-yellow-300 font-semibold transition-all duration-500'><MdOutlineKeyboardArrowRight className='size-7' />Home</Link>
						<Link to={"/about"} className='flex gap-3 items-center hover:text-yellow-300 font-semibold transition-all duration-500'><MdOutlineKeyboardArrowRight className='size-7' />About</Link>
						<Link to={"/services/multi-stop-delivery"} className='flex gap-3 items-center hover:text-yellow-300 font-semibold transition-all duration-500'><MdOutlineKeyboardArrowRight className='size-7' />Services</Link>
						<Link to={"/community"} className='flex gap-3 items-center hover:text-yellow-300 font-semibold transition-all duration-500'><MdOutlineKeyboardArrowRight className='size-7' />Community Centre</Link>
						<Link to={"/contact"} className='flex gap-3 items-center hover:text-yellow-300 font-semibold transition-all duration-500'><MdOutlineKeyboardArrowRight className='size-7' />Contact</Link>
					</ul>
				</div>
			</div>

			{/* RIGHT SECTION */}
			<div className='z-10 mr-10 flex items-start flex-col text-white'>
					{/* HEADING */}
					<div className='relative text-2xl font-bold mb-10'>
						Join Us
						<span className='absolute -bottom-5 left-0 inline-block w-15 h-1 bg-yellow-400 rounded-full' />
					</div>

					{/* CONTENT */}
					<ul className='list-none text-lg flex flex-col gap-4 text-white'>
						<li>Got what it takes to move the world?<br/> Join LogiTruck and let’s roll!</li>
						<li>
							<form onSubmit={handleFooterSubmit} className='flex flex-col gap-2'>
								<li><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your Email' className='bg-white text-black p-4 w-80 rounded-lg outline-none border-none' /></li>
								<li><button type='submit' className='bg-yellow-300 text-black p-3 rounded-lg px-8 font-bold flex items-center gap-2 cursor-pointer hover:bg-yellow-500 transition-all duration-500'><FaPaperPlane />Join now</button></li>
							</form>
						</li>
					</ul>
			</div>

			{/* Truck image */}
			<img src="/TruckImageForFooter.png"
					alt="truck"
					className="absolute z-10 right-35 bottom-40 w-[120px] drop-shadow-2xl select-none pointer-events-none animate-moveX"
					draggable="false"
			/>

			{/* SEPERATOR */}
			<span className="absolute bottom-25 left-35 w-[80%] h-[1px] bg-gray-600" />

			{/* Copyright */}
			<div className='z-10 absolute bottom-10 text-gray-300 flex items-center text-xl'>
				<p className='flex items-center gap-2'>Copyright <FaCopyright /> 2025 by <span className='text-yellow-300'>LogiTruck</span> | All rights reserved</p>
			</div>
		</footer>
	);
};

export default Footer;
