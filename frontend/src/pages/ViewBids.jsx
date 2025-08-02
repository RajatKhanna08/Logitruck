import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, ServerCrash, Package, MapPin, GanttChartSquare, Users, Clock, Tag, FileText, Info, Building2 } from 'lucide-react';

// Axios default configuration
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

const ViewBids = () => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyBids = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/bidding/my-bids');
                setBids(response.data.bids);
            } catch (err) {
                console.error("Error fetching bids:", err);
                setError(err.response?.data?.message || "Your active bids could not be fetched. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyBids();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const BidStatusBadge = ({ status }) => {
        const baseClasses = "px-3 py-1.5 text-sm font-bold rounded-full inline-flex items-center gap-2 shadow-sm";
        switch (status?.toLowerCase()) {
            case "accepted":
                return <span className={`${baseClasses} bg-green-100 text-green-800`}><Info size={14} /> Accepted</span>;
            case "rejected":
                return <span className={`${baseClasses} bg-red-100 text-red-800`}><Info size={14} /> Rejected</span>;
            case "pending":
            default:
                return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}><Clock size={14} /> Pending</span>;
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <p className="mt-4 text-lg text-gray-600">Loading Your Bids...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center p-4">
                <ServerCrash className="w-16 h-16 text-red-500" />
                <h2 className="mt-4 text-2xl font-bold text-red-700">Oops! Something went wrong.</h2>
                <p className="mt-2 text-md text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-yellow-50 to-blue-200 p-4 sm:p-6 lg:p-28">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-10 animate-fade-in
                       text-blue-800 tracking-wide drop-shadow-lg">
                Your Active Bids
            </h1>

                {bids.length === 0 ? (
                    <div className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-10 rounded-xl shadow-md border border-gray-200">
                        <GanttChartSquare className="w-16 h-16 text-gray-400" />
                        <h3 className="mt-4 text-xl font-semibold text-gray-700">No Active Bids Found</h3>
                        <p className="mt-1 text-gray-500">You have not placed any bids on open orders yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bids.map((bidItem) => (
                            <div key={bidItem.biddingId} className="bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col overflow-hidden border-t-4 border-t-blue-500">
                                {/* ✅ CHANGED: Card ke andar sections bana diye gaye hain */}
                                <div className="flex-grow flex flex-col">
                                    {/* Section 1: IDs */}
                                    <div className="p-6">
                                        <div className="space-y-2 break-words">
                                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                                <Package size={16} className="text-gray-400" />
                                                <span className="font-medium">Order ID:</span>
                                                <span className="font-semibold text-gray-900">{bidItem.orderInfo?._id}</span>
                                            </p>
                                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                                <FileText size={16} className="text-gray-400" />
                                                <span className="font-medium">Bidding ID:</span>
                                                <span className="font-semibold text-gray-900">{bidItem.biddingId}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Section 2: Location (with background) */}
                                    <div className="bg-slate-50 border-y border-slate-200 px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <MapPin className="w-7 h-7 text-rose-500 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-base text-gray-800">{bidItem.orderInfo?.pickupLocation.address}</p>
                                                <p className="text-sm text-gray-500 mt-1">to {bidItem.orderInfo?.dropLocations[0].address}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Section 3: Bidding Details */}
                                    <div className="p-6 flex-grow">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                                                <span className="text-blue-700 font-medium flex items-center gap-2"><Building2 size={16} />Fair Price</span>
                                                <span className="font-bold text-lg text-blue-800">{formatCurrency(bidItem.fairPrice)}</span>
                                            </div>
                                            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                                                <span className="text-gray-600 font-medium flex items-center gap-2"><Tag size={16} />AI Price</span>
                                                <span className="font-bold text-lg text-blue-800">{formatCurrency(bidItem.aiPrice)}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 font-medium flex items-center gap-2"><Users size={16} /> Total Bids</span>
                                                <span className="font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-full text-base">{bidItem.totalBids}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-100 p-5 mt-auto border-t border-gray-200/80">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 font-semibold">Your Bid</p>
                                            <p className="text-2xl font-bold text-blue-600">{formatCurrency(bidItem.myBid.bidAmount)}</p>
                                        </div>
                                        <BidStatusBadge status={bidItem.myBid.status} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewBids;