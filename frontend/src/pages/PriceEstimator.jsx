import React, { useState } from 'react';
import { FaWeightHanging, FaRoad, FaBoxOpen, FaTruck, FaExpandArrowsAlt, FaClock, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';

const AiPriceEstimator = () => {
  const [formData, setFormData] = useState({
    weightInTon: '',
    distance: '',
    loadCategory: '',
    bodyType: '',
    sizeCategory: '',
    urgencyLevel: '',
    deliveryTimeline: '',
    multiStop: false,
  });

  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstimatedPrice(null);
    setError('');

    try {
      const res = await axios.post('http://127.0.0.1:5000/predict', formData);
      setEstimatedPrice(res.data.estimated_price);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">AI Transport Price Estimator</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Weight */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <FaWeightHanging />
            Weight (in Tons)
          </label>
          <input
            type="number"
            name="weightInTon"
            value={formData.weightInTon}
            onChange={handleChange}
            placeholder="e.g. 10"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 mt-1"
            required
          />
        </div>

        {/* Distance */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <FaRoad />
            Distance (in KM)
          </label>
          <input
            type="number"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            placeholder="e.g. 150"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 mt-1"
            required
          />
        </div>

        {/* Load Category */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <FaBoxOpen />
            Load Category
          </label>
          <select
            name="loadCategory"
            value={formData.loadCategory}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 mt-1"
            required
          >
            <option value="">Select Load Category</option>
            <option>Fragile</option>
            <option>Perishable Goods</option>
            <option>General Goods</option>
            <option>Others</option>
          </select>
        </div>

        {/* Body Type */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <FaTruck />
            Body Type
          </label>
          <select
            name="bodyType"
            value={formData.bodyType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 mt-1"
            required
          >
            <option value="">Select Body Type</option>
            <option>Open Body</option>
            <option>Closed Container</option>
            <option>Tanker</option>
            <option>Refrigerated Truck</option>
            <option>Heavy Duty Flatbed</option>
          </select>
        </div>

        {/* Size Category */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <FaExpandArrowsAlt />
            Size Category
          </label>
          <select
            name="sizeCategory"
            value={formData.sizeCategory}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 mt-1"
            required
          >
            <option value="">Select Size Category</option>
            <option>Small (7-10 ft)</option>
            <option>Medium (14-17 ft)</option>
            <option>Large (19-22 ft)</option>
            <option>XL / Heavy Duty</option>
          </select>
        </div>

        {/* Urgency Level */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <FaClock />
            Urgency Level
          </label>
          <select
            name="urgencyLevel"
            value={formData.urgencyLevel}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 mt-1"
            required
          >
            <option value="">Select Urgency Level</option>
            <option>Normal</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Delivery Timeline */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <FaCalendarAlt />
            Delivery Timeline (in Days)
          </label>
          <input
            type="number"
            name="deliveryTimeline"
            value={formData.deliveryTimeline}
            onChange={handleChange}
            placeholder="e.g. 3"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 mt-1"
            required
          />
        </div>

        {/* Multi Stop Checkbox */}
        <div className="flex items-center gap-3 mt-6">
          <input
            type="checkbox"
            name="multiStop"
            checked={formData.multiStop}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600"
          />
          <span className="text-gray-700 text-md font-medium">Multi-Stop Delivery?</span>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 rounded-full shadow hover:bg-blue-800 transition"
          >
            Estimate Price
          </button>
        </div>
      </form>

      {/* Result or Error */}
      {estimatedPrice !== null && (
        <div className="mt-6 text-xl font-semibold text-green-600">
          Estimated Price: ₹{Math.round(estimatedPrice)}
        </div>
      )}
      {error && <div className="mt-6 text-red-500">{error}</div>}
    </div>
  );
};

export default AiPriceEstimator;
