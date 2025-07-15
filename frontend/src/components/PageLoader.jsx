import React from 'react';

const PageLoader = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
            <div className="bg-gradient-to-r from-yellow-300 via-blue-100 to-[#192a67] px-3 rounded-2xl shadow-md shadow-black flex items-center justify-center">
                <img
                    src="/TruckLoader5.gif" // Replace with your animated image (e.g. a moving truck)
                    alt="Loading..."
                    className="size-30"
                />
            </div>
        </div>
    );
};

export default PageLoader;
