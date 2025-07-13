import React, { useEffect, useState } from 'react'
import HomePage from './pages/HomePage'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import IntroLoader from './components/IntroLoader';
import ServicePage from './pages/ServicePage';
import CompanyLoginSignup from './pages/auth/CompanyLoginSignup';
import TransporterLoginSignup from './pages/auth/TransporterLoginSignup';
import RoleSelectorPage from './pages/auth/RolesSelectorPage';
import DriverLoginSignup from './pages/auth/DriverLoginSignup';
import AdminLogin from './pages/auth/AdminLogin';
import ContactUsPage from './pages/ContactUsPage';

const AppWrapper = () => {
    const location = useLocation();
    const isHome = location.pathname === "/";
    const [showIntro, setShowIntro] = useState(false);

    useEffect(() => {
        const hasSeenIntro = sessionStorage.getItem("homeIntroSeen");
        if(!hasSeenIntro && isHome){
            setShowIntro(true);
        }
    }, [isHome]);

    const handleIntroFinish = () => {
        sessionStorage.setItem("homeIntroSeen", "true");
        setShowIntro(false);
    }
    return (
         <div className={`relative w-full h-full ${showIntro ? 'overflow-hidden' : ''}`}>
      <div className="relative z-0">
        { location.pathname != "/company/register"
            && location.pathname != "/transporter/register"
            && location.pathname != "/role-select"
            && location.pathname != "/driver/register"
            && location.pathname != "/admin/login"
            && <Navbar />}
        <Routes>
            <Route path='/role-select' element={<RoleSelectorPage />} />
            <Route path='/admin/login' element={<AdminLogin />} />
            <Route path='/company/register' element={<CompanyLoginSignup />} />
            <Route path='/transporter/register' element={<TransporterLoginSignup />} />
            <Route path='/driver/register' element={<DriverLoginSignup />} />
            <Route path='/' element={<HomePage />} />
            <Route path='/services/:id' element={<ServicePage />} />
            <Route path='/contact' element={<ContactUsPage />} />
        </Routes>
      </div>

      {/* Loader sits above everything */}
      {isHome && showIntro && (
        <div className="absolute top-0 left-0 w-full h-full z-50 pointer-events-none">
          <IntroLoader onFinish={handleIntroFinish} />
        </div>
      )}
    </div>
    )
}

const App = () => {

    return (
        <BrowserRouter>    
            <AppWrapper />
        </BrowserRouter>
  )
}

export default App
