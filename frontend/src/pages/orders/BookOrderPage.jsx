import React, { useState } from 'react';

const BookOrderPage = () => {
  const [formData, setFormData] = useState({
    pickupAddress: '',
    pickupCoordinates: '',
    dropAddress: '',
    dropCoordinates: '',
    stopIndex: 1,
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

    // Format data for backend
    const orderPayload = {
      pickupLocation: {
        address: formData.pickupAddress,
        coordinates: {
          type: "Point",
          coordinates: formData.pickupCoordinates.split(',').map(Number),
        }
      },
      dropLocations: [{
        stopIndex: formData.stopIndex,
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

    console.log("Payload:", orderPayload);
    alert("Preview Only. Backend integration required.");
  };

  return (
    <div className="min-h-screen py-10 px-20s bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">📦 Book Your Freight Order</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Pickup */}
          <div>
            <label className="block font-semibold">Pickup Address</label>
            <input type="text" name="pickupAddress" required onChange={handleChange}
              className="w-full p-3 border rounded-md" placeholder="e.g., Bhiwadi, Rajasthan" />
          </div>
          <div>
            <label className="block font-semibold">Pickup Coordinates (lng, lat)</label>
            <input type="text" name="pickupCoordinates" required onChange={handleChange}
              className="w-full p-3 border rounded-md" placeholder="e.g., 76.8606, 28.2104" />
          </div>

          {/* Drop */}
          <div>
            <label className="block font-semibold">Drop Address</label>
            <input type="text" name="dropAddress" required onChange={handleChange}
              className="w-full p-3 border rounded-md" />
          </div>
          <div>
            <label className="block font-semibold">Drop Coordinates (lng, lat)</label>
            <input type="text" name="dropCoordinates" required onChange={handleChange}
              className="w-full p-3 border rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold">Contact Name</label>
              <input type="text" name="contactName" required onChange={handleChange}
                className="w-full p-3 border rounded-md" />
            </div>
            <div>
              <label className="block font-semibold">Contact Phone</label>
              <input type="text" name="contactPhone" required onChange={handleChange}
                className="w-full p-3 border rounded-md" />
            </div>
          </div>
          <div>
            <label className="block font-semibold">Drop Instructions</label>
            <textarea name="instructions" onChange={handleChange}
              className="w-full p-3 border rounded-md resize-none" />
          </div>

          {/* Load Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold">Weight (kg)</label>
              <input type="number" name="weightInKg" required onChange={handleChange}
                className="w-full p-3 border rounded-md" />
            </div>
            <div>
              <label className="block font-semibold">Volume (m³)</label>
              <input type="number" name="volumeInCubicMeters" required onChange={handleChange}
                className="w-full p-3 border rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold">Load Type</label>
              <select name="type" value={formData.type} onChange={handleChange}
                className="w-full p-3 border rounded-md">
                <option value="general">General</option>
                <option value="fragile">Fragile</option>
                <option value="perishable">Perishable</option>
                <option value="bulk">Bulk</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold">Quantity</label>
              <input type="number" name="quantity" required onChange={handleChange}
                className="w-full p-3 border rounded-md" />
            </div>
          </div>
          <div>
            <label className="block font-semibold">Load Description</label>
            <input type="text" name="description" required onChange={handleChange}
              className="w-full p-3 border rounded-md" />
          </div>

          {/* Schedule & Payment */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold">Schedule Date</label>
              <input type="date" name="scheduleAt" onChange={handleChange}
                className="w-full p-3 border rounded-md" />
            </div>
            <div>
              <label className="block font-semibold">Payment Mode</label>
              <select name="paymentMode" value={formData.paymentMode} onChange={handleChange}
                className="w-full p-3 border rounded-md">
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Net-Banking">Net-Banking</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="text-center pt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full">
              Submit Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookOrderPage;
