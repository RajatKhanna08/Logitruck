import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react'

const IntroLoader = ({ onFinish }) => {
    const [loadingPercent, setLoadingPercent] = useState(0);
    const [showWelcome, setShowWelcome] = useState(false);
    const loaderRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        let interval;

        // Simulate loading
        if (loadingPercent < 100) {
            interval = setInterval(() => {
                setLoadingPercent(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 20); // Speed of count
        }

        // Show Welcome when loading is complete
        if (loadingPercent === 100) {
            setTimeout(() => {
                setShowWelcome(true);
            }, 300); // short delay before welcome appears

            // After welcome shows, swipe up
            setTimeout(() => {
                gsap.to(loaderRef.current, {
                    y: "-100%",
                    duration: 2,
                    ease: "power4.inOut",
                    onComplete: () => {
                        document.body.style.overflow = "auto";
                        if (onFinish) onFinish();
                    }
                });
            }, 1800);
        }

        return () => clearInterval(interval);
    }, [loadingPercent])

    return (
        <div ref={loaderRef} className='fixed w-screen h-screen z-[9999] bg-black/95 text-yellow-300 flex flex-col items-center justify-center'>
            {/* TRUCK LOADING ANIMATION */}
            <div className='relative'>
                <img src="/TruckLoader5.gif" className='w-45 select-none' />
                <span className='w-full h-1 bg-white absolute bottom-10 rounded-xl' />
            </div>

            {/* LOADING TEXT */}

            <p className='select-none'>{loadingPercent}%</p>

            {/* WELCOME MESSAGE */}
            <p className={`text-yellow-300 text-lg font-bold mt-4 transition-opacity duration-700 ${showWelcome ? "opacity-100" : "opacity-0"}`}>Welcome to LogiTruck</p>
        </div>
  )
}

export default IntroLoader
