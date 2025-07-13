import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaBuilding, FaUserTie } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa6";

const RoleSelectorPage = () => {
    const navigate = useNavigate();

    const roles = [
        {
            name: "Company",
            icon: <FaBuilding size={30} />,
            loginPath: "/company/register",
        },
        {
            name: "Transporter",
            icon: <FaTruck size={30} />,
            loginPath: "/transporter/register",
        },
        {
            name: "Driver",
            icon: <FaUserTie size={30} />,
            loginPath: "/driver/register", // Create this route later
        },
        {
            name: "Admin",
            icon: <FaUserShield size={30} />,
            loginPath: "/admin/login", // Add or adjust the route as needed
        }
    ];

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-[#f0f4ff] via-white to-[#e0eaff]">
            {/* Logo */}
            <img onClick={() => navigate("/")} src="/LogiTruckLogo.png" alt="Logo" className="w-60 cursor-pointer mb-6" />

            {/* Headings */}
            <h1 className="text-4xl font-bold text-[#192a67] text-center mb-2">
                Welcome to LogiTruck
            </h1>
            <p className="text-gray-600 text-lg mb-10 text-center">
                Choose your role to log in or register your account
            </p>

            {/* Role Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
                {roles.map((role, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(role.loginPath)}
                        className="relative bg-white/70 backdrop-blur-md hover:scale-105 transition-transform duration-300 shadow-xl rounded-2xl px-8 py-10 flex flex-col items-center justify-center text-center border border-gray-200 hover:border-yellow-300 cursor-pointer"
                    >
                        <div className="text-[#192a67] mb-4">{role.icon}</div>
                        <h2 className="text-xl font-semibold text-[#192a67]">{role.name}</h2>
                        <p className="text-sm text-gray-600 mt-2">Login / Signup as {role.name}</p>
                    </div>
                ))}
            </div>
          
            {/* Footer */}
            <div className="mt-20 text-sm text-gray-500">
                © {new Date().getFullYear()} LogiTruck. All rights reserved.
            </div>
    </div>
    );
};

export default RoleSelectorPage;