import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Icons
import { FaUser, FaPhoneAlt, FaEnvelope, FaLock, FaClock, FaCarSide } from 'react-icons/fa';
import { HiIdentification } from 'react-icons/hi';
import { MdUploadFile } from 'react-icons/md';

import { useLoginDriver, useRegisterDriver } from '../../hooks/roles/useDriver';

const DriverLoginSignup = () => {
    const { mutate:registerDriverMutation, isPending:isRegisterLoading } = useRegisterDriver();
    const { mutate:loginDriverMutation, isPending:isLoginLoading } = useLoginDriver();

    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paramsEmail = params.get("email");

    const [isSignUp, setIsSignUp] = useState(false);
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});

    //signup usestate
    const [signupData, setSignupData] = useState({
        transporterId: "",
        fullName: "",
        phone: "",
        email: "",
        password: "",
        documents: {
            idProof: null,
            license: null,
        },
        vehicleType: "",
        experience: "",
    });

    //login usestate
    const [loginData, setLoginData] = useState({
        email: paramsEmail || "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            setSignupData(prev => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    [name]: files[0],
                }
            }));
        } else {
            setSignupData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleNext = (e) => {
        const isValid = validateStep();
        if (isValid) {
            if (step < 3) setStep(step + 1);
            else handleSignup(e);
        }
    };

    //validations for login
    const validateLogin = () => {
        const loginErrors = {};

        if (!loginData.email.trim()) loginErrors.loginEmail = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) loginErrors.loginEmail = "Invalid email format";

        if (!loginData.password.trim()) loginErrors.loginPassword = "Password is required";
        else if (loginData.password.length < 6) loginErrors.loginPassword = "Password must be at least 6 characters";

        setErrors(loginErrors);
        return Object.keys(loginErrors).length === 0;
    };

    //validations for signup
    const validateStep = () => {
        const newErrors = {};

        if (step === 1) {
            if (!signupData.transporterId) newErrors.transporterId = "Transporter ID is required";
            if (!signupData.fullName.trim()) newErrors.fullName = "Full Name is required";
            if (!signupData.phone.trim()) newErrors.phone = "Phone Number is required";
            else if (!/^\d{10}$/.test(signupData.phone)) newErrors.phone = "Invalid phone number";
            if (!signupData.email.trim()) newErrors.email = "Email is required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) newErrors.email = "Invalid email format";
            if (!signupData.password.trim()) newErrors.password = "Password is required";
            else if (signupData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        }

        if (step === 2) {
            if (!signupData.documents.idProof) newErrors.idProof = "ID Proof is required";
            if (!signupData.documents.license) newErrors.license = "License is required";
        }

        if (step === 3) {
            if (!signupData.vehicleType.trim()) newErrors.vehicleType = "Vehicle Type is required";
            if (!signupData.experience) newErrors.experience = "Experience is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    //steps for signup
    const renderStep = () => {
        const inputStyle = "flex items-center gap-2 p-2 border-2 border-gray-300 rounded outline-none bg-white";

        switch (step) {
            case 1:
                return (
                    <div className='flex flex-col gap-6 min-h-80'>
                        <div className={inputStyle}>
                            <FaUser className='text-gray-500' />
                            <input
                                type="text"
                                name="transporterId"
                                placeholder="Transporter ID"
                                value={signupData.transporterId}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
                        {errors.transporterId && <p className="text-red-500 absolute top-110 right-12 text-sm">{errors.transporterId}</p>}
                        <div className={inputStyle}>
                            <FaUser className='text-gray-500' />
                            <input type="text" name="fullName" placeholder="Full Name" value={signupData.fullName} onChange={handleChange} className="w-full outline-none" />
                        </div>
                        {errors.fullName && <p className="text-red-500 absolute top-42 right-12 text-sm">{errors.fullName}</p>}

                        <div className={inputStyle}>
                            <FaPhoneAlt className='text-gray-500' />
                            <input type="text" name="phone" placeholder="Phone Number" value={signupData.phone} onChange={handleChange} className="w-full outline-none" />
                        </div>
                        {errors.phone && <p className="text-red-500 absolute top-59 right-12 text-sm">{errors.phone}</p>}

                        <div className={inputStyle}>
                            <FaEnvelope className='text-gray-500' />
                            <input type="email" name="email" placeholder="Email" value={signupData.email} onChange={handleChange} className="w-full outline-none" />
                        </div>
                        {errors.email && <p className="text-red-500 absolute top-76 right-12 text-sm">{errors.email}</p>}

                        <div className={inputStyle}>
                            <FaLock className='text-gray-500' />
                            <input type="password" name="password" placeholder="Password" value={signupData.password} onChange={handleChange} className="w-full outline-none" />
                        </div>
                        {errors.password && <p className="text-red-500 absolute top-93 right-12 text-sm">{errors.password}</p>}
                    </div>
                );

            case 2:
                return (
                    <div className="flex flex-col gap-6 min-h-80">
                        <label className={inputStyle + " flex-col items-start"}>
                            <span className="flex items-center gap-2">
                                <HiIdentification className='text-gray-500' />
                                <span className="text-sm text-gray-600">Upload ID Proof</span>
                            </span>
                            <input type="file" name="idProof" onChange={handleChange} />
                        </label>
                        {errors.idProof && <p className="text-red-500 absolute top-49 right-12 text-sm">{errors.idProof}</p>}

                        <label className={inputStyle + " flex-col items-start"}>
                            <span className="flex items-center gap-2">
                                <MdUploadFile className='text-gray-500' />
                                <span className="text-sm text-gray-600">Upload License</span>
                            </span>
                            <input type="file" name="license" onChange={handleChange} />
                        </label>
                        {errors.license && <p className="text-red-500 absolute top-73 right-12 text-sm">{errors.license}</p>}
                    </div>
                );

            case 3:
                return (
                    <div className="flex flex-col gap-6 min-h-80">
                        <div className={inputStyle}>
                            <FaCarSide className='text-gray-500' />
                            <input type="text" name="vehicleType" placeholder="Vehicle Type" value={signupData.vehicleType} onChange={handleChange} className="w-full outline-none" />
                        </div>
                        {errors.vehicleType && <p className="text-red-500 absolute top-42 right-12 text-sm">{errors.vehicleType}</p>}

                        <div className={inputStyle}>
                            <FaClock className='text-gray-500' />
                            <input type="number" name="experience" placeholder="Experience (Years)" value={signupData.experience} onChange={handleChange} className="w-full outline-none" />
                        </div>
                        {errors.experience && <p className="text-red-500 absolute top-59 right-12 text-sm">{errors.experience}</p>}
                    </div>
                );

            default:
                return null;
        }
    };

    //function to change the data in a formData as it contains files and calling the above mutation function with that data
    const handleSignup = (e) => {
        e.preventDefault();
        if (!validateStep()) return;
        
        const formData = new FormData();
        
        for (const key in signupData) {
            if (key === 'documents') {
                formData.append("idProof", signupData.documents.idProof);
                formData.append("license", signupData.documents.license);
            } else {
                formData.append(key, signupData[key]);
            }
        }
    
        registerDriverMutation(formData);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!validateLogin()) return;
        loginDriverMutation(loginData);
    };

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-between bg-gray-100">
            <div className='w-full mt-10 flex justify-center items-start'>
                <img onClick={() => navigate("/")} src="/LogiTruckLogo.png" className='w-90 cursor-pointer' />
            </div>

            <div className="mb-20 relative w-[900px] h-[550px] bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden">
                <div className="w-full flex items-center justify-between z-10">
                    {/* LOGIN FORM */}
                    <form className={`relative w-1/2 p-10 flex flex-col gap-6`}>
                        <h2 className="text-3xl text-center font-bold text-[#192a67] mb-2">Driver Login</h2>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={loginData.email}
                            onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                            className="p-2 border-2 border-gray-300 rounded outline-none"
                        />
                        {errors.loginEmail && <p className="text-red-500 absolute top-38 right-12 text-xs">{errors.loginEmail}</p>}
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                            className="p-2 border-2 border-gray-300 rounded outline-none"
                        />
                        {errors.loginPassword && <p className="text-red-500 absolute top-55 right-12 text-xs">{errors.loginPassword}</p>}
                        <button type="submit" disabled={isLoginLoading} onClick={handleLogin} className="bg-yellow-300 py-2 cursor-pointer rounded font-semibold">
                            {isLoginLoading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* SIGN UP FORM */}
                    <form className="relative w-1/2 p-10 flex flex-col gap-2">
                        <h2 className="text-3xl text-center font-bold text-[#192a67] mb-2">Driver Signup</h2>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-gray-200 rounded overflow-hidden mb-4">
                            <div className={`h-full bg-yellow-300 transition-all duration-500`} style={{ width: `${(step / 3) * 100}%` }}></div>
                        </div>

                        {renderStep()}

                        <div className="flex justify-between items-center mt-4">
                            {step > 1 && (
                                <button type="button" onClick={() => setStep(step - 1)} className="bg-yellow-300 cursor-pointer py-2 px-4 rounded font-semibold">Back</button>
                            )}
                            <button type="button" onClick={handleNext} className="bg-yellow-300 cursor-pointer py-2 px-4 rounded font-semibold">
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
                        <button onClick={() => navigate("/role-select")} className='bg-yellow-300 cursor-pointer text-black font-semibold px-6 py-2 rounded'>Change Role</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverLoginSignup;
