"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface ChatBotButtonProps {
  onClick?: () => void;
}

export default function ChatBotButton({ onClick }: ChatBotButtonProps) {
  const handleClick = () => {
    if (onClick) return onClick();
    if (typeof window !== 'undefined') {
      window.alert('Chat opened');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 w-28 h-28 bg-transparent rounded-full shadow-lg hover:shadow-cyan-500/70 transition-all hover:scale-110 z-50 flex items-center justify-center group"
      aria-label="Open chat assistant"
    >
      <DotLottieReact
        src="https://lottie.host/0e71f336-3cbe-4cb8-b448-3f3ecb378e10/UvFs8cLrxw.lottie"
        loop
        autoplay
        style={{
          width: 1000,  // Increased from 64 to 96
          height: 96, // Increased from 64 to 96
          background: 'transparent',
          filter: 'drop-shadow(0 0 20px #9f7aea)', // Increased shadow
        }}
      />
      <div className="absolute -inset-3 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full opacity-30 group-hover:opacity-50 blur-xl transition-opacity -z-10 animate-pulse"></div>
    </button>
  );
}