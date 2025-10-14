"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HeroSection() {
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Animate heading
    gsap.fromTo(
      heroTextRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // Animate subtext
    gsap.fromTo(
      subTextRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" }
    );
  }, []);

  return (
    <section className="hero-section flex flex-col items-center justify-center text-center py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <h1
        ref={heroTextRef}
        className="hero-text text-4xl md:text-6xl font-extrabold mb-4 tracking-tight"
      >
        World&apos;s largest customizable course library
      </h1>

      <p
        ref={subTextRef}
        className="sub-text text-lg md:text-xl text-slate-300 max-w-2xl"
      >
        Over 10,000+ Free & Premium ready-to-learn courses.
      </p>
    </section>
  );
}
