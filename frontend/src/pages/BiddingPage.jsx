import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";

const mockBids = [
  { id: 1, company: "ABC Logistics", currentBid: 8500 },
  { id: 2, company: "XYZ Movers", currentBid: 9200 },
  { id: 3, company: "QuickTrans", currentBid: 7800 },
];

const BiddingPage = () => {
  const [bids, setBids] = useState(mockBids);
  const [selectedBid, setSelectedBid] = useState(null);
  const [editedBid, setEditedBid] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Timer
  useEffect(() => {
    if (!isModalOpen) return;
    if (timeLeft <= 0) return;

    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isModalOpen]);

  // Progress percentage
  const getProgress = () => `${(timeLeft / 60) * 100}%`;

  const openModal = (bid) => {
    setSelectedBid(bid);
    setEditedBid(bid.currentBid);
    setTimeLeft(60);
    setIsModalOpen(true);
  };

  const submitBid = () => {
    setBids((prevBids) =>
      prevBids.map((b) =>
        b.id === selectedBid.id ? { ...b, currentBid: editedBid } : b
      )
    );
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-yellow-100 to-blue-200 p-6">
      <h1 className="text-3xl mt-30 font-bold text-center text-blue-800 mb-6">
        Live Transport Bidding
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {bids.map((bid) => (
          <div
            key={bid.id}
            className="bg-white p-6 rounded-xl shadow-lg border border-blue-300 flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {bid.company}
              </h2>
              <p className="text-blue-600 font-bold mt-1">
                Current Bid: ₹{bid.currentBid}
              </p>
            </div>
            <button
              onClick={() => openModal(bid)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <FaEdit />
              Edit Bid
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg relative">
            <h2 className="text-xl font-bold text-blue-700 mb-2">
              Edit Bid – {selectedBid.company}
            </h2>
            <div className="mb-4">
              <label className="text-gray-600 font-medium">
                New Bid Amount (₹):
              </label>
              <input
                type="number"
                className="w-full mt-1 p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={editedBid}
                onChange={(e) => setEditedBid(e.target.value)}
              />
            </div>

            {/* Time line */}
            <div className="mb-2">
              <p className="text-sm text-red-500 font-medium mb-1">
                ⏳ Time remaining to update bid: {timeLeft}s
              </p>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-red-500 rounded-full transition-all"
                  style={{ width: getProgress() }}
                ></div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitBid}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                disabled={timeLeft <= 0}
              >
                Submit Bid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiddingPage;
