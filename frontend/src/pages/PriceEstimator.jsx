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
        <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-black/60 to-blue-300 flex items-center justify-center p-6">
            <div className="bg-gray-100 mt-20 rounded-3xl shadow-2xl p-10 max-w-5xl w-full">
                <h2 className="text-3xl font-bold text-center text-blue-800 mb-10">
                    AI Transport Price Estimator
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <InputField
                        icon={<FaWeightHanging className="text-blue-600" />}
                        label="Weight (in Tons)"
                        type="number"
                        name="weightInTon"
                        value={formData.weightInTon}
                        onChange={handleChange}
                        placeholder="e.g. 10"
                    />

                    <InputField
                        icon={<FaRoad className="text-blue-600" />}
                        label="Distance (in KM)"
                        type="number"
                        name="distanceInKm"
                        value={formData.distanceInKm}
                        onChange={handleChange}
                        placeholder="e.g. 150"
                    />

                    <SelectField
                        icon={<FaListAlt className="text-blue-600" />}
                        label="Load Category"
                        name="loadCategory"
                        value={formData.loadCategory}
                        onChange={handleChange}
                        options={["Fragile", "Perishable", "General", "Others"]}
                    />

                    <SelectField
                        icon={<FaTruckMoving className="text-blue-600" />}
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

                    <SelectField
                        icon={<FaExpandArrowsAlt className="text-blue-600" />}
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

                    <SelectField
                        icon={<FaClock className="text-blue-600" />}
                        label="Urgency Level"
                        name="urgencyLevel"
                        value={formData.urgencyLevel}
                        onChange={handleChange}
                        options={["Normal", "Medium", "High"]}
                    />

                    <InputField
                        icon={<FaCalendarAlt className="text-blue-600" />}
                        label="Delivery Timeline (in Days)"
                        type="number"
                        name="deliveryTimeline"
                        value={formData.deliveryTimeline}
                        onChange={handleChange}
                        placeholder="e.g. 3"
                    />

                    <div className="flex items-center gap-3 mt-2">
                        <input
                            type="checkbox"
                            name="isMultiStop"
                            checked={formData.isMultiStop}
                            onChange={handleChange}
                            className="w-5 h-5 text-yellow-500 cursor-pointer focus:ring-yellow-400"
                        />
                        <label className="text-gray-700 font-medium">
                            Multi-Stop Delivery?
                        </label>
                    </div>

                    <div className="sm:col-span-3 mt-6 text-center">
                        <button
                            type="submit"
                            className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300"
                            disabled={loading}
                        >
                            {loading ? "Estimating..." : "Estimate Price 💰"}
                        </button>
                    </div>
                </form>

                <div className="mt-10 min-h-20 flex justify-center items-center">
                    {estimatedPrice ? (
                        <div className="text-center text-2xl font-semibold text-green-700">
                            Estimated Price: ₹{estimatedPrice}
                        </div>
                    ) : (
                        <p>Enter the Details to see the price here</p>
                    )}
                </div>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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