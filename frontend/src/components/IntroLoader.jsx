import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react'

const IntroLoader = () => {
    const [progress, setProgress] = useState(0);
    const loaderRef = useRef();

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if(prev >= 100){
                    clearInterval(interval);
                    setTimeout(() => {
                        gsap.to(loaderRef.current, {
                            y: '-100%',
                            duration: 1,
                            ease: 'power3.inOut',
                            onComplete: onFinish
                        });
                    }, 500);

                    return 100;
                }

                return prev + 1;
            });
        }, 30);
    })

    return (
        <div ref={loaderRef} className='w-screen h-screen z-[9999] bg-[#192a67] text-yellow-300 flex flex-col items-center justify-center'>
            {/* TRUCK LOADING ANIMATION */}
            <img src="/TruckLoader.gif" className='w-40' />

            {/* LOADING TEXT */}
            <p>{progress}</p>
        </div>
  )
}

export default IntroLoader
