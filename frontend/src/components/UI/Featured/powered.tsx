'use client';
import React, { useEffect } from 'react';
import { gsap } from 'gsap';

const BrandPartners: React.FC = () => {
  const logos = [
    // Backend Stack
    "https://nodejs.org/static/images/logo.svg", // Node.js
    "https://innovatehubcec.vercel.app/express.png", // Express.js
    "https://www.mongodb.com/assets/images/global/leaf.png", // MongoDB
    "https://cdn.sanity.io/images/o0o2tn5x/production/2399b991025c365aafaa6fca85d91deac801e654-1046x1046.png", // Clerk
    "https://innovatehubcec.vercel.app/judge0.png", // Judge0

    // AI Stack
    "https://www.python.org/static/community_logos/python-logo-generic.svg", // Python
    "https://images.seeklogo.com/logo-png/61/2/langchain-white-logo-png_seeklogo-611657.png", // LangChain
    "https://tse3.mm.bing.net/th/id/OIP.PvmJQmCdujsmfWBO66-NAwHaCb?pid=Api&P=0&h=180", // Mistral AI

    // Frontend Stack
    "https://tse1.mm.bing.net/th/id/OIP.yXBkscgYTE1fzH27UudKRAHaFj?pid=Api&P=0&h=180", // Next.js
    "https://innovatehubcec.vercel.app/lenis.gif", // GSAP
    "https://innovatehubcec.vercel.app/gsap.png" // Lenis
  ];
useEffect(() => {
  const wrapper = document.querySelector(".logos-wrapper") as HTMLElement;
  const container = document.querySelector(".logos-container") as HTMLElement;
  if (!wrapper || !container) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        // Run GSAP only when visible
        const clone = wrapper.cloneNode(true) as HTMLElement;
        container.appendChild(clone);

        const totalWidth = wrapper.offsetWidth;
        if (totalWidth === 0) return;

        const tween = gsap.to(wrapper, {
          x: `-${totalWidth}px`,
          duration: 12,
          ease: "none",
          repeat: -1,
        });

        observer.disconnect();

        // Cleanup when component unmounts
        return () => {
          tween.kill();
          container.removeChild(clone);
        };
      }
    },
    { threshold: 0.2 } // 20% visible
  );

  observer.observe(container);
  return () => observer.disconnect();
}, []);


  return (
    <div className="brand-partners w-full h-[40vh] md:h-[65vh] flex flex-col items-center justify-center gap-[35px] md:gap-[55px]">
      <h2 className="syne text-[25px] lg:text-[30px] font-semibold text-white leading-[1em] text-center">
       Powered By
      </h2>

      <div className="logos-container w-[95%] lg:w-[1200px] border-[1px] border-solid border-[#ffffff73] rounded-[80px] flex items-center overflow-hidden">
        <div className="logos-wrapper flex">
          {logos.map((logo, index) => (
            <div key={index} className="img-box w-[150px] lg:w-[200px] md:w-[175px] h-[70px] md:h-[88px] p-[15px] border-r-[1px] border-solid border-[#ffffff73] shrink-0">
               <img 
                className="w-full h-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300" 
                src={logo} 
                alt={`Logo ${index + 1}`} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandPartners;