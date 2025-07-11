import { AiFillStar } from 'react-icons/ai';

const TestimonialCard = ({ username, profileImg, reviewText, rating }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start space-y-4 transition-transform duration-300 hover:scale-105">
        {/* Profile Section */}
        <div className="flex items-center space-x-4">
            <img
                src={profileImg}
                alt={username}
                className="w-14 h-14 rounded-full object-cover border-2 border-yellow-300"
            />
            <div>
                <h3 className="text-lg font-semibold text-gray-800">{username}</h3>
                <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }, (_, i) => (
                        <AiFillStar
                            key={i}
                            className={`text-xl ${
                              i < rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>

        {/* Review Text */}
      <p className="text-gray-600 text-base leading-relaxed">"{reviewText}"</p>
    </div>
  )
}

export default TestimonialCard
