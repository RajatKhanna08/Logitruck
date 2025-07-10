import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { imageSlides, services } from '../constants/HomePageConstants.js';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imageSlides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

    return (
        <div className='relative overflow-x-hidden'>
            {/* FIRST SECTION */}
            <div className='relative w-screen h-screen'>
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
                                <p className="w-[65%] text-yellow-300 text-8xl font-bold leading-[1.2]">
                                    {slide.text}
                                </p>
                                <p className="w-[60%] text-white text-4xl font-medium leading-snug">
                                    {slide.subtext}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

            </div>

            {/* SEPERATOR */}
            <img src="/firstScreenSeperator.jpg" className='w-full h-10 object-cover' />

            {/* SERVICES SECTION */}
            <div className='relative w-full h-[80%]'>
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
                <div className="z-10 w-full py-16 px-6 bg-gray-100">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {services.map((service, index) => (
                                <Link
                                    key={index}
                                    to={"/services"}
                                    className="z-10 bg-white p-5 rounded-2xl shadow-md hover:shadow-yellow-300 transition-shadow duration-300"
                                >
                                    <img
                                      src={service.image}
                                      alt={service.title}
                                      className="w-full h-50 mb-6 object-cover rounded-xl"
                                    />
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                                      {service.title}
                                    </h3>
                                    <p className="text-gray-600 text-base leading-relaxed">
                                      {service.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
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
