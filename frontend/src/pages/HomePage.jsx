import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GiCheckMark } from "react-icons/gi";

import Footer from '../components/Footer';
import { imageSlides, liveTrackingFaq, services, testimonials } from '../constants/HomePageConstants.js';
import ServiceCard from '../components/ServiceCard.jsx';
import LiveTrackingFAQCard from '../components/LiveTrackingFAQCard.jsx';
import TestimonialCard from '../components/TestimonialCard.jsx';

const HomePage = () => {
    //first screen
    const [currentSlide, setCurrentSlide] = useState(0);
    useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imageSlides.length);
    }, 5000);
    return () => clearInterval(interval);
    }, []);

  //Live Tracking Section
  const [openIndex, setOpenIndex] = useState(null);
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

    return (
        <div className='relative overflow-x-hidden'>
            {/* FIRST SECTION */}
            <div className='relative w-screen h-screen'>
                {/* PROGRESS BAR */}
                <div className="absolute z-50 top-35 left-0 w-full h-1 bg-white/20 overflow-hidden">
                    <div
                        key={currentSlide} // triggers animation on change
                        className="h-full bg-yellow-300 animate-progress"
                        style={{ animationDuration: '5000ms' }} // same as your slide interval
                    />
                </div>
                {imageSlides.map((slide, index) => (
                    <div key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                    >
                        <img
                            src={slide.image}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute left-0 inset-0 bg-black/50 flex items-center justify-start pl-15">
                            <div className="space-y-5">
                                <p className="w-[65%] text-yellow-300 text-7xl font-bold leading-[1.2]">
                                    {slide.text}
                                </p>
                                <p className="w-[60%] text-white text-3xl font-medium leading-snug">
                                    {slide.subtext}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

            </div>

            {/* SERVICES SECTION */}
            <div className='mt-25 relative w-full h-[80%]'>
                <div className='z-1 absolute top-0 bg-yellow-300 w-full h-[40%]' />

                {/* HEADING */}
                <div className='pt-20 relative z-10 flex justify-center items-center h-full gap-10 text-[#192a67]'>
                    <div className='font-bold text-right'>
                        <p className='text-3xl'>All our Services</p>
                        <p className='text-5xl z-10'>Services We Offer</p>
                    </div>

                    <span className='absolute z-10 w-3 right-204 top-21 h-22 bg-black/60 rounded-full' />

                    <div className='font-semibold w-130'>
                        We offer smart, easy truck booking with AI-powered recommendations and real-time tracking. Book in seconds using voice (Hindi or English), compare rates, and secure your goods with insurance. Fast, reliable, and transparent freight services—all in one platform.
                    </div>
                </div>

                {/* CARDS */}
                <div className="z-10 w-full py-16 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {services.map((service, index) => (
                                <ServiceCard service={service} key={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ABOUT US SECTION */}
            <div className='mt-10 flex justify-center gap-10'>
                {/* LEFT SECTION */}
                <div className='flex flex-col gap-18'>
                    <p className='text-7xl text-[#192a67] font-bold'>
                        Fast{" "}
                        <span className='text-yellow-300'>Booking,</span> <br />
                        Safe{" "}
                        <span className='text-yellow-300'>Delivery,</span> <br />
                        Always{" "}
                        <span className='text-yellow-300'>Reliable,</span>
                    </p>

                    <p className='text-2xl w-150 font-semibold'>Our mission is to revolutionize freight logistics in India by offering a smart, transparent, and user-friendly truck booking experience. We aim to empower vendors and transporters through AI-driven solutions, real-time tracking, and secure transport, ensuring every shipment is reliable, affordable, and stress-free.</p>

                    <Link to={"/about"} className='px-4 py-3 rounded-xl font-semibold bg-[#192a67] text-white w-50 text-2xl'>More About Us</Link>
                </div>

                {/* RIGHT SECTION */}
                <div className='flex flex-col'>
                    <div className='flex gap-5'>
                        <img src="/homeAboutUsTruck.png" className='w-65' />
                        <img src="/homeAboutBoxes.png" className='w-45' />
                    </div>

                    <div>
                        <img src="/homeAboutContainers.webp" className='w-120 object-cover h-110' />
                    </div>
                </div>
            </div>

            {/* SENDER SHIPPER SECTION */}
            <div
                className="mt-20 p-20 w-full h-[80%] bg-cover bg-center bg-no-repeat relative"
                style={{ backgroundImage: `url('/homeSenderShipper.webp')` }}
            >
                <div className="absolute inset-0 bg-black/50 z-0" />

              <div className="relative z-10 flex items-center justify-center gap-70 h-full">
                {/* LEFT SECTION */}
                <div className='flex flex-col gap-10 text-white'>
                    <p className='text-2xl font-bold'>Here are a few places to explore shipping.</p>

                    <p className='text-2xl font-semibold text-center'>ARE YOU A SENDER?</p>

                    <ul className='text-xl flex flex-col gap-7 font-medium'>
                        <li className='flex gap-2 items-center hover:text-yellow-300 transition-all duration-200 select-none cursor-pointer'><GiCheckMark /> Regular Truck Booking</li>
                        <li className='flex gap-2 items-center hover:text-yellow-300 transition-all duration-200 select-none cursor-pointer'><GiCheckMark /> Full Logistics Support</li>
                        <li className='flex gap-2 items-center hover:text-yellow-300 transition-all duration-200 select-none cursor-pointer'><GiCheckMark /> Smart Shipping (AI Helped)</li>
                        <li className='flex gap-2 items-center hover:text-yellow-300 transition-all duration-200 select-none cursor-pointer'><GiCheckMark /> Quick One-Time Booking</li>
                        <li className='flex gap-2 items-center hover:text-yellow-300 transition-all duration-200 select-none cursor-pointer'><GiCheckMark /> Rural & Remote Area Shipping</li>
                        <li className='mt-7 text-center'><Link to={"/company/register"} className='bg-white text-black px-6 py-4 rounded-2xl font-bold hover:bg-gray-300 transition-all duration-500'>Read More</Link></li>
                    </ul>
                </div>

                {/* SEPERATOR */}
                <span className=' absolute bg-yellow-300/60 rounded-sm w-139 h-4 -rotate-90' />

                {/* RIGHT SECTION */}
                <div className='flex flex-col gap-10 text-white'>
                    <p className='text-2xl font-bold'>Things need to know about shipping</p>

                    <p className='text-2xl font-semibold text-center'>ARE YOU A SHIPPER?</p>

                    <ul className='text-xl flex flex-col gap-7 font-medium'>
                        <li className='flex gap-2 items-center hover:text-yellow-300 transition-all duration-200 select-none cursor-pointer'>
                            <GiCheckMark /> Post Regular Trips
                        </li>
                        <li className='flex gap-2 items-center hover:text-yellow-300 transition-all duration-200 select-none cursor-pointer'>
                            <GiCheckMark /> Offer Full Logistics Support
                        </li>
                        <li className='flex gap-2 items-center hover:text-yellow-300 transition-all duration-200 select-none cursor-pointer'>
                            <GiCheckMark /> Get AI Route Suggestions
                        </li>
                        <li className='flex gap-2 items-center hover:text-yellow-300 transition-all duration-200 select-none cursor-pointer'>
                            <GiCheckMark /> Accept One-Time Loads
                        </li>
                        <li className='flex gap-2 items-center hover:text-yellow-300 transition-all duration-200 select-none cursor-pointer'>
                            <GiCheckMark /> Target Remote Areas
                        </li>
                        <li className='mt-7 text-center'><Link to={"/transporter/register"} className='bg-white text-black px-6 py-4 rounded-2xl font-bold hover:bg-gray-300 transition-all duration-500'>Read More</Link></li>
                    </ul>
                </div>
              </div>
            </div>

            {/* TRACKING SECTION */}
            <div className='mt-15 flex justify-center gap-23'>
                {/* LEFT SECTION */}
                <div className='flex flex-col gap-5 p-16 rounded-md bg-[#192a67] text-white'>
                    <p className='text-6xl font-semibold'>Real Time Tracking</p>

                    <div>
                        <form className='flex justify-between gap-5'>
                            <input type="text" className='bg-white text-black text-2xl rounded-md py-2 pl-3 pr-27 font-semibold' placeholder='Enter Order Id' />
                            <button type='submit' className='px-5 py-2 text-black bg-white rounded-md font-bold'>Track</button>
                        </form>
                    </div>

                    <p className='w-90'>Enter the ID of Your Project To track it’s status(Demo Projects IDs are 1234, 5482 and 5422.</p>

                    <p name="" id="" className='bg-white text-black/40 rounded-md p-5 h-60'>Thank you </p>
                </div>

                {/* RIGHT SECTION */}
                <div className='flex flex-col'>
                    <p className='text-4xl font-bold text-[#192a67]'>Get  the best logistic service FAQ</p>

                    {/* ACCORDION */}
                    <div className='mt-20 flex flex-col gap-10 relative'>
                        {liveTrackingFaq.map((faq, index) => (
                            <div key={index} className="relative border border-gray-300 rounded-md overflow-visible shadow-sm">
                                <LiveTrackingFAQCard
                                    faq={faq}
                                    index={index}
                                    openIndex={openIndex}
                                    toggleAccordion={toggleAccordion}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* TESTIMONIAL SECTION */}
            <div className='mt-15 flex flex-col items-center relative'>
                <p className='text-5xl font-semibold text-[#192a67]'>Our Testimonials</p>

                <span className='absolute top-40 z-10 w-250 h-130 bg-[#192a67]' />

                <div className='z-50 flex flex-col'>
                    <div className='flex gap-180'>
                        <img src="/homeTestimonialTruckBlue.png" className='w-50' />
                        <img src="/homeTestimonialTruckBlue.png" className='w-50 scale-x-[-1]' />
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full'>
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard
                                key={index}
                                username={testimonial.username}
                                profileImg={testimonial.profileImg}
                                reviewText={testimonial.reviewText}
                                rating={testimonial.rating}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div>
                <Footer />
            </div>
        </div>
  )
}

export default HomePage
