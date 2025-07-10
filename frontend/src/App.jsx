import React from 'react'
import HomePage from './pages/HomePage'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<HomePage />} />
                </Routes>
            </BrowserRouter>
        </div>
  )
}

export default App
