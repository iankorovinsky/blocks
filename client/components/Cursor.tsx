'use client';

import { useEffect, useState } from 'react';

interface CursorProps {
  x: number;
  y: number;
  lastActive: number;
}

export function Cursor({ x, y, lastActive }: CursorProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkActivity = () => {
      const timeSinceActive = Date.now() - lastActive;
      setIsVisible(timeSinceActive < 2000);
    };

    // Check immediately when lastActive changes
    checkActivity();
    
    // Set up interval to keep checking
    const interval = setInterval(checkActivity, 100);
    return () => clearInterval(interval);
  }, [lastActive]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translateX(${x}px) translateY(${y}px)`,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m13.67 6.03-11-4a.5.5 0 0 0-.64.64l4 11a.5.5 0 0 0 .935.015l1.92-4.8 4.8-1.92a.5.5 0 0 0 0-.935h-.015Z"
          fill="#FF4D4D"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: '20px',
          top: '-10px',
          background: '#FF4D4D',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '12px',
          color: 'white',
          whiteSpace: 'nowrap',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        adam
      </div>
    </div>
  );
}
