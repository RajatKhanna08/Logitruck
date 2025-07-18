import React, { useLayoutEffect } from 'react';
import { useOrders } from '../../hooks/useOrder'; // custom hook
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { FaTruck, FaRoute, FaWallet, FaClipboardList } from "react-icons/fa";

const CompanyDashboard = () => {
  const { data: allOrders = [], isLoading, isError } = useOrders();

  // Chart: Monthly Orders
  useLayoutEffect(() => {
    const root = am5.Root.new("ordersChart");
    root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { layout: root.verticalLayout }));
    const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "month", renderer: am5xy.AxisRendererX.new(root, {}) }));
    const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    const series = chart.series.push(am5xy.ColumnSeries.new(root, { name: "Orders", xAxis, yAxis, valueYField: "value", categoryXField: "month" }));

    const monthlyOrdersData = allOrders.length
      ? allOrders.reduce((acc, order) => {
          const m = new Date(order.scheduleAt).toLocaleString('default', { month: 'short' });
          acc[m] = (acc[m] || 0) + 1;
          return acc;
        }, {})
      : { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0 };

    const chartData = Object.entries(monthlyOrdersData).map(([month, value]) => ({ month, value }));
    series.data.setAll(chartData);
    xAxis.data.setAll(series.dataItems.map(item => item.dataContext));

    return () => root.dispose();
  }, [allOrders]);

  // Chart: Earnings Overview
  useLayoutEffect(() => {
    const root = am5.Root.new("earningsChart");
    root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(am5xy.XYChart.new(root, { layout: root.verticalLayout }));
    const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, { categoryField: "month", renderer: am5xy.AxisRendererX.new(root, {}) }));
    const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) }));
    const series = chart.series.push(am5xy.LineSeries.new(root, { name: "Earnings", xAxis, yAxis, valueYField: "value", categoryXField: "month" }));
    series.strokes.template.setAll({ strokeWidth: 2 });

    const monthlyEarningsData = allOrders.length
      ? allOrders.reduce((acc, order) => {
          const m = new Date(order.scheduleAt).toLocaleString('default', { month: 'short' });
          acc[m] = (acc[m] || 0) + (order.finalBidAmount || 0);
          return acc;
        }, {})
      : { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0 };

    const chartData = Object.entries(monthlyEarningsData).map(([month, value]) => ({ month, value }));
    series.data.setAll(chartData);
    xAxis.data.setAll(series.dataItems.map(item => item.dataContext));

    return () => root.dispose();
  }, [allOrders]);

  // Stats
  const totalOrders = allOrders.length;
  const totalEarnings = allOrders.reduce((sum, o) => sum + (o.finalBidAmount || 0), 0);
  const ordersActive = new Set(allOrders.map(o => o._id)).size;
  const routesUsed = new Set(allOrders.map(o => o.pickupLocation.address + '->' + o.dropLocations.map(d => d.address).join(',')).values()).size;

  return (
    <div className="pt-30 min-h-screen bg-gray-100 p-6 text-[#192a67]">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">Welcome back, LogiTruck Partner!</h1>
        <p className="text-gray-500">Here's what's happening with your company.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Orders", value: totalOrders, icon: <FaClipboardList /> },
          { title: "Earnings", value: `₹${totalEarnings.toLocaleString()}`, icon: <FaWallet /> },
          { title: "Orders Active", value: ordersActive, icon: <FaTruck /> },
          { title: "Routes Used", value: routesUsed, icon: <FaRoute /> },
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
      <div className="bg-white p-5 rounded-xl shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-blue-600" />
          </div>
        ) : allOrders.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No recent orders to display.</p>
        ) : (
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
              {allOrders.slice(0, 5).map((order) => (
                <tr key={order._id} className="hover:bg-gray-100 transition">
                  <td className="py-2 px-4 font-semibold">{order._id.slice(-6).toUpperCase()}</td>
                  <td className="py-2 px-4">
                    {order.pickupLocation.address} → {order.dropLocations.map(d => d.address).join(', ')}
                  </td>
                  <td className="py-2 px-4">{order.acceptedTruckId?.vehicleNumber || "N/A"}</td>
                  <td className="py-2 px-4 text-green-600 font-semibold">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
