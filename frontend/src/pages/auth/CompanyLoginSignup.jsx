import { useState } from 'react';

//Icons
import { FaBuilding, FaEnvelope, FaLock, FaIndustry, FaUserTie, FaLandmark, FaGlobeAsia, FaStreetView, FaPhoneAlt } from 'react-icons/fa';
import { FaCity } from 'react-icons/fa6';
import { HiOutlineIdentification } from 'react-icons/hi';
import { TbMapPinCode } from "react-icons/tb";
import { useLocation, useNavigate } from 'react-router-dom';

const CompanyLoginSignup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paramsEmail = params.get("email");

    const [errors, setErrors] = useState({});

    const [isSignUp, setIsSignUp] = useState(false);
    const [step, setStep] = useState(1);

    const [signupData, setSignupData] = useState({
        companyName: "",
        companyEmail: "",
        companyPhone: "",
        password: "",
        address: {
            street: "",
            city: "",
            state: "",
            pincode: "",
            country: "",
            landmark: ""
        },
        registrationNumber: "",
        industry: "",
        contactPerson: {
            name: "",
            phone: "",
            email: ""
        },
        documents: {
            idProof: null,
            businessLicense: null,
            gstCertificate: null
        }
    });
    
    const [loginData, setLoginData] = useState({
        email: paramsEmail || "",
        password: ""
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

    const handleNext = () => {
        if (validateStep()) {
            if (step < 5) setStep((prev) => prev + 1);
            else handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = () => {
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
            },
            documents: {
                idProof: null,
                businessLicense: null,
                gstCertificate: null
            }
         });
        setStep(1);
        console.log("Signup Data Submitted:", signupData);
        // API call for signup goes here
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!validateLogin()) return;

        console.log("Login Data Submitted:", loginData);
        // Login API here
    };

    const renderStep = () => {
        const inputStyle = "flex items-center gap-2 p-2 border-2 border-gray-300 rounded outline-none bg-white";

        switch (step) {
            case 1:
                return (
                    <div className='flex flex-col gap-4 min-h-80'>
                        <div className={inputStyle}>
                            <FaBuilding className="text-gray-500" />
                            <input
                                type="text"
                                name="companyName"
                                placeholder="Company Name"
                                value={signupData.companyName}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                            {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName}</p>}
                        </div>
                        <div className={inputStyle}>
                            <FaEnvelope className="text-gray-500" />
                            <input
                                type="email"
                                name="companyEmail"
                                placeholder="Email"
                                value={signupData.companyEmail}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                            {errors.companyEmail && <p className="text-red-500 text-xs">{errors.companyEmail}</p>}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className='flex flex-col gap-4 min-h-80'>
                        <div className={inputStyle}>
                            <FaPhoneAlt className="text-gray-500" />
                            <input
                                type="text"
                                name="companyPhone"
                                placeholder="Phone Number"
                                value={signupData.companyPhone}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                            {errors.companyPhone && <p className="text-red-500 text-xs">{errors.companyPhone}</p>}
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
                    <div className="flex min-h-80 flex-col gap-3">
                        {/* ADDRESS */}
                        <div className='grid grid-cols-2 gap-3'>
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
                        {/* OTHER */}
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

                        <div className={inputStyle}>
                            <FaIndustry className="text-gray-500" />
                            <input
                                type="text"
                                name="industry"
                                placeholder="Industry"
                                value={signupData.industry}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                            {errors.industry && <p className="text-red-500 text-xs">{errors.industry}</p>}
                        </div>
                    </div>
                    );
            
            case 4:
                return (
                    <div className='flex flex-col gap-4 min-h-80'>
                        <div className={inputStyle}>
                            <FaUserTie className="text-gray-500" />
                            <input
                                type="text"
                                name="contactPerson.name"
                                placeholder="Contact Person Name"
                                value={signupData.contactPerson.name}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                            {errors["contactPerson.name"] && <p className="text-red-500 text-xs">{errors["contactPerson.name"]}</p>}
                        </div>
                        <div className={inputStyle}>
                            <FaPhoneAlt className="text-gray-500" />
                            <input
                                type="text"
                                name="contactPerson.phone"
                                placeholder="Contact Person Phone"
                                value={signupData.contactPerson.phone}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                            {errors["contactPerson.phone"] && <p className="text-red-500 text-xs">{errors["contactPerson.phone"]}</p>}
                        </div>
                        <div className={inputStyle}>
                            <FaEnvelope className="text-gray-500" />
                            <input
                                type="email"
                                name="contactPerson.email"
                                placeholder="Contact Person Email"
                                value={signupData.contactPerson.email}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                            {errors["contactPerson.email"] && <p className="text-red-500 text-xs">{errors["contactPerson.email"]}</p>}
                        </div>
                    </div>
                );

            case 5:
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
                            {errors["documents.idProof"] && <p className="text-red-500 text-xs">{errors["documents.idProof"]}</p>}
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
                            {errors["documents.businessLicense"] && <p className="text-red-500 text-xs">{errors["documents.businessLicense"]}</p>}
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
                            {errors["documents.gstCertificate"] && <p className="text-red-500 text-xs">{errors["documents.gstCertificate"]}</p>}
                            </label>
                        </div>
                    </div>
                );
          
            default:
                return null;
        }
    };

    const validateStep = () => {
        const newErrors = {};

        // Step 1: Company name and email
        if (step === 1) {
            if (!signupData.companyName.trim()) newErrors.companyName = "required";
            if (!signupData.companyEmail.trim()) newErrors.companyEmail = "required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.companyEmail)) newErrors.companyEmail = "Invalid";
        }

        // Step 2: Phone and Password
        if (step === 2) {
            if (!signupData.companyPhone.trim()) newErrors.companyPhone = "required";
            else if (!/^\d{10}$/.test(signupData.companyPhone)) newErrors.companyPhone = "Invalid";
            if (!signupData.password.trim()) newErrors.password = "required";
            else if (signupData.password.length < 6) newErrors.password = "At least 6 characters";
        }

        // Step 3: Address, Reg No, Industry
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
            if (!signupData.industry.trim()) newErrors.industry = "required";
        }

        // Step 4: Contact Person
        if (step === 4) {
            const contact = signupData.contactPerson;
            if (!contact.name.trim()) newErrors["contactPerson.name"] = "required";
            if (!contact.phone) newErrors["contactPerson.phone"] = "required";
            else if (!/^\d{10}$/.test(contact.phone)) newErrors["contactPerson.phone"] = "Invalid";
            if (!contact.email.trim()) newErrors["contactPerson.email"] = "Email is required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) newErrors["contactPerson.email"] = "Invalid";
        }

        // Step 5: Files
        if (step === 5) {
            if (!signupData.documents.idProof) newErrors["documents.idProof"] = "required";
            if (!signupData.documents.businessLicense) newErrors["documents.businessLicense"] = "required";
            if (!signupData.documents.gstCertificate) newErrors["documents.gstCertificate"] = "required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateLogin = () => {
        const loginErrors = {};

        if (!loginData.email.trim()) loginErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) loginErrors.email = "Invalid email format";

        if (!loginData.password.trim()) loginErrors.password = "Password is required";
        else if (loginData.password.length < 6) loginErrors.password = "Password must be at least 6 characters";

        setErrors(loginErrors);
        return Object.keys(loginErrors).length === 0;
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
                        <form className={`relative w-1/2 p-10 flex flex-col gap-4`}>
                            <h2 className="text-3xl text-center font-bold text-[#192a67] mb-2">Company Login</h2>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={loginData.email}
                                onChange={handleChange}
                                className="p-2 border-2 border-gray-300 rounded outline-none"
                            />
                            {errors.email && <p className="text-red-500 absolute top-28 right-12 text-xs">{errors.email}</p>}
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={handleChange}
                                className="p-2 border-2 border-gray-300 rounded outline-none"
                            />
                            {errors.password && <p className="text-red-500 absolute top-43 right-12 text-xs">{errors.password}</p>}
                            <button type="submit" onClick={handleLogin} className="bg-yellow-300 cursor-pointer py-2 rounded font-semibold">
                                Login
                            </button>
                        </form>

                        {/* SIGN UP FORM */}
                        <form className={`w-1/2 p-10 flex flex-col gap-1`}>
                            <h2 className="text-3xl text-center font-bold text-[#192a67] mb-2">Company Signup</h2>

                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-gray-200 rounded overflow-hidden mb-4">
                                <div className={`h-full bg-yellow-300 transition-all duration-500`} style={{ width: `${(step / 5) * 100}%` }}></div>
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
                            {isSignUp ? "Welcome to the Future of Transport Management" : "Welcome Back to Your Logistics Hub!"}
                        </h2>
                        <p className="mb-6 text-center">
                            {isSignUp
                            ? "Experience efficiency like never before"
                            : "Access your company dashboard and take charge."}
                        </p>
                    </div>
                    
                    <div className='flex w-full h-1/2 flex-col justify-end gap-3'>
                        {!isSignUp && <p className='text-center'>New to LogiTruck?<br /> Let’s set up your company account!</p>}
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
                                    },
                                    documents: {
                                        idProof: null,
                                        businessLicense: null,
                                        gstCertificate: null
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

export default CompanyLoginSignup;
