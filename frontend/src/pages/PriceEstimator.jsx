import React, { useState } from "react";
import { FaTruckMoving, FaWeightHanging, FaClock, FaCalendarAlt } from "react-icons/fa";

const PriceEstimator = () => {
  const [formData, setFormData] = useState({
    weightInTon: "",
    loadType: "",
    urgencyLevel: "",
    deliveryTimeline: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    // Send to backend/AI model here
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="mt-20 bg-white p-10 rounded-3xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">🚛 AI Price Estimator</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Weight */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <FaWeightHanging className="text-indigo-500" />
                Weight (in Tons)
              </div>
            </label>
            <input
              type="number"
              name="weightInTon"
              value={formData.weightInTon}
              onChange={handleChange}
              placeholder="e.g., 10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Load Type */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <FaTruckMoving className="text-indigo-500" />
                Load Type
              </div>
            </label>
            <select
              name="loadType"
              value={formData.loadType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            >
              <option value="">Select Load Type</option>
              <option value="Fragile">Fragile</option>
              <option value="Heavy Machinery">Heavy Machinery</option>
              <option value="Perishable Goods">Perishable Goods</option>
              <option value="General Goods">General Goods</option>
            </select>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <FaClock className="text-indigo-500" />
                Urgency Level
              </div>
            </label>
            <select
              name="urgencyLevel"
              value={formData.urgencyLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            >
              <option value="">Select Urgency</option>
              <option value="Standard">Standard</option>
              <option value="Express">Express</option>
              <option value="Same Day">Same Day</option>
            </select>
          </div>

          {/* Delivery Timeline */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-indigo-500" />
                Delivery Timeline (in Days)
              </div>
            </label>
            <input
              type="number"
              name="deliveryTimeline"
              value={formData.deliveryTimeline}
              onChange={handleChange}
              placeholder="e.g., 3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition"
            >
              Estimate Price 💰
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PriceEstimator;
