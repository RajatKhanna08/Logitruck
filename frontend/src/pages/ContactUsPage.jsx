import React from 'react'
import { FaPhoneAlt } from 'react-icons/fa'
import { HiMail } from 'react-icons/hi'
import Footer from '../components/Footer'

const ContactUsPage = () => {
    return (
        <div className='w-full h-full'>
            {/* BACKGROUND IMAGE */}
            <div className='relative flex justify-center items-center w-full h-100 bg-cover bg-bottom bg-no-repeat' style={{ backgroundImage: "url('/contactBackground.jpeg')" }}>
                <p className='text-6xl mt-20 text-yellow-300 font-semibold tracking-wider'>CONTACT US</p>
            </div>

            {/* MAIN CONTENT */}
            <div className='mb-40 flex gap-20'>
                {/* LEFT SECTION */}
                <div className='p-20 flex flex-col gap-10'>
                    {/* LEFT-UPPER SECTION */}
                    <div className='flex flex-col gap-5'>
                        <p className='text-5xl font-semibold'>Get In Touch</p>
                        <p className='text-yellow-300 font-medium text-3xl max-w-150'>"LG Transports specializes in smart, reliable, and budget-friendly logistics solutions, connecting verified trucks and drivers across India for fast and secure deliveries."</p>
                    </div>

                    {/* LEFT-LOWER SECTION */}
                    <div className='relative mt-10 flex flex-col gap-8'>
                        {/* BACKGROUND IMAGE */}
                        <img src="/contactFooterImage.avif" className='absolute -top-20 right-10 z-1 w-130 opacity-35 rounded-lg' />

                        {/* INNER CONTENT */}
                        <div className='flex justify-center items-center gap-25 z-2'>
                            <div className='bg-yellow-300 p-5 rounded-xl'>
                                <FaPhoneAlt size={40}/>
                            </div>
                            <div className='flex flex-col justify-center'>
                                <p className='text-2xl font-medium'>Have any Questions?</p>
                                <p className='text-xl text-center font-medium'>+91 1234567890</p>
                            </div>
                        </div>
                        <div className='flex justify-center items-center gap-25 z-2'>
                            <div className='bg-yellow-300 p-5 rounded-xl'>
                                <HiMail size={40}/>
                            </div>
                            <div className='flex flex-col w-56 justify-center'>
                                <p className='text-2xl text-center font-medium'>Write To Us</p>
                                <p className='text-xl text-center font-medium'>logitruck@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className='p-10 flex flex-col gap-10'>
                    {/* FORM HEADING */}
                    <p className='text-6xl text-[#192a67] font-semibold'>Contact for Queries?</p>

                    <div className='flex flex-col gap-10'>
                        {/* FORM - CHANGE TO FORM TAG */}
                        <div className='grid grid-cols-2 gap-4'>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                className="p-3 border-gray-300 border-2 rounded-md outline-none focus:ring-2 focus:ring-yellow-300"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                className="p-3 border-gray-300 border-2 rounded-md outline-none focus:ring-2 focus:ring-yellow-300"
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                className="p-3 border-gray-300 border-2 rounded-md outline-none focus:ring-2 focus:ring-yellow-300"
                            />
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                className="p-3 border-gray-300 border-2 rounded-md outline-none focus:ring-2 focus:ring-yellow-300"
                            />
                        </div>

                        <div>
                            <textarea name="" placeholder='Message' id="" rows={8} cols={70} className='border-gray-300 rounded-lg p-3 border-2'></textarea>
                        </div>

                        <button className='text-yellow-200 bg-[#192a67] hover:bg-[#3e4661] cursor-pointer p-3 text-xl font-semibold rounded-lg'>Submit</button>
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

export default ContactUsPage
