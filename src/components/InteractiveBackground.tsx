'use client';

import { useEffect, useRef, useState } from 'react';

interface InteractiveBackgroundProps {
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

export default function InteractiveBackground({ colors }: InteractiveBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black"
      style={{ zIndex: 0, pointerEvents: 'auto' }}
    >
      {/* Test element */}
      <div className="fixed top-4 left-4 text-white text-sm z-50 pointer-events-none">
        Mouse: {mousePosition.x}, {mousePosition.y}
      </div>

      {/* Glow effect */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full transition-all duration-300 pointer-events-none"
        style={{
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
          opacity: isVisible ? 0.3 : 0,
          background: `radial-gradient(circle at center,
            ${colors.primary} 0%,
            ${colors.secondary} 30%,
            ${colors.tertiary} 60%,
            transparent 100%)`,
          filter: 'blur(20px)',
        }}
      />

      {/* Pattern */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <defs>
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Ornamental pattern */}
          <pattern
            id="ornament"
            x="0"
            y="0"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            {/* Central flower pattern */}
            <g transform="translate(100,100)">
              <path
                d="M0,0 Q10,-20 20,0 T40,0 M0,0 Q-10,-20 -20,0 T-40,0 M0,0 Q10,20 20,0 T40,0 M0,0 Q-10,20 -20,0 T-40,0"
                fill="none"
                stroke={colors.primary}
                strokeWidth="2"
                filter="url(#glow)"
              />
              <circle cx="0" cy="0" r="5" fill={colors.primary} filter="url(#glow)" />
            </g>

            {/* Decorative swirls */}
            <g transform="translate(50,50)">
              <path
                d="M0,0 C20,-20 40,-20 60,0 S80,40 60,60 S20,80 0,60 S-20,20 0,0"
                fill="none"
                stroke={colors.secondary}
                strokeWidth="1.5"
                filter="url(#glow)"
              />
            </g>
            <g transform="translate(150,150)">
              <path
                d="M0,0 C-20,-20 -40,-20 -60,0 S-80,40 -60,60 S-20,80 0,60 S20,20 0,0"
                fill="none"
                stroke={colors.secondary}
                strokeWidth="1.5"
                filter="url(#glow)"
              />
            </g>

            {/* Connecting lines */}
            <path
              d="M0,100 Q50,50 100,100 T200,100 M0,100 Q50,150 100,100 T200,100"
              fill="none"
              stroke={colors.tertiary}
              strokeWidth="1"
              filter="url(#glow)"
            />
            <path
              d="M100,0 Q150,50 100,100 T100,200 M100,0 Q150,50 100,100 T100,200"
              fill="none"
              stroke={colors.tertiary}
              strokeWidth="1"
              filter="url(#glow)"
            />

            {/* Small decorative elements */}
            <g transform="translate(25,25)">
              <circle cx="0" cy="0" r="3" fill={colors.primary} filter="url(#glow)" />
              <path
                d="M0,0 L5,5 M0,0 L-5,5 M0,0 L5,-5 M0,0 L-5,-5"
                stroke={colors.secondary}
                strokeWidth="1"
                filter="url(#glow)"
              />
            </g>
            <g transform="translate(175,175)">
              <circle cx="0" cy="0" r="3" fill={colors.primary} filter="url(#glow)" />
              <path
                d="M0,0 L5,5 M0,0 L-5,5 M0,0 L5,-5 M0,0 L-5,-5"
                stroke={colors.secondary}
                strokeWidth="1"
                filter="url(#glow)"
              />
            </g>
          </pattern>
        </defs>

        {/* Mask for the pattern */}
        <mask id="patternMask">
          <rect width="100%" height="100%" fill="black" />
          <circle
            cx={mousePosition.x}
            cy={mousePosition.y}
            r="200"
            fill="white"
          />
        </mask>

        {/* Pattern with mask */}
        <rect
          width="100%"
          height="100%"
          fill="url(#ornament)"
          mask="url(#patternMask)"
        />
      </svg>
    </div>
  );
} 