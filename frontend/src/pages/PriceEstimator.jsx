import React, { useState } from "react";
import {
  FaTruckMoving,
  FaWeightHanging,
  FaRoad,
  FaClock,
  FaCalendarAlt,
  FaListAlt,
  FaShippingFast,
  FaExpandArrowsAlt,
} from "react-icons/fa";

const PriceEstimator = () => {
  const [formData, setFormData] = useState({
    weightInTon: "",
    distanceInKm: "",
    isMultiStop: false,
    loadCategory: "",
    bodyTypeMultiplier: "",
    sizeCategoryMultiplier: "",
    urgencyLevel: "",
    deliveryTimeline: "",
  });

  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEstimatedPrice(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setEstimatedPrice(data.estimatedPrice || "No price returned");
    } catch (error) {
      console.error("Prediction error:", error);
      setEstimatedPrice("Failed to get estimate");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          🚛 AI Transport Price Estimator
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Weight in Ton */}
          <InputField
            icon={<FaWeightHanging className="text-indigo-500" />}
            label="Weight (in Tons)"
            type="number"
            name="weightInTon"
            value={formData.weightInTon}
            onChange={handleChange}
            placeholder="e.g. 10"
          />

          {/* Distance in Km */}
          <InputField
            icon={<FaRoad className="text-indigo-500" />}
            label="Distance (in KM)"
            type="number"
            name="distanceInKm"
            value={formData.distanceInKm}
            onChange={handleChange}
            placeholder="e.g. 150"
          />

          {/* Is Multi Stop */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isMultiStop"
              checked={formData.isMultiStop}
              onChange={handleChange}
              className="w-5 h-5 text-indigo-600"
            />
            <label className="text-sm font-medium text-gray-700">
              Multi-Stop Delivery?
            </label>
          </div>

          {/* Load Category */}
          <SelectField
            icon={<FaListAlt className="text-indigo-500" />}
            label="Load Category"
            name="loadCategory"
            value={formData.loadCategory}
            onChange={handleChange}
            options={["Fragile", "Perishable", "General", "Others"]}
          />

          {/* Body Type Multiplier */}
          <SelectField
            icon={<FaTruckMoving className="text-indigo-500" />}
            label="Body Type"
            name="bodyTypeMultiplier"
            value={formData.bodyTypeMultiplier}
            onChange={handleChange}
            options={[
              "Open Body",
              "Closed Container",
              "Tanker",
              "Refrigerated Truck",
              "Heavy Duty Flatbed",
            ]}
          />

          {/* Size Category Multiplier */}
          <SelectField
            icon={<FaExpandArrowsAlt className="text-indigo-500" />}
            label="Size Category"
            name="sizeCategoryMultiplier"
            value={formData.sizeCategoryMultiplier}
            onChange={handleChange}
            options={[
              "Small (7-10 ft)",
              "Medium (14-17 ft)",
              "Large (19-22 ft)",
              "XL/Heavy Duty",
            ]}
          />

          {/* Urgency Level */}
          <SelectField
            icon={<FaClock className="text-indigo-500" />}
            label="Urgency Level"
            name="urgencyLevel"
            value={formData.urgencyLevel}
            onChange={handleChange}
            options={["Normal", "Medium", "High"]}
          />

          {/* Delivery Timeline */}
          <InputField
            icon={<FaCalendarAlt className="text-indigo-500" />}
            label="Delivery Timeline (in Days)"
            type="number"
            name="deliveryTimeline"
            value={formData.deliveryTimeline}
            onChange={handleChange}
            placeholder="e.g. 3"
          />

          {/* Submit */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300"
              disabled={loading}
            >
              {loading ? "Estimating..." : "Estimate Price 💰"}
            </button>
          </div>
        </form>

        {/* Result */}
        {estimatedPrice && (
          <div className="mt-6 text-center text-xl font-semibold text-green-600">
            Estimated Price: ₹{estimatedPrice}
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({ icon, label, ...props }) => (
  <div>
    <label className="block mb-2 text-sm font-semibold text-gray-700">
      <div className="flex items-center gap-2">{icon} {label}</div>
    </label>
    <input
      {...props}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      required
    />
  </div>
);

// Reusable Select Field Component
const SelectField = ({ icon, label, name, value, onChange, options }) => (
  <div>
    <label className="block mb-2 text-sm font-semibold text-gray-700">
      <div className="flex items-center gap-2">{icon} {label}</div>
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      required
    >
      <option value="">Select {label}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default PriceEstimator;
