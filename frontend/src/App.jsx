import React, { useEffect, useState } from 'react'
import HomePage from './pages/HomePage'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import IntroLoader from './components/IntroLoader';
import ServicePage from './pages/ServicePage';

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
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/services' element={<ServicePage />} />
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
