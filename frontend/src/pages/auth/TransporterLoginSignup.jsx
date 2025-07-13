import React, { useState } from 'react';

//Icons
import { FaBuilding, FaEnvelope, FaLock, FaIndustry, FaUserTie, FaLandmark, FaGlobeAsia, FaStreetView, FaPhoneAlt } from 'react-icons/fa';
import { FaCity } from 'react-icons/fa6';
import { HiOutlineIdentification } from 'react-icons/hi';
import { TbMapPinCode } from "react-icons/tb";
import { useLocation } from 'react-router-dom';

const TransporterLoginSignup = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [step, setStep] = useState(1);

    const [signupData, setSignupData] = useState({
        transporterName: '',
        ownerName: '',
        contactNo: '',
        email: '',
        password: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: '',
            country: '',
            landmark: ''
        },
        registrationNumber: '',
        industry: '',
        fleetSize: '',
        documents: {
            idProof: '',
            businessLicense: '',
            gstCertificate: ''
        }
    });
    
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
          
        if (name.startsWith("address.")) {
            const field = name.split(".")[1];
            setSignupData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: value
                }
            }));
        }
        else if(name.startsWith("documents.")){
            const field = name.split(".")[1];
            setSignupData(prev => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    [field]: files[0]
                }
            }));
        }
        else{
            setSignupData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
        else handleSubmit();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            for (let key in signupData) {
                if (key === "address" || key === "documents") {
                    for (let subKey in signupData[key]) {
                        formData.append(`${key}.${subKey}`, signupData[key][subKey]);
                    }
                }
                else{
                  formData.append(key, signupData[key]);
                }
            }
          
            // Make API call to your backend (adjust the URL as needed)
            const res = await fetch("/api/transporter/register", {
                method: "POST",
                body: formData
            });
          
            const data = await res.json();
          
            if (res.ok) {
                console.log("Signup successful:", data);
                setStep(1);
                setSignupData({
                    transporterName: '',
                    ownerName: '',
                    contactNo: '',
                    email: '',
                    password: '',
                    address: {
                        street: '',
                        city: '',
                        state: '',
                        pincode: '',
                        country: '',
                        landmark: ''
                    },
                    registrationNumber: '',
                    documents: {
                        idProof: null,
                        businessLicense: null,
                        gstCertificate: null
                    },
                    fleetSize: ''
                });
            }
            else{
                alert(data.message || "Signup failed");
            }
        }
        catch (err) {
            console.error("Signup error:", err);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setLoginData({ email: '', password: '' });
        console.log("Login Data Submitted:", loginData);
        // API call for login goes here
    };

    const renderStep = () => {
        const inputStyle = "flex items-center gap-2 p-2 border rounded outline-none bg-white";

        switch (step) {
            case 1:
                return (
                    <div className="flex flex-col gap-4 min-h-80">
                        <div className={inputStyle}>
                            <FaBuilding className="text-gray-500" />
                            <input
                                type="text"
                                name="transporterName"
                                placeholder="Transporter Name"
                                value={signupData.transporterName}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
                        <div className={inputStyle}>
                            <FaUserTie className="text-gray-500" />
                            <input
                                type="text"
                                name="ownerName"
                                placeholder="Owner Name"
                                value={signupData.ownerName}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
                    </div>
                );
            
            case 2:
                return (
                    <div className="flex flex-col gap-4 min-h-80">
                        <div className={inputStyle}>
                            <FaPhoneAlt className="text-gray-500" />
                            <input
                                type="text"
                                name="contactNo"
                                placeholder="Contact Number"
                                value={signupData.contactNo}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
                        <div className={inputStyle}>
                            <FaEnvelope className="text-gray-500" />
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
                            <FaLock className="text-gray-500" />
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
            
            case 3:
              return (
                <div className="flex flex-col gap-4 min-h-80">
                  <div className="grid grid-cols-2 gap-3">
                    <div className={inputStyle}>
                      <FaStreetView className="text-gray-500" />
                      <input
                        type="text"
                        name="address.street"
                        placeholder="Street"
                        value={signupData.address.street}
                        onChange={handleChange}
                        className="w-full outline-none"
                      />
                    </div>
                    <div className={inputStyle}>
                      <FaCity className="text-gray-500" />
                      <input
                        type="text"
                        name="address.city"
                        placeholder="City"
                        value={signupData.address.city}
                        onChange={handleChange}
                        className="w-full outline-none"
                      />
                    </div>
                    <div className={inputStyle}>
                      <FaCity className="text-gray-500" />
                      <input
                        type="text"
                        name="address.state"
                        placeholder="State"
                        value={signupData.address.state}
                        onChange={handleChange}
                        className="w-full outline-none"
                      />
                    </div>
                    <div className={inputStyle}>
                      <TbMapPinCode className="text-gray-500" />
                      <input
                        type="number"
                        name="address.pincode"
                        placeholder="Pincode"
                        value={signupData.address.pincode}
                        onChange={handleChange}
                        className="w-full outline-none"
                      />
                    </div>
                    <div className={inputStyle}>
                      <FaGlobeAsia className="text-gray-500" />
                      <input
                        type="text"
                        name="address.country"
                        placeholder="Country"
                        value={signupData.address.country}
                        onChange={handleChange}
                        className="w-full outline-none"
                      />
                    </div>
                    <div className={inputStyle}>
                      <FaLandmark className="text-gray-500" />
                      <input
                        type="text"
                        name="address.landmark"
                        placeholder="Landmark"
                        value={signupData.address.landmark}
                        onChange={handleChange}
                        className="w-full outline-none"
                      />
                    </div>
                  </div>
                  <div className={inputStyle}>
                    <HiOutlineIdentification className="text-gray-500" />
                    <input
                      type="text"
                      name="registrationNumber"
                      placeholder="Registration Number"
                      value={signupData.registrationNumber}
                      onChange={handleChange}
                      className="w-full outline-none"
                    />
                  </div>
                </div>
              );
            
            case 4:
              return (
                <div className="flex flex-col gap-3 min-h-80">
                  <div className={inputStyle}>
                    <label className="w-full text-gray-500 font-medium">ID Proof (PDF/Image):
                      <input
                        type="file"
                        name="documents.idProof"
                        onChange={handleChange}
                        className="w-full mt-1 cursor-pointer"
                      />
                    </label>
                  </div>
                  <div className={inputStyle}>
                    <label className="w-full text-gray-500 font-medium">Business License:
                      <input
                        type="file"
                        name="documents.businessLicense"
                        onChange={handleChange}
                        className="w-full mt-1 cursor-pointer"
                      />
                    </label>
                  </div>
                  <div className={inputStyle}>
                    <label className="w-full text-gray-500 font-medium">GST Certificate:
                      <input
                        type="file"
                        name="documents.gstCertificate"
                        onChange={handleChange}
                        className="w-full mt-1 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              );
            
            default:
              return null;
        }
    };

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-between bg-gray-100">
            {/* LOGO */}
            <div className='w-full h-18 mt-10 flex justify-center items-start'>
                <img src="/LogiTruckLogo.png" className='ml-8 w-90'/>
            </div>

            {/* Main container */}
            <div className="mb-20 relative w-[900px] h-[550px] bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden">

                {/* Forms container */}
                <div className="w-full flex items-center justify-between z-10">
                        {/* LOGIN FORM */}
                        <form className={`w-1/2 p-10 flex flex-col gap-4`}>
                            <h2 className="text-3xl text-center font-bold text-[#192a67] mb-2">Transporter Login</h2>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={loginData.email}
                                onChange={handleChange}
                                className="p-2 border rounded outline-none"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={handleChange}
                                className="p-2 border rounded outline-none"
                            />
                            <button type="submit" onClick={handleLogin} className="bg-yellow-300 cursor-pointer py-2 rounded font-semibold">
                                Login
                            </button>
                        </form>

                        {/* SIGN UP FORM */}
                        <form className={`w-1/2 p-10 flex flex-col gap-1`}>
                            <h2 className="text-3xl text-center font-bold text-[#192a67] mb-2">Transporter Signup</h2>

                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-gray-200 rounded overflow-hidden mb-4">
                                <div className={`h-full bg-yellow-300 transition-all duration-500`} style={{ width: `${(step / 4) * 100}%` }}></div>
                            </div>

                            {/* FORM SECTIONS */}
                            {renderStep()}

                            <div className="flex justify-between items-center mt-4">
                                {step > 1 && (
                                    <button type="button" onClick={handleBack} className={`bg-yellow-300 cursor-pointer py-2 px-4 rounded font-semibold`}>Back</button>
                                )}
                                <button type="button" onClick={handleNext} className={`bg-yellow-300 cursor-pointer py-2 px-4 rounded font-semibold`}>
                                    {step < 4 ? "Next" : "Signup"}
                                </button>
                            </div>
                        </form>
                </div>
                      
                {/* Overlay panel */}
                <div
                    className={`z-20 absolute top-0 h-full w-1/2 bg-[#192a67] text-white flex flex-col items-center justify-center p-10 transition-all duration-700 ease-in-out ${
                    isSignUp ? "left-0 rounded-l-xl" : "left-1/2 rounded-r-xl"
                  }`}
                >
                    <div className='h-1/2 flex flex-col justify-end'>
                        <h2 className="text-3xl text-center font-bold mb-4">
                            {isSignUp ? "Join LogiTruck as a Verified Transporter" : "Welcome Back, Transporter!"}
                        </h2>
                        <p className="mb-6 text-center">
                            {isSignUp
                            ? "Experience efficiency like never before"
                            : "Access your transporter dashboard and take charge."}
                        </p>
                    </div>
                    
                    <div className='flex w-full h-1/2 flex-col justify-end gap-3'>
                        {!isSignUp && <p className='text-center'>New to LogiTruck?<br /> Let’s set up your transporter account!</p>}
                        {isSignUp && <p className='text-center'>Your journey started?<br /> Pick up where you left off.</p>}
                        <button
                            onClick={() => {
                                setSignupData({
                                    companyName: '',
                                    companyEmail: '',
                                    companyPhone: '',
                                    password: '',
                                    address: {
                                        street: "",
                                        city: "",
                                        state: "",
                                        pincode: "",
                                        country: "",
                                        landmark: ""
                                    },
                                    registrationNumber: '',
                                    industry: '',
                                    contactPerson: {
                                        name: '',
                                        phone: '',
                                        email: ''
                                    }
                                });
                                setLoginData({ email: '', password: '' });
                                setStep(1);
                                setIsSignUp(!isSignUp); // Make sure to toggle the form view too
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

export default TransporterLoginSignup;
