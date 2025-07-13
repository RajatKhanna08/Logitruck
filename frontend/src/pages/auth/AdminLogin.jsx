import React, { useState } from 'react';
import { FaLock, FaEnvelope } from 'react-icons/fa';

const AdminLogin = () => {
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
        console.log("Admin login submitted:", adminData);
        // Add API call here
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
            {/* Logo */}
            <img src="/LogiTruckLogo.png" alt="Logo" className="w-75 mb-10" />

            {/* Login Container */}
            <form
                onSubmit={handleLogin}
                className="w-[400px] bg-white p-8 rounded-lg shadow-xl flex flex-col gap-6"
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
                        required
                        className="w-full outline-none"
                    />
                </div>

                <div className="flex items-center border rounded px-3 py-2 bg-white">
                    <FaLock className="text-gray-500 mr-2" />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={adminData.password}
                        onChange={handleChange}
                        required
                        className="w-full outline-none"
                    />
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