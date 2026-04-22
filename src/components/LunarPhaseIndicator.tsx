import React from 'react';
import { motion } from 'motion/react';

interface LunarPhaseIndicatorProps {
  progress: number; // 0 to 1
  size?: number;
  className?: string;
  color?: string;
}

/**
 * 盈月进度指示器 (Lunar Phase Indicator)
 * 根据解锁进度显示从新月到满月的演变。
 * 对应“神圣少女”的月相变化，象征神启与在场。
 */
export const LunarPhaseIndicator: React.FC<LunarPhaseIndicatorProps> = ({ 
  progress, 
  size = 24, 
  className = "",
  color = "currentColor"
}) => {
  // 核心逻辑：通过遮罩圆的移动来模拟月相变化
  // 0: 新月 (New Moon)
  // 0.25: 蛾眉月 (Crescent)
  // 0.5: 上弦月 (First Quarter)
  // 0.75: 盈凸月 (Gibbous)
  // 1.0: 满月 (Full Moon)
  
  const rotation = 0; // 可以根据需要调整角度
  
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="moon-mask">
            {/* 背景白圆表示月面 */}
            <rect width="100" height="100" fill="white" />
            
            {/* 遮罩圆：通过 X 坐标偏移模拟阴影 */}
            {/* 当 progress 为 1 时，阴影完全移出 */}
            <motion.circle 
              cx={100 - (progress * 130)} 
              cy="50" 
              r="48" 
              fill="black"
              initial={false}
              animate={{ cx: 100 - (progress * 130) }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </mask>
          
          <filter id="moon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 月亮本体 */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill={color} 
          mask="url(#moon-mask)" 
          className="opacity-90"
          style={{ filter: progress > 0.8 ? 'url(#moon-glow)' : 'none' }}
        />
        
        {/* 外边框 */}
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          stroke={color} 
          strokeWidth="1.5" 
          opacity="0.3"
        />
        
        {/* 装饰细节：如果是满月，增加神圣光芒纹路 */}
        {progress > 0.9 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2 }}
          >
             <line x1="50" y1="5" x2="50" y2="95" stroke={color} strokeWidth="0.5" strokeDasharray="2 4" />
             <line x1="5" y1="50" x2="95" y2="50" stroke={color} strokeWidth="0.5" strokeDasharray="2 4" />
          </motion.g>
        )}
      </svg>
    </div>
  );
};
