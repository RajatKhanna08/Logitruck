import React, { useState } from 'react';

//Icons
import { FaBuilding, FaEnvelope, FaLock, FaUserTie, FaLandmark, FaGlobeAsia, FaStreetView, FaPhoneAlt } from 'react-icons/fa';
import { FaCity } from 'react-icons/fa6';
import { HiOutlineIdentification } from 'react-icons/hi';
import { TbMapPinCode } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { useLoginTransporter, useRegisterTransporter } from '../../hooks/roles/useTransporter';

const TransporterLoginSignup = () => {
    const { mutate:registerTransporterMutation, isPending:isRegisterLoading } = useRegisterTransporter();
    const { mutate:loginTransporterMutation, isPending:isLoginLoading } = useLoginTransporter();

    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [step, setStep] = useState(1);

    const [errors, setErrors] = useState({});

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
        documents: {
            idProof: null,
            businessLicense: null,
            gstCertificate: null
        }
    });
    
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (isSignUp) {
            if (name.startsWith("contactPerson.")) {
                const field = name.split(".")[1];
                setSignupData((prev) => ({
                    ...prev,
                    contactPerson: {
                        ...prev.contactPerson,
                        [field]: value
                    }
                }));
            } else if (name.startsWith("address.")) {
                const field = name.split(".")[1];
                setSignupData((prev) => ({
                    ...prev,
                    address: {
                        ...prev.address,
                        [field]: value
                    }
                }));
            } else if (["idProof", "businessLicense", "gstCertificate"].includes(name)) {
                const file = files[0];
                setSignupData((prev) => ({
                    ...prev,
                    documents: {
                        ...prev.documents,
                        [name]: file
                    }
                }));
            } else {
                setSignupData((prev) => ({
                    ...prev,
                    [name]: value
                }));
            }

            if (errors[name] || errors[`documents.${name}`]) {
                setErrors((prev) => {
                    const updated = { ...prev };
                    delete updated[name];
                    delete updated[`documents.${name}`];
                    return updated;
                });
            }
        } else {
            setLoginData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleNext = (e) => {
        e.preventDefault();
        const isValid = validateStep();
        if (isValid) {
            if (step < 4) setStep(step + 1);
            else handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = () => {
        if (!validateStep()) return;
        
        const formData = new FormData();
        
        for (const key in signupData) {
            if (key === 'address') {
                formData.append(key, JSON.stringify(signupData[key]));
            } else if (key === 'documents') {
                formData.append("idProof", signupData.documents.idProof);
                formData.append("businessLicense", signupData.documents.businessLicense);
                formData.append("gstCertificate", signupData.documents.gstCertificate);
            } else {
                formData.append(key, signupData[key]);
            }
        }
    
        registerTransporterMutation(formData);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if(!validateLogin) return;

        loginTransporterMutation(loginData);
    };

    const validateLogin = () => {
        const loginErrors = {};

        if (!loginData.email.trim()) loginErrors.loginEmail = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) loginErrors.loginEmail = "Invalid email format";

        if (!loginData.password.trim()) loginErrors.loginPassword = "Password is required";
        else if (loginData.password.length < 6) loginErrors.loginPassword = "Password must be at least 6 characters";

        setErrors(loginErrors);
        return Object.keys(loginErrors).length === 0;
    };

    const validateStep = () => {
        const newErrors = {};

        // Step 1: Transporter and Owner Name
        if (step === 1) {
            if (!signupData.transporterName.trim()) newErrors.transporterName = "required";
            if (!signupData.ownerName.trim()) newErrors.ownerName = "required";
        }

        // Step 2: Contact No, Email, Password
        if (step === 2) {
            if (!signupData.contactNo) newErrors.contactNo = "required";
            else if (!/^\d{10}$/.test(signupData.contactNo)) newErrors.contactNo = "Invalid number";

            if (!signupData.email.trim()) newErrors.email = "required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) newErrors.email = "Invalid";

            if (!signupData.password.trim()) newErrors.password = "required";
            else if (signupData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        }

        // Step 3: Address and Registration Number
        if (step === 3) {
            const address = signupData.address;

            if (!address.street.trim()) newErrors["address.street"] = "required";
            if (!address.city.trim()) newErrors["address.city"] = "required";
            if (!address.state.trim()) newErrors["address.state"] = "required";
            if (!address.pincode) newErrors["address.pincode"] = "required";
            else if (!/^\d{6}$/.test(address.pincode)) newErrors["address.pincode"] = "Invalid";
            if (!address.country.trim()) newErrors["address.country"] = "required";
            if (!address.landmark.trim()) newErrors["address.landmark"] = "required";

            if (!signupData.registrationNumber.trim()) newErrors.registrationNumber = "required";
        }

        // Step 4: File Uploads
        if (step === 4) {
            if (!signupData.documents.idProof) newErrors["documents.idProof"] = "required";
            if (!signupData.documents.businessLicense) newErrors["documents.businessLicense"] = "required";
            if (!signupData.documents.gstCertificate) newErrors["documents.gstCertificate"] = "required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const renderStep = () => {
        const inputStyle = "flex items-center gap-2 p-2 border-2 border-gray-300 rounded outline-none bg-white";

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
                            {errors.transporterName && <p className="text-red-500 text-xs">{errors.transporterName}</p>}
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
                            {errors.ownerName && <p className="text-red-500 text-xs">{errors.ownerName}</p>}
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
                            {errors.contactNo && <p className="text-red-500 text-xs">{errors.contactNo}</p>}
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
                            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
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
                            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
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
                      {errors["address.street"] && <p className="text-red-500 text-xs">{errors["address.street"]}</p>}
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
                      {errors["address.city"] && <p className="text-red-500 text-xs">{errors["address.city"]}</p>}
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
                      {errors["address.state"] && <p className="text-red-500 text-xs">{errors["address.state"]}</p>}
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
                      {errors["address.pincode"] && <p className="text-red-500 text-xs">{errors["address.pincode"]}</p>}
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
                      {errors["address.country"] && <p className="text-red-500 text-xs">{errors["address.country"]}</p>}
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
                      {errors["address.landmark"] && <p className="text-red-500 text-xs">{errors["address.landmark"]}</p>}
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
                    {errors.registrationNumber && <p className="text-red-500 text-xs">{errors.registrationNumber}</p>}
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
                        name="idProof"
                        onChange={handleChange}
                        className="w-full mt-1 cursor-pointer"
                      />
                      {errors["documents.idProof"] && <p className="text-red-500 text-xs">{errors["documents.idProof"]}</p>}
                    </label>
                  </div>
                  <div className={inputStyle}>
                    <label className="w-full text-gray-500 font-medium">Business License:
                      <input
                        type="file"
                        name="businessLicense"
                        onChange={handleChange}
                        className="w-full mt-1 cursor-pointer"
                      />
                      {errors["documents.businessLicense"] && <p className="text-red-500 text-xs">{errors["documents.businessLicense"]}</p>}
                    </label>
                  </div>
                  <div className={inputStyle}>
                    <label className="w-full text-gray-500 font-medium">GST Certificate:
                      <input
                        type="file"
                        name="gstCertificate"
                        onChange={handleChange}
                        className="w-full mt-1 cursor-pointer"
                      />
                      {errors["documents.gstCertificate"] && <p className="text-red-500 text-xs">{errors["documents.gstCertificate"]}</p>}
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
                <img onClick={() => navigate("/")} src="/LogiTruckLogo.png" className='ml-8 cursor-pointer w-90'/>
            </div>

            {/* Main container */}
            <div className="mb-20 relative w-[900px] h-[550px] bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden">

                {/* Forms container */}
                <div className="w-full flex items-center justify-between z-10">
                        {/* LOGIN FORM */}
                        <form className={`relative w-1/2 p-10 flex flex-col gap-6`}>
                            <h2 className="text-3xl text-center font-bold text-[#192a67] mb-2">Transporter Login</h2>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={loginData.email}
                                onChange={handleChange}
                                className="p-2 border-2 border-gray-300 rounded outline-none"
                            />
                            {errors.loginEmail && <p className="text-red-500 absolute top-38 right-12 text-xs">{errors.loginEmail}</p>}
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={handleChange}
                                className="p-2 border-2 border-gray-300 rounded outline-none"
                            />
                            {errors.loginPassword && <p className="text-red-500 absolute top-55 right-12 text-xs">{errors.loginPassword}</p>}
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
                                setLoginData({ email: '', password: '' });
                                setStep(1);
                                setIsSignUp(!isSignUp); // Make sure to toggle the form view too
                            }}
                            className="bg-yellow-300 cursor-pointer text-black font-semibold px-6 py-2 rounded"
                        >
                            {isSignUp ? "Login" : "Signup"}
                        </button>
                        <button onClick={() => navigate("/role-select")} className='bg-yellow-300 cursor-pointer text-black font-semibold px-6 py-2 rounded'>Change Role</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransporterLoginSignup;
