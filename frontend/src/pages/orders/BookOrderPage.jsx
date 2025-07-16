import React, { useState } from "react";
import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaUser,
    FaWeightHanging,
    FaRulerCombined,
    FaBoxes,
    FaCalendarAlt,
    FaMoneyCheckAlt,
    FaFileAlt,
} from "react-icons/fa";

const BookOrderPage = () => {
    const [formData, setFormData] = useState({
        pickupAddress: '',
        pickupCoordinates: '',
        dropAddress: '',
        dropCoordinates: '',
        contactName: '',
        contactPhone: '',
        instructions: '',
        scheduleAt: '',
        weightInKg: '',
        volumeInCubicMeters: '',
        type: 'general',
        quantity: '',
        description: '',
        paymentMode: 'UPI'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const orderPayload = {
            pickupLocation: {
                address: formData.pickupAddress,
                coordinates: {
                    type: "Point",
                    coordinates: formData.pickupCoordinates.split(',').map(Number),
                }
            },
            dropLocations: [{
                address: formData.dropAddress,
                coordinates: {
                    type: "Point",
                    coordinates: formData.dropCoordinates.split(',').map(Number),
                },
                contactName: formData.contactName,
                contactPhone: formData.contactPhone,
                instructions: formData.instructions
            }],
            scheduleAt: new Date(formData.scheduleAt),
            loadDetails: {
                weightInKg: parseFloat(formData.weightInKg),
                volumeInCubicMeters: parseFloat(formData.volumeInCubicMeters),
                type: formData.type,
                quantity: parseInt(formData.quantity),
                description: formData.description
            },
            paymentMode: formData.paymentMode
        };

        console.log("Order Payload:", orderPayload);
        alert("Order submitted (preview only)");
    };

    return (
        <div className="min-h-screen py-10 px-6 bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100">
            <div className="max-w-5xl mx-auto bg-white p-10 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-blue-800 text-center mb-8">Book a Freight Order</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8">

                    {/* Pickup Section */}
                    <div className="col-span-full">
                        <h3 className="text-xl font-semibold text-yellow-500 mb-3">Pickup Details</h3>
                    </div>
                    <Input label="Pickup Address" name="pickupAddress" icon={<FaMapMarkerAlt />} onChange={handleChange} />
                    <Input label="Pickup Coordinates (lng, lat)" name="pickupCoordinates" icon={<FaMapMarkerAlt />} onChange={handleChange} />

                    {/* Drop Section */}
                    <div className="col-span-full">
                        <h3 className="text-xl font-semibold text-yellow-500 mt-2 mb-3">Drop Details</h3>
                    </div>
                    <Input label="Drop Address" name="dropAddress" icon={<FaMapMarkerAlt />} onChange={handleChange} />
                    <Input label="Drop Coordinates (lng, lat)" name="dropCoordinates" icon={<FaMapMarkerAlt />} onChange={handleChange} />
                    <Input label="Contact Name" name="contactName" icon={<FaUser />} onChange={handleChange} />
                    <Input label="Contact Phone" name="contactPhone" icon={<FaPhoneAlt />} onChange={handleChange} />

                    {/* Drop Instructions */}
                    <div className="col-span-full">
                        <label className="font-semibold mb-1 flex items-center gap-2">
                            <FaFileAlt /> Drop Instructions
                        </label>
                        <textarea
                            name="instructions"
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md resize-none"
                        />
                    </div>

                    {/* Load Details */}
                    <div className="col-span-full">
                        <h3 className="text-xl font-semibold text-yellow-500 mt-2 mb-3">Load Details</h3>
                    </div>
                    <Input type="number" label="Weight (Kg)" name="weightInKg" icon={<FaWeightHanging />} onChange={handleChange} />
                    <Input type="number" label="Volume (m³)" name="volumeInCubicMeters" icon={<FaRulerCombined />} onChange={handleChange} />
                    <Select
                        label="Load Type"
                        name="type"
                        icon={<FaBoxes />}
                        value={formData.type}
                        onChange={handleChange}
                        options={["general", "fragile", "perishable", "bulk", "electronics", "furniture", "others"]}
                    />
                    <Input type="number" label="Quantity" name="quantity" icon={<FaBoxes />} onChange={handleChange} />
                    <Input label="Load Description" name="description" icon={<FaFileAlt />} onChange={handleChange} />

                    {/* Schedule & Payment */}
                    <div className="col-span-full">
                        <h3 className="text-xl font-semibold text-yellow-500 mt-2 mb-3">Schedule & Payment</h3>
                    </div>
                    <Input type="date" label="Schedule Date" name="scheduleAt" icon={<FaCalendarAlt />} onChange={handleChange} />
                    <Select
                        label="Payment Mode"
                        name="paymentMode"
                        icon={<FaMoneyCheckAlt />}
                        value={formData.paymentMode}
                        onChange={handleChange}
                        options={["UPI", "Credit Card", "Net-Banking"]}
                    />

                    {/* Submit Button */}
                    <div className="col-span-full text-center pt-6">
                        <button
                            type="submit"
                            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 font-semibold rounded-full transition duration-300 cursor-pointer"
                        >
                            Submit Order 🚀
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Input Component
const Input = ({ label, icon, name, type = "text", onChange }) => (
    <div>
        <label className="block font-semibold mb-1 items-center gap-2">
            {icon} {label}
        </label>
        <input
            type={type}
            name={name}
            required
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-md"
        />
    </div>
);

// Select Component
const Select = ({ label, icon, name, value, onChange, options }) => (
    <div>
        <label className="flex font-semibold mb-1 items-center gap-2">
            {icon} {label}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-md"
        >
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
            ))}
        </select>
    </div>
);

export default BookOrderPage;