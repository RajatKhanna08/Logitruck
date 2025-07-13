import React, { useState } from 'react';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const [adminData, setAdminData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (!validateLogin()) return;

        console.log("Admin login submitted:", adminData);
        // Add API call here
    };

    const validateLogin = () => {
        const loginErrors = {};

        if (!adminData.email.trim()) {
            loginErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminData.email)) {
            loginErrors.email = "Invalid email format";
        }

        if (!adminData.password.trim()) {
            loginErrors.password = "Password is required";
        } else if (adminData.password.length < 6) {
            loginErrors.password = "Password must be at least 6 characters";
        }

        setErrors(loginErrors);
        return Object.keys(loginErrors).length === 0;
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
            {/* Logo */}
            <img onClick={() => navigate("/")} src="/LogiTruckLogo.png" alt="Logo" className="w-75 cursor-pointer mb-10" />

            {/* Login Container */}
            <form
                onSubmit={handleLogin}
                className="relative w-[400px] bg-white p-8 rounded-lg shadow-xl flex flex-col gap-6"
            >
                <h2 className="text-3xl text-center font-bold text-[#192a67]">Admin Login</h2>

                <div className="flex items-center border rounded px-3 py-2 bg-white">
                    <FaEnvelope className="text-gray-500 mr-2" />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={adminData.email}
                        onChange={handleChange}
                        className="w-full outline-none"
                    />
                    {errors.email && <p className="text-red-500 absolute top-25 right-12 text-sm mt-1 ml-1">{errors.email}</p>}
                </div>

                <div className="flex items-center border rounded px-3 py-2 bg-white">
                    <FaLock className="text-gray-500 mr-2" />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={adminData.password}
                        onChange={handleChange}
                        className="w-full outline-none"
                    />
                    {errors.password && <p className="text-red-500 absolute top-41 right-12 text-sm mt-1 ml-1">{errors.password}</p>}
                </div>

                <button
                    type="submit"
                    className="bg-yellow-300 hover:bg-yellow-400 transition duration-300 text-black font-bold py-2 rounded"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;