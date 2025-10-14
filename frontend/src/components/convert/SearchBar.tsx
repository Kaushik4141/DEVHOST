"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function SearchBar() {
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      searchRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      ref={searchRef}
      className="flex items-center justify-between w-full max-w-md mx-auto bg-slate-800 rounded-full px-4 py-2 shadow-lg focus-within:ring-2 focus-within:ring-cyan-500 transition-all"
    >
      <input
        type="text"
        placeholder="Search courses..."
        className="flex-grow bg-transparent outline-none text-slate-200 placeholder-slate-400 px-2"
      />
      <svg
        className="text-slate-300 hover:text-cyan-400 transition-colors"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    </div>
  );
}
