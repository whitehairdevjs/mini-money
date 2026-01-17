"use client";

import Image from "next/image";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 40, showText = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
      <Image
        src="/logo-icon.svg"
        alt="Mini Money Logo"
        width={size}
        height={size}
        className="flex-shrink-0"
      />
      {showText && (
        <span className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          mini money
        </span>
      )}
    </div>
  );
}
