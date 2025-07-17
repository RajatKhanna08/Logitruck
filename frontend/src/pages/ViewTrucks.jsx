import React, { useState } from 'react';
import { FaSearch, FaFilter, FaStar } from 'react-icons/fa';

const dummyTrucks = [
  {
    id: 1,
    name: 'Tata 407',
    size: 'Medium (14 ft)',
    bodyType: 'Open Body',
    rating: 4.5,
    driver: 'Ramesh Kumar',
    reviews: ['On-time delivery', 'Clean truck', 'Polite driver'],
  },
  {
    id: 2,
    name: 'Ashok Leyland',
    size: 'Large (20 ft)',
    bodyType: 'Container',
    rating: 4.8,
    driver: 'Suresh Singh',
    reviews: ['Highly professional', 'Good condition', 'Experienced driver'],
  },
  {
    id: 3,
    name: 'Mahindra Bolero',
    size: 'Small (10 ft)',
    bodyType: 'Closed Body',
    rating: 4.0,
    driver: 'Ankit Yadav',
    reviews: ['Affordable', 'Timely', 'Good behavior'],
  },
];

const ViewTrucks = () => {
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTrucks = dummyTrucks.filter(truck =>
    truck.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-yellow-50 to-blue-200 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">🚛 View Available Trucks</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow w-full md:w-1/2">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search truck by name or type..."
            className="w-full outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <FaFilter />
          Filter
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border border-blue-200 rounded-lg shadow-md p-4 mb-6 max-w-md mx-auto">
          <p className="text-blue-700 font-semibold mb-2">Filter Options (coming soon):</p>
          <ul className="text-gray-600 list-disc list-inside">
            <li>Body Type (Open, Container, Closed)</li>
            <li>Size (Small, Medium, Large)</li>
            <li>Minimum Rating</li>
          </ul>
        </div>
      )}

      {/* Trucks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrucks.map((truck) => (
          <div
            key={truck.id}
            onClick={() => setSelectedTruck(truck)}
            className="bg-white border border-blue-300 rounded-xl shadow hover:shadow-lg p-4 cursor-pointer transition transform hover:scale-105"
          >
            <h2 className="text-xl font-semibold text-blue-700">{truck.name}</h2>
            <p className="text-sm text-gray-600">Size: {truck.size}</p>
            <p className="text-sm text-gray-600">Body: {truck.bodyType}</p>
            <p className="text-yellow-600 font-bold flex items-center">
              <FaStar className="mr-1 text-yellow-500" />
              {truck.rating}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedTruck && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h2 className="text-xl font-bold text-blue-700 mb-2">{selectedTruck.name}</h2>
            <p className="text-sm text-gray-700 mb-1"><strong>Size:</strong> {selectedTruck.size}</p>
            <p className="text-sm text-gray-700 mb-1"><strong>Body Type:</strong> {selectedTruck.bodyType}</p>
            <p className="text-sm text-gray-700 mb-1"><strong>Driver:</strong> {selectedTruck.driver}</p>
            <p className="text-sm text-yellow-600 mb-2 flex items-center">
              <FaStar className="mr-1 text-yellow-500" /> {selectedTruck.rating}
            </p>
            <div className="mb-4">
              <h3 className="font-medium text-blue-600">Reviews:</h3>
              <ul className="list-disc list-inside text-gray-600 text-sm">
                {selectedTruck.reviews.map((rev, idx) => (
                  <li key={idx}>{rev}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => alert('Booking initiated')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Book Truck
              </button>
              <button
                onClick={() => alert('Redirecting to bid page')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
              >
                Bid Now
              </button>
              <button
                onClick={() => setSelectedTruck(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              >
                ✖
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTrucks;
