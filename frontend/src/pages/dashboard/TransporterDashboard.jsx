import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
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
    FaMapMarkerAlt,
    FaStar,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaMapPin,
    FaShieldAlt,
    FaFileAlt,
    FaCog,
    FaEdit,
    FaCheckCircle,
    FaTimesCircle,
    FaChartLine
} from "react-icons/fa";
import { IoClose } from 'react-icons/io5';

// Assuming useUserProfile is correctly configured to send auth tokens
import { useUserProfile } from '../../hooks/useUserProfile'; 

// Import the API function that makes the actual fetch call
import { getTransporterDashboard as updateProfile, uploadDocument } from '../../api/transporterApi'; 


const TransporterDashboard = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    // Fetch user profile data
    const { 
        data: userProfile
    } = useUserProfile();

    // State for modals
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);

    // Chart refs - Declared only once
    const revenueChartRef = useRef(null);
    const ordersChartRef = useRef(null);

    // Extract transporter data from userProfile
    const transporterData = userProfile.transporter || {};
    
    // Since useOrders is removed, we no longer have 'allOrders' to filter.
    // assignedOrders will now be an empty array.
    const assignedOrders = transporterData.assignedBookings || []; // This will remain empty as no individual order data is fetched here
    console.log(transporterData);
    
    // Get trucks data from transporter profile (assuming userProfile returns populated truck objects)
    const trucks = transporterData.trucks || [];

    // Generate revenue and orders data for charts - now returns mock data
    // These functions will return zeros as individual order data is not available
    const generateRevenueData = () => {
        // If no assigned orders, return zeros
        if (!assignedOrders || assignedOrders.length === 0) {
            return [
                { month: 'Jan', value: 0 }, { month: 'Feb', value: 0 }, { month: 'Mar', value: 0 },
                { month: 'Apr', value: 0 }, { month: 'May', value: 0 }, { month: 'Jun', value: 0 }
            ];
        }
    
        // Create an object to sum revenue by month
        const monthRevenue = {
            'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0,
            'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
        };
    
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Sum revenue by month from assignedOrders (only for completed/delivered orders)
        assignedOrders.forEach(order => {
            // Only count revenue for completed orders
            if (order.status === 'completed' || order.status === 'delivered' || order.currentStatus === 'completed' || order.currentStatus === 'delivered') {
                // Use scheduleAt if available, otherwise use createdAt
                const orderDate = new Date(order.scheduleAt || order.createdAt);
                const monthName = monthNames[orderDate.getMonth()];
                
                // Use fare field as the primary revenue source
                const orderAmount = order.fare || 0;
                
                if (monthRevenue.hasOwnProperty(monthName)) {
                    monthRevenue[monthName] += orderAmount;
                }
            }
        });
    
        // Return data for last 6 months
        const currentMonth = new Date().getMonth();
        const last6Months = [];
        
        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            const monthName = monthNames[monthIndex];
            last6Months.push({
                month: monthName,
                value: monthRevenue[monthName]
            });
        }
    
        return last6Months;
    };

    const generateOrdersData = () => {
        // If no assigned orders, return zeros
        if (!assignedOrders || assignedOrders.length === 0) {
            return [
                { month: 'Jan', value: 0 }, { month: 'Feb', value: 0 }, { month: 'Mar', value: 0 },
                { month: 'Apr', value: 0 }, { month: 'May', value: 0 }, { month: 'Jun', value: 0 }
            ];
        }
    
        // Create an object to count orders by month
        const monthCounts = {
            'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0,
            'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
        };
    
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Count orders by month from assignedOrders
        assignedOrders.forEach(order => {
            // Use scheduleAt if available, otherwise use createdAt
            const orderDate = new Date(order.scheduleAt || order.createdAt);
            const monthName = monthNames[orderDate.getMonth()];
            
            if (monthCounts.hasOwnProperty(monthName)) {
                monthCounts[monthName]++;
            }
        });
    
        // Return data for last 6 months (you can modify this logic as needed)
        const currentMonth = new Date().getMonth();
        const last6Months = [];
        
        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            const monthName = monthNames[monthIndex];
            last6Months.push({
                month: monthName,
                value: monthCounts[monthName]
            });
        }
    
        return last6Months;
    };

    // Revenue Chart
    useLayoutEffect(() => {
        const timer = setTimeout(() => {
            const chartElement = document.getElementById("revenueChart");
            if (!chartElement) return;

            if (revenueChartRef.current) {
                revenueChartRef.current.dispose();
            }

            try {
                const root = am5.Root.new("revenueChart");
                revenueChartRef.current = root;
                
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
                        name: "Revenue", 
                        xAxis, 
                        yAxis, 
                        valueYField: "value", 
                        categoryXField: "month",
                        stroke: am5.color("#10b981")
                    })
                );

                series.strokes.template.setAll({ strokeWidth: 3 });
                series.bullets.push(() => {
                    return am5.Bullet.new(root, {
                        sprite: am5.Circle.new(root, {
                            radius: 4,
                            fill: am5.color("#10b981")
                        })
                    });
                });

                const chartData = generateRevenueData();
                series.data.setAll(chartData);
                xAxis.data.setAll(chartData);
                chart.set("cursor", am5xy.XYCursor.new(root, {}));

            } catch (error) {
                console.error("Error creating revenue chart:", error);
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            if (revenueChartRef.current) {
                revenueChartRef.current.dispose();
                revenueChartRef.current = null;
            }
        };
    }, [assignedOrders]); // Dependency is fine, it's a consistent empty array

    // Orders Chart
    useLayoutEffect(() => {
        const timer = setTimeout(() => {
            const chartElement = document.getElementById("ordersChart");
            if (!chartElement) return;

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
                        fill: am5.color("#3b82f6")
                    })
                );

                const chartData = generateOrdersData();
                series.data.setAll(chartData);
                xAxis.data.setAll(chartData);
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
    }, [assignedOrders]); // Dependency is fine, it's a consistent empty array

    // Cleanup on unmount for both charts
    useLayoutEffect(() => {
        return () => {
            if (revenueChartRef.current) {
                revenueChartRef.current.dispose();
            }
            if (ordersChartRef.current) {
                ordersChartRef.current.dispose();
            }
        };
    }, []);

    // Calculate stats using dashboardStats where available
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [revenueLoading, setRevenueLoading] = useState(false);

    // Function to fetch and calculate total revenue
    const calculateTotalRevenue = async () => {
        if (!transporterData.assignedBookings || transporterData.assignedBookings.length === 0) {
            setTotalRevenue(0);
            return;
        }

        setRevenueLoading(true);
        try {
            // You'll need to create this API function to fetch order details by IDs
            const orderDetailsPromises = transporterData.assignedBookings.map(orderId => 
                fetch(`/api/orders/${orderId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(res => res.json())
            );

            const orderDetails = await Promise.all(orderDetailsPromises);

            const revenue = orderDetails.reduce((total, order) => {
                // Check different possible amount fields in your order model
                const orderAmount = order.finalBidAmount || order.fare || order.amount || order.price || 0;
                return total + orderAmount;
            }, 0);

            setTotalRevenue(revenue);
        } catch (error) {
            console.error('Error calculating revenue:', error);
            setTotalRevenue(0);
        } finally {
            setRevenueLoading(false);
        }
    };

    // Call this function when component mounts or when assignedBookings change
    useEffect(() => {
        if (transporterData && transporterData.assignedBookings) {
            calculateTotalRevenue();
        }
    }, [transporterData.assignedBookings])
    
    // Use dashboardStats for aggregate counts as provided by the backend controller
    const totalTrucks = transporterData.trucks?.length; 
    const activeOrdersCount = assignedOrders.length; // Fallback to 0
    const completedOrdersCount = transporterData.deliveredOrders ?? 0; // Fallback to 0
    
    const availableTrucks = trucks.filter(t => 
        t.status === 'active' || !t.status 
    ).length;

    // Add truck form state and handler
    const [truckForm, setTruckForm] = useState({
        registrationNumber: '',
        vehicleType: '',
        capacity: '',
        dimensions: { length: '', width: '', height: '' },
        documents: null
    });

    // Profile update form state and handler
    const [profileForm, setProfileForm] = useState({
        transporterName: transporterData.transporterName || '',
        email: transporterData.email || '',
        contactNo: transporterData.contactNo || '',
        address: transporterData.address || {}
    });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(profileForm);
            setShowProfileModal(false);
            queryClient.invalidateQueries('userProfile');
            alert('Profile updated successfully');
        } catch (error) {
            alert('Failed to update profile: ' + error.message);
        }
    };

    // Document upload handler
    const handleDocumentUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('document', file);
        formData.append('type', type);

        try {
            await uploadDocument(formData);
            queryClient.invalidateQueries('userProfile');
            alert('Document uploaded successfully');
        } catch (error) {
            alert('Failed to upload document: ' + error.message);
        }
    };

    // ...existing code until modals...

    return (
        <div className="min-h-screen bg-gray-100 p-6 text-[#192a67] font-inter">
            {/* Header with Profile */}
            <div className="mt-20 mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <img 
                                src={transporterData.profileImg || "https://placehold.co/150x150/e0e0e0/ffffff?text=Profile"}
                                alt="Profile" 
                                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            {transporterData.isVerified && (
                                <FaCheckCircle className="absolute -bottom-1 -right-1 text-green-500 text-xl bg-white rounded-full" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">
                                {transporterData.transporterName || 'Transporter Name'}
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Owner: {transporterData.ownerName || 'Owner Name'}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1">
                                    <FaStar className="text-yellow-400" />
                                    <span className="font-semibold">{transporterData.rating || transporterData.rating || 0}</span> 
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaShieldAlt className={`${transporterData.isVerified ? 'text-green-500' : 'text-red-500'}`} />
                                    <span className={`text-sm ${transporterData.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                                        {transporterData.isVerified ? 'Verified' : 'Not Verified'}
                                    </span>
                                </div>
                                {transporterData.registrationNumber && (
                                    <div className="flex items-center gap-1">
                                        <FaFileAlt className="text-blue-500" />
                                        <span className="text-sm text-gray-600">
                                            Reg: {transporterData.registrationNumber}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowProfileModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                        >
                            <FaEdit /> Edit Profile
                        </button>
                        <button 
                            onClick={() => navigate("/transporter/view-trucks")}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                        >
                            <FaPlus /> Add Truck
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { 
                        title: "Total Revenue", 
                        value: `₹${totalRevenue.toLocaleString()}`, 
                        subtitle: "Requires order data population",
                        icon: <FaWallet />,
                        color: "text-green-500",
                        bgColor: "bg-green-50"
                    },
                    { 
                        title: "Active Orders", 
                        value: activeOrdersCount, 
                        subtitle: `${activeOrdersCount} assigned bookings`,
                        icon: <FaClipboardList />,
                        color: "text-blue-500",
                        bgColor: "bg-blue-50"
                    },
                    { 
                        title: "Fleet Size", 
                        value: totalTrucks, 
                        subtitle: "Total registered trucks",
                        icon: <FaTruck />,
                        color: "text-purple-500",
                        bgColor: "bg-purple-50"
                    },
                    { 
                        title: "Available Trucks", 
                        value: availableTrucks, 
                        subtitle: "Ready for assignment",
                        icon: <FaRoute />,
                        color: "text-yellow-500",
                        bgColor: "bg-yellow-50"
                    },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 shadow hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <div className={`${stat.color} ${stat.bgColor} p-3 rounded-lg text-2xl`}>
                                {stat.icon}
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-500 text-sm">{stat.title}</p>
                                <p className="text-2xl font-bold text-[#192a67]">{stat.value}</p>
                                {stat.subtitle && (
                                    <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-5 rounded-xl shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <FaChartLine className="text-green-500" />
                            Monthly Revenue
                        </h2>
                        {/* Message for no data */}
                        {assignedOrders.length === 0 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">No Detailed Order Data for Charts</span>
                        )}
                    </div>
                    <div id="revenueChart" className="w-full h-72"></div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <FaClipboardList className="text-blue-500" />
                            Monthly Orders
                        </h2>
                        {/* Message for no data */}
                        {assignedOrders.length === 0 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">No Detailed Order Data for Charts</span>
                        )}
                    </div>
                    <div id="ordersChart" className="w-full h-72"></div>
                </div>
            </div>

            {/* Recent Orders & Fleet Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Recent Orders */}
                <div className="bg-white p-5 rounded-xl shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Recent Orders</h2>
                        <button className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                            <FaEye /> View All
                        </button>
                    </div>
                    <div className="space-y-3">
                        {assignedOrders.length === 0 ? (
                            <div className="text-center py-8">
                                <FaClipboardList className="text-gray-400 text-4xl mx-auto mb-2" />
                                <p className="text-gray-500">
                                    No recent order details available. <br/>
                                    Backend needs to provide individual order data.
                                </p>
                            </div>
                        ) : (
                            // This section will not render any orders as assignedOrders is empty
                            // unless backend is updated to provide recent orders.
                            assignedOrders.slice(0, 3).map((order) => (
                                <div key={order._id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-green-500 text-sm" />
                                            <span className="font-semibold text-sm">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            order.status === 'completed' || order.status === 'delivered'
                                                ? 'bg-green-100 text-green-700'
                                                : order.status === 'in_transit'
                                                ? 'bg-blue-100 text-blue-700'
                                                : order.status === 'accepted'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {order.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {order.pickupLocation?.address || 'Pickup Location'} → {' '}
                                        {order.dropLocations?.[0]?.address || 'Drop Location'}
                                    </p>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-semibold text-green-600">
                                            ₹{(order.finalBidAmount || order.fare || 0).toLocaleString()}
                                        </span>
                                        <span className="text-gray-500">
                                            {new Date(order.scheduleAt || order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Fleet Status */}
                <div className="bg-white p-5 rounded-xl shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Fleet Status</h2>
                        <button 
                            onClick={() => navigate("/transporter/view-trucks")}
                            className="text-green-600 hover:text-green-800 flex items-center gap-2"
                        >
                            <FaPlus /> Add Truck
                        </button>
                    </div>
                    <div className="space-y-3">
                        {trucks.length === 0 ? (
                            <div className="text-center py-8">
                                <FaTruck className="text-gray-400 text-4xl mx-auto mb-2" />
                                <p className="text-gray-500 mb-2">No trucks added yet</p>
                                <button 
                                    onClick={() => navigate("/transporter/view-trucks")}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                >
                                    Add your first truck
                                </button>
                            </div>
                        ) : (
                            trucks.map((truck) => (
                                <div key={truck._id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">
                                                {truck.vehicleNumber || truck.registrationNumber || 'N/A'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {truck.vehicleType || truck.type || 'Unknown Type'}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            truck.status === 'available' || !truck.status
                                                ? 'bg-green-100 text-green-700'
                                                : truck.status === 'in_transit'
                                                ? 'bg-blue-100 text-blue-700'
                                                : truck.status === 'maintenance'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {truck.status ? truck.status.replace('_', ' ').toUpperCase() : 'AVAILABLE'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-[#192a67] to-blue-800 text-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                        <FaPhone className="text-yellow-300 text-xl" />
                        <div>
                            <p className="text-yellow-300 text-sm">Phone</p>
                            <p className="font-semibold">{transporterData.contactNo || 'Not provided'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <FaEnvelope className="text-yellow-300 text-xl" />
                        <div>
                            <p className="text-yellow-300 text-sm">Email</p>
                            <p className="font-semibold">{transporterData.email || 'Not provided'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <FaMapPin className="text-yellow-300 text-xl" />
                        <div>
                            <p className="text-yellow-300 text-sm">Location</p>
                            <p className="font-semibold">
                                {transporterData.address?.city || 'City'}, {transporterData.address?.state || 'State'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals would go here - Add Truck Modal, Profile Modal etc. */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 relative">
                        <button
                            onClick={() => setShowProfileModal(false)}
                            className="absolute top-4 right-4 text-red-500 text-2xl hover:text-red-700 transition"
                        >
                            <IoClose />
                        </button>
                        <h3 className="text-2xl font-bold mb-6 text-[#192a67]">Edit Profile</h3>
                        
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Transporter Name
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.transporterName}
                                    onChange={(e) => setProfileForm({
                                        ...profileForm,
                                        transporterName: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm({
                                        ...profileForm,
                                        email: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.contactNo}
                                    onChange={(e) => setProfileForm({
                                        ...profileForm,
                                        contactNo: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.address.city}
                                    onChange={(e) => setProfileForm({
                                        ...profileForm,
                                        address: { ...profileForm.address, city: e.target.value }
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="City"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    State
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.address.state}
                                    onChange={(e) => setProfileForm({
                                        ...profileForm,
                                        address: { ...profileForm.address, state: e.target.value }
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="State"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowProfileModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showDocumentsModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 relative">
                        <button
                            onClick={() => setShowDocumentsModal(false)}
                            className="absolute top-4 right-4 text-red-500 text-2xl hover:text-red-700 transition"
                        >
                            <IoClose />
                        </button>
                        <h3 className="text-2xl font-bold mb-6 text-[#192a67]">Manage Documents</h3>
                        <p className="text-gray-600">Document management functionality would be implemented here...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransporterDashboard;
