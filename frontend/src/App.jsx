import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import IntroLoader from './components/IntroLoader';

import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';
import ContactUsPage from './pages/ContactUsPage';

import CompanyLoginSignup from './pages/auth/CompanyLoginSignup';
import TransporterLoginSignup from './pages/auth/TransporterLoginSignup';
import DriverLoginSignup from './pages/auth/DriverLoginSignup';
import AdminLogin from './pages/auth/AdminLogin';
import RoleSelectorPage from './pages/auth/RolesSelectorPage';

import { useUserProfile } from './hooks/useUserProfile';
import PageLoader from './components/PageLoader';

// DASHBOARDS & PROFILES
import CompanyDashboard from './pages/dashboard/CompanyDashboard';
import TransporterDashboard from './pages/dashboard/TransporterDashboard';
import DriverDashboard from './pages/dashboard/DriverDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

import CompanyProfile from './pages/profile/CompanyProfile';
import TransporterProfile from './pages/profile/TransporterProfile';
import DriverProfile from './pages/profile/DriverProfile';
import AdminProfile from './pages/profile/AdminProfile';
import HelpCentrePage from './pages/HelpCentrePage';
import CommunityCenterPage from './pages/CommunityCenterPage';
import NotificationPage from './pages/NotificationPage';

// // SHARED ORDER ROUTES
// import BookOrderPage from './pages/orders/BookOrderPage';
// import TrackOrderPage from './pages/orders/TrackOrderPage';
// import AllOrdersPage from './pages/orders/AllOrdersPage';
// import OrderDetailsPage from './pages/orders/OrderDetailsPage';

// Utility Components
const ProtectedRoute = ({ children, allowedRoles, role }) => {
    if (!role) return <Navigate to="/" />;
    if (allowedRoles.includes(role)) return children;
    return <Navigate to="/" />;
};

const AppWrapper = () => {
    const location = useLocation();
    const isHome = location.pathname === "/";
    const [showIntro, setShowIntro] = useState(false);

    //global states
    const { data: userProfile, isLoading } = useUserProfile();
    const role = userProfile?.role;

    //code for intro swipe up
    useEffect(() => {
        const hasSeenIntro = sessionStorage.getItem("homeIntroSeen");
        if (!hasSeenIntro && isHome) setShowIntro(true);
    }, [isHome]);
    const handleIntroFinish = () => {
        sessionStorage.setItem("homeIntroSeen", "true");
        setShowIntro(false);
    };

    //pageloader
    if (isLoading) return <PageLoader />;

    return (
        <div className={`relative w-full h-full ${showIntro ? 'overflow-hidden' : ''}`}>
            <div className="relative z-0">
                {!["/company/register", "/transporter/register", "/driver/register", "/admin/login", "/role-select"].includes(location.pathname) && <Navbar />}

                <Routes>
                    {/* PAGE LOADER */}
                    <Route path='/loading' element={<PageLoader />} />

                    {/* Public Routes */}
                    <Route path='/' element={<HomePage />} />
                    <Route path='/services/:id' element={<ServicePage />} />
                    <Route path='/contact' element={<ContactUsPage />} />
                    <Route path='/help-centre' element={<HelpCentrePage />} />
                    <Route path='/community' element={<CommunityCenterPage />} />
                    <Route path='/role-select' element={<RoleSelectorPage />} />
                    <Route path='/admin/login' element={<AdminLogin />} />
                    <Route path='/company/register' element={<CompanyLoginSignup />} />
                    <Route path='/transporter/register' element={<TransporterLoginSignup />} />
                    <Route path='/driver/register' element={<DriverLoginSignup />} />
                    <Route path='/notifications' element={<NotificationPage />} />

                    {/* Protected Dashboards */}
                    <Route path='/company/dashboard' element={
                        <ProtectedRoute role={role} allowedRoles={['company']}>
                            <CompanyDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path='/transporter/dashboard' element={
                        <ProtectedRoute role={role} allowedRoles={['transporter']}>
                            <TransporterDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path='/driver/dashboard' element={
                        <ProtectedRoute role={role} allowedRoles={['driver']}>
                            <DriverDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path='/admin/dashboard' element={
                        <ProtectedRoute role={role} allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />

                    {/* Protected Profiles */}
                    <Route path='/company/profile' element={
                        <ProtectedRoute role={role} allowedRoles={['company']}>
                            <CompanyProfile />
                        </ProtectedRoute>
                    } />
                    <Route path='/transporter/profile' element={
                        <ProtectedRoute role={role} allowedRoles={['transporter']}>
                            <TransporterProfile />
                        </ProtectedRoute>
                    } />
                    <Route path='/driver/profile' element={
                        <ProtectedRoute role={role} allowedRoles={['driver']}>
                            <DriverProfile />
                        </ProtectedRoute>
                    } />
                    <Route path='/admin/profile' element={
                        <ProtectedRoute role={role} allowedRoles={['admin']}>
                            <AdminProfile />
                        </ProtectedRoute>
                    } />

                    {/* Shared Order Routes */}
                    {/* <Route path='/orders/book' element={
                        <ProtectedRoute role={role} allowedRoles={['company', 'admin']}>
                            <BookOrderPage />
                        </ProtectedRoute>
                    } />
                    <Route path='/orders/track' element={
                        <ProtectedRoute role={role} allowedRoles={['company', 'transporter', 'driver', 'admin']}>
                            <TrackOrderPage />
                        </ProtectedRoute>
                    } />
                    <Route path='/orders/all' element={
                        <ProtectedRoute role={role} allowedRoles={['company', 'admin', 'transporter']}>
                            <AllOrdersPage />
                        </ProtectedRoute>
                    } />
                    <Route path='/orders/:orderId' element={
                        <ProtectedRoute role={role} allowedRoles={['company', 'admin', 'transporter', 'driver']}>
                            <OrderDetailsPage />
                        </ProtectedRoute>
                    } /> */}
                </Routes>
            </div>

            {/* Intro Loader */}
            {isHome && showIntro && (
                <div className="absolute top-0 left-0 w-full h-full z-50 pointer-events-none">
                    <IntroLoader onFinish={handleIntroFinish} />
                </div>
            )}
        </div>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <AppWrapper />
        </BrowserRouter>
    );
};

export default App;