import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    let lastTarget: EventTarget | null = null;

    const moveCursor = (e: MouseEvent) => {
      // Direct update for zero latency
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      if (!isVisible) setIsVisible(true);
      
      const target = e.target as HTMLElement;
      if (!target || target === lastTarget) return;
      lastTarget = target;
      
      // Only update state if interactive status actually changes
      const computedCursor = window.getComputedStyle(target).cursor;
      const isInteractive = 
        computedCursor === 'pointer' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') !== null ||
        target.tagName === 'A' ||
        target.closest('a') !== null;
        
      setIsPointer(prev => prev !== isInteractive ? isInteractive : prev);
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
      style={{
        x: cursorX,
        y: cursorY,
      }}
    >
      <motion.div
        initial={{ rotate: -25, scale: 1 }}
        animate={{ 
          rotate: isMouseDown ? -5 : (isPointer ? -65 : -25),
          scale: isMouseDown ? 0.8 : (isPointer ? 1.2 : 1),
          x: -4, // Exact tip X
          y: -52, // Exact tip Y
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="relative origin-[4px_52px]" // Pivot around the new sharp tip
      >
        {/* Ultra-Slender & Integrated Feather Quill SVG */}
        <svg 
          width="56" 
          height="56" 
          viewBox="0 0 56 56" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          <defs>
            <linearGradient id="feather-grad" x1="52" y1="4" x2="16" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor={isPointer ? "#fbbf24" : "#b45309"} />
              <stop offset="1" stopColor={isPointer ? "#fbbf24" : "#451a03"} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Integrated Feather Vane - Perfectly aligned to spine */}
          <motion.path
            d="M52 4C46 4 32 10 22 22C14 32 14 44 14 44L16 46C16 46 26 40 36 30C46 20 52 4 52 4Z"
            fill="url(#feather-grad)"
            fillOpacity={isPointer ? "0.35" : "0.15"}
            stroke={isPointer ? "rgba(251, 191, 36, 0.5)" : "rgba(180, 83, 9, 0.2)"}
            strokeWidth="0.4"
          />
          
          {/* Internal spine fine barbs */}
          {[...Array(5)].map((_, i) => (
            <path 
              key={i}
              d={`M${50 - i * 8} ${6 + i * 8}L${45 - i * 8} ${11 + i * 8}`} 
              stroke={isPointer ? "#fbbf24" : "#b45309"} 
              strokeWidth="0.4" 
              strokeOpacity="0.3" 
            />
          ))}
          
          {/* The Spine (Rachis) - One continuous elegant line */}
          <path
            d="M52 4L4 52"
            stroke={isPointer ? "#ffffff" : "#b45309"}
            strokeWidth={isPointer ? "1.2" : "0.8"}
            strokeLinecap="round"
          />
          
          {/* Needle Nib - Fused with spine for fluid transition */}
          <path
            d="M12 44L4 52L3 51L11 43L12 44Z"
            fill={isPointer ? "#ffffff" : "#0f172a"}
            stroke={isPointer ? "#fbbf24" : "#334155"}
            strokeWidth="0.5"
          />
          
          {/* Point Focus */}
          <circle cx="4" cy="52" r="1.2" fill={isPointer ? "#fbbf24" : "#b45309"} />
        </svg>

        {/* Click Splash */}
        {isMouseDown && (
          <div className="absolute top-[52px] left-[4px]">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1.2, 0], 
                  opacity: [1, 0],
                  x: (Math.random() - 0.5) * 25,
                  y: -Math.random() * 25
                }}
                className="absolute w-1 h-1 rounded-full bg-amber-950"
              />
            ))}
          </div>
        )}

        {/* Hover Drip */}
        {isPointer && !isMouseDown && (
          <div className="absolute top-[52px] left-[4px]">
             <motion.div
              initial={{ y: 0, opacity: 0, scale: 0.5 }}
              animate={{ 
                y: [0, 30],
                opacity: [0, 1, 0],
                scale: [0.5, 0.8, 0.2]
              }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeIn" }}
              className="absolute w-1.5 h-1.5 bg-amber-950 rounded-full"
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;
