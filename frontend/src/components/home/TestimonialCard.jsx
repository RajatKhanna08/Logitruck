import { AiFillStar } from 'react-icons/ai';

const TestimonialCard = ({ username, profileImg, reviewText, rating }) => {
    return (
        <div className="bg-white shadow-xl shadow-black p-6 h-[350px] flex flex-col justify-between transition-transform duration-300">

        {/* Review Text */}
      <p className="text-gray-600 p-4 text-2xl leading-relaxed">"{reviewText}"</p>

      {/* Profile Section */}
        <div className="flex items-center space-x-4">
            <img
                src={profileImg}
                alt={username}
                className="w-20 h-20 rounded-full object-cover border-2 border-yellow-300"
            />
            <div>
                <h3 className="text-3xl font-semibold text-[#192a67]">{username}</h3>
                <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }, (_, i) => (
                        <AiFillStar
                            key={i}
                            className={`text-2xl ${
                              i < rating ? 'text-yellow-300' : 'text-gray-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default TestimonialCard
