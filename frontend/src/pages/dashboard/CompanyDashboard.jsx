import React, { useLayoutEffect, useState, useRef } from 'react';
import { useOrders } from '../../hooks/useOrder';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadCompanyDocuments } from '../../api/companyApi';
import { createOrder } from '../../api/companyApi';
import { useNavigate } from 'react-router-dom';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { 
    FaTruck, 
    FaRoute, 
    FaWallet, 
    FaClipboardList, 
    FaPlus, 
    FaUpload, 
    FaEye,
    FaCalendarAlt,
    FaMapMarkerAlt
} from "react-icons/fa";
import { IoClose } from 'react-icons/io5';

const CompanyDashboard = () => {
    const { data: allOrders = [], isLoading: ordersLoading, isError } = useOrders();
    const { data: userProfile, isLoading: profileLoading } = useUserProfile();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [showBookOrderModal, setShowBookOrderModal] = useState(false);
    const [showUploadDocsModal, setShowUploadDocsModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState({});

    // Chart refs for cleanup
    const ordersChartRef = useRef(null);
    const earningsChartRef = useRef(null);

    // Mutations
    const createOrderMutation = useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setShowBookOrderModal(false);
            alert('Order created successfully!');
        },
        onError: (error) => {
            console.error('Error creating order:', error);
            alert('Failed to create order. Please try again.');
        },
    });

    const uploadDocsMutation = useMutation({
        mutationFn: uploadCompanyDocuments,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            setShowUploadDocsModal(false);
            setSelectedFiles({});
            alert('Documents uploaded successfully!');
        },
        onError: (error) => {
            console.error('Error uploading documents:', error);
            alert('Failed to upload documents. Please try again.');
        },
    });

    // Generate sample data for empty state
    const generateSampleData = (type = 'orders') => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map(month => ({
            month,
            value: type === 'orders' ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 50000) + 10000
        }));
    };

    // Chart: Monthly Orders
    useLayoutEffect(() => {
        // Add a small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            // Check if the DOM element exists
            const chartElement = document.getElementById("ordersChart");
            if (!chartElement) {
                console.warn("ordersChart element not found");
                return;
            }

            // Cleanup previous chart
            if (ordersChartRef.current) {
                ordersChartRef.current.dispose();
            }

            try {
                const root = am5.Root.new("ordersChart");
                ordersChartRef.current = root;
        
        root.setThemes([am5themes_Animated.new(root)]);
        
        const chart = root.container.children.push(
            am5xy.XYChart.new(root, { 
                layout: root.verticalLayout,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 20,
                paddingBottom: 20
            })
        );

        const xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, { 
                categoryField: "month", 
                renderer: am5xy.AxisRendererX.new(root, {
                    minGridDistance: 30,
                    cellStartLocation: 0.1,
                    cellEndLocation: 0.9
                }) 
            })
        );

        const yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, { 
                renderer: am5xy.AxisRendererY.new(root, {}) 
            })
        );

        const series = chart.series.push(
            am5xy.ColumnSeries.new(root, { 
                name: "Orders", 
                xAxis, 
                yAxis, 
                valueYField: "value", 
                categoryXField: "month",
                fill: am5.color("#fbbf24")
            })
        );

        // Prepare chart data
        let chartData;
        if (allOrders.length > 0) {
            const monthlyOrdersData = allOrders.reduce((acc, order) => {
                const date = new Date(order.scheduleAt || order.createdAt);
                const month = date.toLocaleString('default', { month: 'short' });
                acc[month] = (acc[month] || 0) + 1;
                return acc;
            }, {});

            chartData = Object.entries(monthlyOrdersData).map(([month, value]) => ({ 
                month, 
                value 
            }));
        } else {
            // Show sample data when no orders exist
            chartData = generateSampleData('orders');
        }

        series.data.setAll(chartData);
        xAxis.data.setAll(chartData);

        // Add cursor
        chart.set("cursor", am5xy.XYCursor.new(root, {}));

            } catch (error) {
                console.error("Error creating orders chart:", error);
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            if (ordersChartRef.current) {
                ordersChartRef.current.dispose();
                ordersChartRef.current = null;
            }
        };
    }, [allOrders]);

    // Chart: Earnings Overview
    useLayoutEffect(() => {
        // Add a small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            // Check if the DOM element exists
            const chartElement = document.getElementById("earningsChart");
            if (!chartElement) {
                console.warn("earningsChart element not found");
                return;
            }

            // Cleanup previous chart
            if (earningsChartRef.current) {
                earningsChartRef.current.dispose();
            }

            try {
                const root = am5.Root.new("earningsChart");
                earningsChartRef.current = root;
        
        root.setThemes([am5themes_Animated.new(root)]);
        
        const chart = root.container.children.push(
            am5xy.XYChart.new(root, { 
                layout: root.verticalLayout,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 20,
                paddingBottom: 20
            })
        );

        const xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, { 
                categoryField: "month", 
                renderer: am5xy.AxisRendererX.new(root, {
                    minGridDistance: 30
                }) 
            })
        );

        const yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, { 
                renderer: am5xy.AxisRendererY.new(root, {}) 
            })
        );

        const series = chart.series.push(
            am5xy.LineSeries.new(root, { 
                name: "Earnings", 
                xAxis, 
                yAxis, 
                valueYField: "value", 
                categoryXField: "month",
                stroke: am5.color("#3b82f6")
            })
        );

        series.strokes.template.setAll({ strokeWidth: 3 });
        series.bullets.push(() => {
            return am5.Bullet.new(root, {
                sprite: am5.Circle.new(root, {
                    radius: 4,
                    fill: am5.color("#3b82f6")
                })
            });
        });

        // Prepare chart data
        let chartData;
        if (allOrders.length > 0) {
            const monthlyEarningsData = allOrders.reduce((acc, order) => {
                const date = new Date(order.scheduleAt || order.createdAt);
                const month = date.toLocaleString('default', { month: 'short' });
                acc[month] = (acc[month] || 0) + (order.finalBidAmount || order.estimatedCost || 0);
                return acc;
            }, {});

            chartData = Object.entries(monthlyEarningsData).map(([month, value]) => ({ 
                month, 
                value 
            }));
        } else {
            // Show sample data when no orders exist
            chartData = generateSampleData('earnings');
        }

        series.data.setAll(chartData);
        xAxis.data.setAll(chartData);

        // Add cursor
        chart.set("cursor", am5xy.XYCursor.new(root, {}));

            } catch (error) {
                console.error("Error creating earnings chart:", error);
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            if (earningsChartRef.current) {
                earningsChartRef.current.dispose();
                earningsChartRef.current = null;
            }
        };
    }, [allOrders]);

    // Cleanup on unmount
    useLayoutEffect(() => {
        return () => {
            if (ordersChartRef.current) {
                ordersChartRef.current.dispose();
            }
            if (earningsChartRef.current) {
                earningsChartRef.current.dispose();
            }
        };
    }, []);

    // Handle form submissions
    const handleBookOrder = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const orderData = {
            pickupLocation: {
                address: formData.get('pickupAddress'),
                coordinates: [0, 0] // You might want to geocode this
            },
            dropLocations: [{
                address: formData.get('dropAddress'),
                coordinates: [0, 0]
            }],
            scheduleAt: formData.get('scheduleAt'),
            vehicleType: formData.get('vehicleType'),
            estimatedCost: parseFloat(formData.get('estimatedCost')),
            description: formData.get('description'),
            weight: parseFloat(formData.get('weight')),
            dimensions: {
                length: parseFloat(formData.get('length')),
                width: parseFloat(formData.get('width')),
                height: parseFloat(formData.get('height'))
            }
        };

        createOrderMutation.mutate(orderData);
    };

    const handleUploadDocs = (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        Object.entries(selectedFiles).forEach(([key, file]) => {
            if (file) {
                formData.append(key, file);
            }
        });

        if (Object.keys(selectedFiles).length === 0) {
            alert('Please select at least one file to upload');
            return;
        }

        uploadDocsMutation.mutate(formData);
    };

    const handleFileChange = (docType, file) => {
        setSelectedFiles(prev => ({
            ...prev,
            [docType]: file
        }));
    };

    // Stats calculations
    if (ordersLoading || profileLoading) {
        return (
            <div className="pt-30 min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const totalOrders = allOrders.length;
    const totalEarnings = allOrders.reduce((sum, o) => sum + (o.finalBidAmount || o.estimatedCost || 0), 0);
    const pendingOrders = allOrders.filter(o => o.status === 'pending' || o.status === 'accepted').length;
    const completedOrders = allOrders.filter(o => o.status === 'completed' || o.status === 'delivered').length;
    const routesUsed = new Set(
        allOrders.map(o => 
            `${o.pickupLocation?.address || 'Unknown'} → ${o.dropLocations?.map(d => d.address).join(', ') || 'Unknown'}`
        )
    ).size;

    const companyName = userProfile?.company?.companyName || 'Company';

    return (
        <div className="pt-30 min-h-screen bg-gray-100 p-6 text-[#192a67]">
            <div className="mb-6">
                <h1 className="text-4xl font-bold">Welcome back, {companyName}!</h1>
                <p className="text-gray-500">Here's what's happening with your logistics operations.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { 
                        title: "Total Orders", 
                        value: totalOrders, 
                        icon: <FaClipboardList />,
                        color: "text-blue-500",
                        bgColor: "bg-blue-50"
                    },
                    { 
                        title: "Total Earnings", 
                        value: `₹${totalEarnings.toLocaleString()}`, 
                        icon: <FaWallet />,
                        color: "text-green-500",
                        bgColor: "bg-green-50"
                    },
                    { 
                        title: "Pending Orders", 
                        value: pendingOrders, 
                        icon: <FaTruck />,
                        color: "text-yellow-500",
                        bgColor: "bg-yellow-50"
                    },
                    { 
                        title: "Completed Orders", 
                        value: completedOrders, 
                        icon: <FaRoute />,
                        color: "text-purple-500",
                        bgColor: "bg-purple-50"
                    },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 shadow hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <div className={`${stat.color} ${stat.bgColor} p-3 rounded-lg text-2xl`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">{stat.title}</p>
                                <p className="text-2xl font-bold text-[#192a67]">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-5 rounded-xl shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Monthly Orders</h2>
                        {allOrders.length === 0 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Sample Data</span>
                        )}
                    </div>
                    <div id="ordersChart" className="w-full h-72"></div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Earnings Overview</h2>
                        {allOrders.length === 0 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Sample Data</span>
                        )}
                    </div>
                    <div id="earningsChart" className="w-full h-72"></div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white p-5 rounded-xl shadow mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Recent Orders</h2>
                    <button
                        onClick={() => navigate('/orders/all')}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                    >
                        <FaEye /> View All Orders
                    </button>
                </div>
                {ordersLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-blue-600" />
                    </div>
                ) : allOrders.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 mb-4">No orders to display yet.</p>
                        <button
                            onClick={() => setShowBookOrderModal(true)}
                            className="bg-yellow-400 text-[#192a67] font-bold px-6 py-2 rounded hover:bg-yellow-500 transition"
                        >
                            Create Your First Order
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-yellow-300 text-[#192a67]">
                                    <th className="py-3 px-4 font-semibold">Order ID</th>
                                    <th className="py-3 px-4 font-semibold">Route</th>
                                    <th className="py-3 px-4 font-semibold">Vehicle</th>
                                    <th className="py-3 px-4 font-semibold">Amount</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allOrders.slice(0, 5).map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition border-b">
                                        <td className="py-3 px-4 font-semibold text-blue-600">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-green-500 text-sm" />
                                                <span className="text-sm">
                                                    {order.pickupLocation?.address || 'Unknown'} → {' '}
                                                    {order.dropLocations?.map(d => d.address).join(', ') || 'Unknown'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {order.acceptedTruckId?.vehicleNumber || order.vehicleType || "Pending"}
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-green-600">
                                            ₹{(order.finalBidAmount || order.estimatedCost || 0).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                order.status === 'completed' || order.status === 'delivered'
                                                    ? 'bg-green-100 text-green-700'
                                                    : order.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : order.status === 'accepted' || order.status === 'in_transit'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {order.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <FaCalendarAlt className="text-xs" />
                                                {new Date(order.scheduleAt || order.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-[#192a67] text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-bold">Need to perform quick actions?</h3>
                    <p className="text-yellow-300">Book an order, upload documents or update your company profile now.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <button 
                        onClick={() => navigate('/orders/book')}
                        className="bg-yellow-300 text-[#192a67] font-bold px-6 py-3 rounded hover:bg-yellow-400 transition flex items-center gap-2"
                    >
                        <FaPlus /> Book Order
                    </button>
                    <button 
                        onClick={() => setShowUploadDocsModal(true)}
                        className="border border-yellow-300 text-yellow-300 px-6 py-3 rounded hover:bg-yellow-300 hover:text-[#192a67] font-bold transition flex items-center gap-2"
                    >
                        <FaUpload /> Upload Docs
                    </button>
                </div>
            </div>

            {/* Book Order Modal */}
            {showBookOrderModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowBookOrderModal(false)}
                            className="absolute top-4 right-4 text-red-500 text-2xl hover:text-red-700 transition"
                        >
                            <IoClose />
                        </button>
                        <h3 className="text-2xl font-bold mb-6 text-[#192a67]">Create New Order</h3>
                        
                        {createOrderMutation.isPending && (
                            <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
                                Creating order...
                            </div>
                        )}

                        <form onSubmit={handleBookOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Input 
                                    label="Pickup Address" 
                                    name="pickupAddress" 
                                    required 
                                    placeholder="Enter pickup location"
                                />
                            </div>
                            <div className="col-span-2">
                                <Input 
                                    label="Drop Address" 
                                    name="dropAddress" 
                                    required 
                                    placeholder="Enter destination"
                                />
                            </div>
                            <Input 
                                label="Schedule Date & Time" 
                                name="scheduleAt" 
                                type="datetime-local" 
                                required 
                            />
                            <Input 
                                label="Vehicle Type" 
                                name="vehicleType" 
                                required 
                                placeholder="e.g., Truck, Tempo, Mini Truck"
                            />
                            <Input 
                                label="Estimated Cost (₹)" 
                                name="estimatedCost" 
                                type="number" 
                                required 
                                placeholder="Enter estimated cost"
                            />
                            <Input 
                                label="Weight (kg)" 
                                name="weight" 
                                type="number" 
                                required 
                                placeholder="Total weight"
                            />
                            <Input 
                                label="Length (ft)" 
                                name="length" 
                                type="number" 
                                placeholder="Length in feet"
                            />
                            <Input 
                                label="Width (ft)" 
                                name="width" 
                                type="number" 
                                placeholder="Width in feet"
                            />
                            <Input 
                                label="Height (ft)" 
                                name="height" 
                                type="number" 
                                placeholder="Height in feet"
                            />
                            <div className="col-span-2">
                                <label className="block mb-1 font-semibold text-sm text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                    placeholder="Additional details about the shipment"
                                ></textarea>
                            </div>
                            
                            <div className="col-span-2 flex justify-end gap-3 mt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowBookOrderModal(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-[#192a67] hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 transition"
                                    disabled={createOrderMutation.isPending}
                                >
                                    {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Upload Documents Modal */}
            {showUploadDocsModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 relative">
                        <button
                            onClick={() => setShowUploadDocsModal(false)}
                            className="absolute top-4 right-4 text-red-500 text-2xl hover:text-red-700 transition"
                        >
                            <IoClose />
                        </button>
                        <h3 className="text-2xl font-bold mb-6 text-[#192a67]">Upload Company Documents</h3>
                        
                        {uploadDocsMutation.isPending && (
                            <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
                                Uploading documents...
                            </div>
                        )}

                        <form onSubmit={handleUploadDocs} className="space-y-4">
                            <FileInput
                                label="GST Certificate"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(file) => handleFileChange('gstCertificate', file)}
                            />
                            <FileInput
                                label="Company Registration"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(file) => handleFileChange('companyRegistration', file)}
                            />
                            <FileInput
                                label="PAN Card"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(file) => handleFileChange('panCard', file)}
                            />
                            <FileInput
                                label="Address Proof"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(file) => handleFileChange('addressProof', file)}
                            />
                            
                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setShowUploadDocsModal(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-[#192a67] hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 transition"
                                    disabled={uploadDocsMutation.isPending}
                                >
                                    {uploadDocsMutation.isPending ? 'Uploading...' : 'Upload Documents'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const Input = ({ label, name, defaultValue, type = "text", required = false, placeholder }) => (
    <div>
        <label className="block mb-1 font-semibold text-sm text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            defaultValue={defaultValue}
            required={required}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
        />
    </div>
);

const FileInput = ({ label, accept, onChange }) => (
    <div>
        <label className="block mb-1 font-semibold text-sm text-gray-700">
            {label}
        </label>
        <input
            type="file"
            accept={accept}
            onChange={(e) => onChange(e.target.files[0])}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
        />
    </div>
);

export default CompanyDashboard;