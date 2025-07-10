import React from 'react'
import HomePage from './pages/HomePage'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
    return (
        <div className='relative w-full h-full'>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path={"/"} element={<HomePage />} />
                </Routes>
                
            </BrowserRouter>
        </div>
  )
}

export default App
