import React, { useEffect, useState } from 'react'
import { servicesData } from '../constants/ServicePageConstants';
import { Link, useParams } from 'react-router-dom';
import Footer from '../components/Footer';

const ServicePage = () => {
    const { id } = useParams();
    const [activeService, setActiveService] = useState(null);
    const [activeKey, setActiveKey] = useState(id);

    useEffect(() => {
        setActiveKey(id);
        const matchedService = servicesData.find(service => service.key === id);
        setActiveService(matchedService || null);
    }, [id]);
    console.log(activeService);

    return (
        <div>
            {/* UPPER IMAGE */}
            <div className='flex justify-center items-center w-full h-90 bg-cover bg-bottom-4 bg-no-repeat' style={{ backgroundImage: "url('/servicesBackground.jpeg')" }}>
                <p className='mt-15 text-yellow-300 font-bold text-5xl text-shadow-black text-shadow-sm'>{activeService?.heading}</p>
            </div>

            {/* MIDDLE SECTION */}
            <div className='px-10 flex justify-between w-full'>
                {/* LEFT SECTION */}
                <div className='flex flex-col gap-5 w-[60%] p-15'>
                    <p className='font-bold text-4xl text-[#192a67]'>{activeService?.title}</p>
                    <p className='text-2xl w-150 font-medium'>{activeService?.shortDescription}</p>
                    <p className='text-xl max-w-250 min-h-42'>{activeService?.fullDescription}</p>
                </div>

                {/* RIGHT SECTION */}
                <div className='mt-8 flex gap-10'>
                    {/* BUTTONS */}
                    <ul className='mt-5 flex flex-col gap-5 text-right'>
                        {
                            servicesData.map((service) => (
                                <li key={service.key}>
                                    <Link
                                        to={`/services/${service.key}`}
                                        className={`text-2xl select-none cursor-pointer font-semibold tracking-tighter transition-colors duration-300 ${
                                        activeKey === service.key ? "text-yellow-300" : "text-[#192a67] hover:text-yellow-300"}`}
                                    >
                                        {service.buttons}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>

                    {/* YELLOW LINE */}
                    <span className='bg-yellow-300 h-98 w-1 rounded-lg' />
                </div>
            </div>

            {/* LOWER SECTION */}
            <div className='mt-20 h-100 flex flex-col justify-center relative overflow-hidden'>
                {/* BACKGROUND IMAGE */}
                <div
                    className="absolute z-0 inset-0 bg-cover bg-left-bottom filter blur-sm w-full h-full"
                    style={{ backgroundImage: "url('/servicesLowerBackground.jpeg')" }}
                />

                {/* CONTENT */}
                <div className='z-10 flex justify-center gap-50'>
                    {/* LEFT CONTENT */}
                    <div className='flex items-center flex-col gap-5'>
                        <p className='text-4xl text-yellow-300 font-bold text-shadow-sm text-shadow-black'>HAVE ANY QUESTIONS ?</p>
                        <p className='text-2xl font-semibold text-shadow-sm text-white text-shadow-black'>Our Customer Support is up 24/7</p>
                        <Link to={"/contact"} className='bg-yellow-300 mt-3 px-6 py-3 text-xl text-[#192a67] font-bold rounded-4xl flex justify-center items-center'>Contact Now</Link>
                    </div>

                    {/* SEPERATOR */}
                    <span className='w-1 h-40 bg-yellow-300'/>

                    {/* RIGHT CONTENT */}
                    <div className='flex items-center flex-col gap-5'>
                        <p className='text-4xl text-yellow-300 font-bold text-shadow-sm text-shadow-black'>WANT A TRUCK ?</p>
                        <p className='text-2xl font-semibold text-shadow-sm text-white text-shadow-black'>Book Now (or) Ask a Quotation</p>
                        <Link to={"/contact"} className='bg-yellow-300 mt-3 px-6 py-3 text-xl text-[#192a67] font-bold rounded-4xl flex justify-center items-center'>Book Now</Link>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className='mt-30'>
                <Footer />
            </div>
        </div>
    )
}

export default ServicePage