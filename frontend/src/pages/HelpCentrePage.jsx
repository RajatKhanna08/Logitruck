import { useState } from 'react'

import Footer from '../components/Footer';
import LiveTrackingFAQCard from '../components/home/LiveTrackingFAQCard'
import { generalFaqs, generalLowerFaqs, senderFaqs, shipperFaqs } from '../constants/HelpCentrePageConstants';

const HelpCentrePage = () => {
    const [openSender, setOpenSender] = useState(null);
    const [openShipper, setOpenShipper] = useState(null);
    const [openGeneral, setOpenGeneral] = useState(null);

    const [openLeftFAQ, setOpenLeftFAQ] = useState(null);
    const [openRightFAQ, setOpenRightFAQ] = useState(null);
    
    const toggleSender = (index) => {
    setOpenSender(openSender === index ? null : index);
    };

    const toggleShipper = (index) => {
        setOpenShipper(openShipper === index ? null : index);
    };

    const toggleGeneral = (index) => {
        setOpenGeneral(openGeneral === index ? null : index);
    };

    const toggleLeftFAQ = (index) => {
        setOpenLeftFAQ(openLeftFAQ === index ? null : index);
    }

    const toggleRightFAQ = (index) => {
        setOpenRightFAQ(openRightFAQ === index ? null : index);
    }

    return (
        <div className='w-full h-full'>
            {/* BACKGROUND IMAGE */}
            <div className="relative flex justify-center items-center w-full h-100 overflow-hidden">
                {/* Background Blur Layer */}
                <div
                    className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110 z-0"
                    style={{ backgroundImage: "url('/helpBackgroundImage.jpg')" }}
                />

                {/* Foreground Content */}
                <p className="text-6xl mt-20 text-shadow-black text-shadow-md text-yellow-300 font-bold tracking-wider relative z-10">
                    HELP CENTRE
                </p>
            </div>

            {/* MAIN TEXT */}
            <div className='w-full h-full py-15 px-40 text-xl font-medium'>
                Welcome to the LT Transports Help Centre—your one-stop destination for support, answers, and guidance. Whether you're a vendor, transporter, or driver, we're here to make your experience seamless.
            </div>

            {/* SENDER, SHIPPER, GENERAL */}
            <div className='flex max-h-200 justify-between items-center gap-20 px-40 mt-6'>
                {/* SENDER */}
                <div className='flex flex-col justify-start gap-6'>
                    <p className='text-4xl font-bold text-[#192a67]'>SENDER</p>
                                    
                    {/* Yellow Bar */}
                    <div className="w-24 h-1 bg-yellow-300 rounded-md"></div>
                                    
                    {/* ACCORDION */}
                    <div className='flex flex-col max-w-100 gap-2 mt-2'>
                        {senderFaqs.map((faq, index) => (
                            <div key={index} className="relative border border-gray-300 rounded-md shadow-sm">
                                <LiveTrackingFAQCard
                                    faq={faq}
                                    index={index}
                                    openIndex={openSender}
                                    toggleAccordion={toggleSender}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* SHIPPER */}
                <div className='flex flex-col justify-start gap-6'>
                    <p className='text-4xl font-bold text-[#192a67]'>SHIPPER</p>
                                    
                    {/* Yellow Bar */}
                    <div className="w-24 h-1 bg-yellow-300 rounded-md"></div>
                                    
                    {/* ACCORDION */}
                    <div className='flex flex-col max-w-100 gap-2 mt-2'>
                        {shipperFaqs.map((faq, index) => (
                            <div key={index} className="relative border border-gray-300 rounded-md shadow-sm">
                                <LiveTrackingFAQCard
                                    faq={faq}
                                    index={index}
                                    openIndex={openShipper}
                                    toggleAccordion={toggleShipper}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* GENERAL */}
                <div className='flex flex-col justify-start gap-6'>
                    <p className='text-4xl font-bold text-[#192a67]'>GENERAL</p>
                                    
                    {/* Yellow Bar */}
                    <div className="w-24 h-1 bg-yellow-300 rounded-md"></div>
                                    
                    {/* ACCORDION */}
                    <div className='flex flex-col max-w-100 gap-2 mt-2'>
                        {generalFaqs.map((faq, index) => (
                            <div key={index} className="relative border border-gray-300 rounded-md shadow-sm">
                                <LiveTrackingFAQCard
                                    faq={faq}
                                    index={index}
                                    openIndex={openGeneral}
                                    toggleAccordion={toggleGeneral}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ SECTION */}
            <div className='mt-20 mb-20 flex flex-col items-center gap-10'>
                {/* HEADING */}
                <p className='text-4xl font-bold text-[#192a67]'>FREQUENTLY ASKED QUESTIONS</p>
                                    
                {/* Yellow Bar */}
                <div className="w-24 h-1 text-center bg-yellow-300 rounded-md"></div>

                {/* ACOORDIONS */}
                <div className='flex px-30 gap-10'>
                    {/* LEFT ACCORDION */}
                    <div className='flex flex-col gap-2 mt-2'>
                        {generalLowerFaqs.slice(0, 5).map((faq, index) => (
                            <div key={index} className="relative border border-gray-300 w-150 rounded-md shadow-sm">
                                <LiveTrackingFAQCard
                                    faq={faq}
                                    index={index}
                                    openIndex={openLeftFAQ}
                                    toggleAccordion={toggleLeftFAQ}
                                />
                            </div>
                        ))}
                    </div>

                    {/* RIGHT ACCORDION */}
                    <div className='flex flex-col gap-2 mt-2'>
                        {generalLowerFaqs.slice(5,10).map((faq, index) => (
                            <div key={index} className="relative border border-gray-300 w-150 rounded-md shadow-sm">
                                <LiveTrackingFAQCard
                                    faq={faq}
                                    index={index}
                                    openIndex={openRightFAQ}
                                    toggleAccordion={toggleRightFAQ}
                                />
                            </div>
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

export default HelpCentrePage
