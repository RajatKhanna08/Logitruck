import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

// Icons
import { FaUser, FaPhoneAlt, FaEnvelope, FaLock, FaTruck, FaClock, FaMapMarkedAlt, FaIdCard, FaCarSide } from 'react-icons/fa';
import { HiIdentification } from 'react-icons/hi';
import { MdUploadFile } from 'react-icons/md';

const DriverLoginSignup = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paramsEmail = params.get("email");

    const [isSignUp, setIsSignUp] = useState(false);
    const [step, setStep] = useState(1);

    const [signupData, setSignupData] = useState({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        vehicleType: "",
        experience: "",
        idProof: null,
        license: null
    });

    const [loginData, setLoginData] = useState({
        email: paramsEmail || "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setSignupData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setSignupData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Login Data Submitted:", loginData);
        setLoginData({ email: '', password: '' });
    };

    const handleSignup = () => {
        console.log("Signup Data Submitted:", signupData);
        // Reset form
        setSignupData({
            fullName: "",
            phone: "",
            email: "",
            password: "",
            vehicleType: "",
            experience: "",
            idProof: null,
            license: null
        });
        setStep(1);
    };

    const renderStep = () => {
        const inputStyle = "flex items-center gap-2 p-2 border rounded outline-none bg-white";

        switch (step) {
            case 1:
                return (
                    <div className='flex flex-col gap-4 min-h-80'>
                        <div className={inputStyle}>
                            <FaUser />
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={signupData.fullName}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
                        <div className={inputStyle}>
                            <FaPhoneAlt />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={signupData.phone}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
                        <div className={inputStyle}>
                            <FaEnvelope />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={signupData.email}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
                        <div className={inputStyle}>
                            <FaLock />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={signupData.password}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="flex flex-col gap-4 min-h-80">
                        {/* ID Proof Upload */}
                        <label className={inputStyle + " flex-col items-start"}>
                            <span className="flex items-center gap-2">
                                <HiIdentification />
                                <span className="text-sm text-gray-600">Upload ID Proof</span>
                            </span>
                            <input
                                type="file"
                                name="idProof"
                                accept="image/*,application/pdf"
                                onChange={handleChange}
                                className="w-full mt-1"
                            />
                            {signupData.idProof && (
                                <span className="text-xs text-gray-500 mt-1">
                                    Selected File: {signupData.idProof.name}
                                </span>
                            )}
                        </label>
                        
                        {/* License Upload */}
                        <label className={inputStyle + " flex-col items-start"}>
                            <span className="flex items-center gap-2">
                                <MdUploadFile />
                                <span className="text-sm text-gray-600">Upload License</span>
                            </span>
                            <input
                                type="file"
                                name="license"
                                accept="image/*,application/pdf"
                                onChange={handleChange}
                                className="w-full mt-1"
                            />
                            {signupData.license && (
                                <span className="text-xs text-gray-500 mt-1">
                                    Selected File: {signupData.license.name}
                                </span>
                            )}
                        </label>
                    </div>
                );

            case 3:
                return (
                    <div className="flex flex-col gap-4 min-h-80">
                        <div className={inputStyle}>
                            <FaCarSide />
                            <input
                                type="text"
                                name="vehicleType"
                                placeholder="Vehicle Type"
                                value={signupData.vehicleType}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
                        <div className={inputStyle}>
                            <FaClock />
                            <input
                                type="number"
                                name="experience"
                                placeholder="Experience (Years)"
                                value={signupData.experience}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-between bg-gray-100">
            <div className='w-full mt-10 flex justify-center items-start'>
                <img src="/LogiTruckLogo.png" className='w-90' />
            </div>

            <div className="mb-20 relative w-[900px] h-[550px] bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden">
                <div className="w-full flex items-center justify-between z-10">
                    {/* LOGIN FORM */}
                    <form className={`w-1/2 p-10 flex flex-col gap-4`}>
                        <h2 className="text-3xl text-center font-bold text-[#192a67] mb-2">Driver Login</h2>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={loginData.email}
                            onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                            className="p-2 border rounded outline-none"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                            className="p-2 border rounded outline-none"
                        />
                        <button type="submit" onClick={handleLogin} className="bg-yellow-300 py-2 rounded font-semibold">
                            Login
                        </button>
                    </form>

                    {/* SIGN UP FORM */}
                    <form className="w-1/2 p-10 flex flex-col gap-2">
                        <h2 className="text-3xl text-center font-bold text-[#192a67] mb-2">Driver Signup</h2>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-gray-200 rounded overflow-hidden mb-4">
                            <div className={`h-full bg-yellow-300 transition-all duration-500`} style={{ width: `${(step / 3) * 100}%` }}></div>
                        </div>

                        {renderStep()}

                        <div className="flex justify-between items-center mt-4">
                            {step > 1 && (
                                <button type="button" onClick={() => setStep(step - 1)} className="bg-yellow-300 py-2 px-4 rounded font-semibold">Back</button>
                            )}
                            <button type="button" onClick={step < 3 ? () => setStep(step + 1) : handleSignup} className="bg-yellow-300 py-2 px-4 rounded font-semibold">
                                {step < 3 ? "Next" : "Signup"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Overlay Panel */}
                <div className={`z-20 absolute top-0 h-full w-1/2 bg-[#192a67] text-white flex flex-col items-center justify-center p-10 transition-all duration-700 ease-in-out ${isSignUp ? "left-0 rounded-l-xl" : "left-1/2 rounded-r-xl"}`}>
                    <div className='h-1/2 flex flex-col justify-end'>
                        <h2 className="text-3xl text-center font-bold mb-4">
                            {isSignUp ? "Welcome to the Driver Portal" : "Welcome Back Driver"}
                        </h2>
                        <p className="mb-6 text-center">
                            {isSignUp ? "Let’s get you on the road!" : "Login and check your bookings."}
                        </p>
                    </div>
                    <div className='flex w-full h-1/2 flex-col justify-end gap-3'>
                        {!isSignUp && <p className='text-center'>New here? <br /> Register as a driver now!</p>}
                        {isSignUp && <p className='text-center'>Already Registered? <br /> Login to your account</p>}
                        <button
                            onClick={() => {
                                setStep(1);
                                setIsSignUp(!isSignUp);
                            }}
                            className="bg-yellow-300 cursor-pointer text-black font-semibold px-6 py-2 rounded"
                        >
                            {isSignUp ? "Login" : "Signup"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverLoginSignup;
