import React, { useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { FaTruck, FaRoute, FaWallet, FaClipboardList } from "react-icons/fa";

const CompanyDashboard = () => {
    // Bar chart for Orders
    useLayoutEffect(() => {
        const root = am5.Root.new("ordersChart");
        root.setThemes([am5themes_Animated.new(root)]);

        const chart = root.container.children.push(am5xy.XYChart.new(root, {
            layout: root.verticalLayout,
        }));

        const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: "month",
            renderer: am5xy.AxisRendererX.new(root, {})
        }));

        const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
        }));

        const series = chart.series.push(am5xy.ColumnSeries.new(root, {
            name: "Orders",
            xAxis,
            yAxis,
            valueYField: "value",
            categoryXField: "month"
        }));

        series.data.setAll([
            { month: "Jan", value: 30 },
            { month: "Feb", value: 50 },
            { month: "Mar", value: 40 },
            { month: "Apr", value: 70 },
            { month: "May", value: 90 },
        ]);

        xAxis.data.setAll(series.dataItems.map(item => item.dataContext));

        return () => root.dispose();
    }, []);

    // Line chart for Earnings
    useLayoutEffect(() => {
        const root = am5.Root.new("earningsChart");
        root.setThemes([am5themes_Animated.new(root)]);

        const chart = root.container.children.push(am5xy.XYChart.new(root, {
            layout: root.verticalLayout,
        }));

        const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: "month",
            renderer: am5xy.AxisRendererX.new(root, {})
        }));

        const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
        }));

        const series = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Earnings",
            xAxis,
            yAxis,
            valueYField: "value",
            categoryXField: "month"
        }));

        series.strokes.template.setAll({ strokeWidth: 2 });
        series.data.setAll([
            { month: "Jan", value: 1000 },
            { month: "Feb", value: 2500 },
            { month: "Mar", value: 2000 },
            { month: "Apr", value: 3200 },
            { month: "May", value: 4000 },
        ]);

        xAxis.data.setAll(series.dataItems.map(item => item.dataContext));

        return () => root.dispose();
    }, []);

    return (
        <div className="pt-30 min-h-screen bg-gray-100 p-6 text-[#192a67]">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold">Welcome back, LogiTruck Partner!</h1>
                <p className="text-gray-500">Here's what's happening with your company.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[
                    { title: "Total Orders", value: "548", icon: <FaClipboardList /> },
                    { title: "Earnings", value: "₹1,50,000", icon: <FaWallet /> },
                    { title: "Vehicles Active", value: "18", icon: <FaTruck /> },
                    { title: "Routes Used", value: "36", icon: <FaRoute /> },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 shadow hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <div className="text-yellow-400 text-3xl">{stat.icon}</div>
                            <div>
                                <p className="text-gray-500 text-sm">{stat.title}</p>
                                <p className="text-2xl font-bold text-[#192a67]">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-5 rounded-xl shadow">
                    <h2 className="text-xl font-bold mb-4">Monthly Orders</h2>
                    <div id="ordersChart" className="w-full h-72"></div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow">
                    <h2 className="text-xl font-bold mb-4">Earnings Overview</h2>
                    <div id="earningsChart" className="w-full h-72"></div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white p-5 rounded-xl shadow mb-6">
                <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-yellow-300 text-[#192a67]">
                            <th className="py-2 px-4">Order ID</th>
                            <th className="py-2 px-4">Route</th>
                            <th className="py-2 px-4">Vehicle</th>
                            <th className="py-2 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { id: "LT548", route: "Delhi → Mumbai", vehicle: "Truck A", status: "Delivered" },
                            { id: "LT549", route: "Pune → Kolkata", vehicle: "Truck B", status: "In Transit" },
                            { id: "LT550", route: "Hyderabad → Chennai", vehicle: "Truck C", status: "Pending" },
                        ].map((order, i) => (
                            <tr key={i} className="hover:bg-gray-100 transition">
                                <td className="py-2 px-4 font-semibold">{order.id}</td>
                                <td className="py-2 px-4">{order.route}</td>
                                <td className="py-2 px-4">{order.vehicle}</td>
                                <td className="py-2 px-4 text-green-600 font-semibold">{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#192a67] text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-bold">Need to perform quick actions?</h3>
                    <p className="text-yellow-300">Book an order, upload documents or update your company profile now.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <button className="bg-yellow-300 text-[#192a67] font-bold px-4 py-2 rounded hover:bg-yellow-400">Book Order</button>
                    <button className="border border-yellow-300 text-yellow-300 px-4 py-2 rounded hover:bg-yellow-300 hover:text-[#192a67] font-bold">Upload Docs</button>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;