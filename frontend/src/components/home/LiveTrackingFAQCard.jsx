import { IoIosAdd, IoIosRemove } from 'react-icons/io';

const LiveTrackingFAQCard = ({faq, index, openIndex, toggleAccordion}) => {

    return (
        <div className="relative">
            {/* Question Button */}
            <button
                className="w-full flex items-center bg-yellow-300 gap-5 text-[#192a67] cursor-pointer justify-between px-6 py-5 text-left text-lg font-bold hover:bg-yellow-400 transition-all duration-300"
                onClick={() => toggleAccordion(index)}
            >
                {faq.question}
                <span className="text-2xl">
                    {openIndex === index ? <IoIosRemove /> : <IoIosAdd />}
                </span>
            </button>

            {/* Answer Box */}
            <div
                className={`absolute left-0 right-0 bg-white text-gray-700 border-t border-gray-200 text-base leading-relaxed rounded-b-xl shadow-xl transition-all duration-500 origin-top z-50 transform
                ${openIndex === index ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}
                style={{ transformOrigin: 'top' }}
            >
                <div className="px-6 py-4">{faq.answer}</div>
            </div>
        </div>
  )
}

export default LiveTrackingFAQCard
