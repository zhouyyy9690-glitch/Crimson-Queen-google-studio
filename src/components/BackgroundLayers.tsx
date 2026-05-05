/**
 * 背景层组件
 * 包含自定义光标、开场动画、滤镜及各种背景层（粒子、纹理）
 */
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CustomCursor from './CustomCursor';
import { IntroScreen } from './IntroScreen';
import ParticleBackground from './ParticleBackground';
import { ParticleType } from '../types';

interface BackgroundLayersProps {
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
  particleType: ParticleType;
  isNarrativeMode?: boolean;
}

/**
 * BackgroundLayers 组件封装了游戏所有的底层视觉元素
 * 这样可以显著减少 App.tsx 的 DOM 深度和代码行数
 */
export const BackgroundLayers: React.FC<BackgroundLayersProps> = ({
  showIntro,
  setShowIntro,
  particleType,
  isNarrativeMode = false
}) => {
  return (
    <>
      {/* 自定义鼠标指针组件 - 只有较大屏幕可见 */}
      <CustomCursor />
      
      {/* 开场动画层 - 初次加载时显示 */}
      <AnimatePresence>
        {showIntro && (
          <IntroScreen onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* 墨水失真与羊皮纸滤镜：通过 SVG filter 实现复古质感，用于文本渲染的特殊效果 */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <filter id="ink-distortion">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
        </filter>
      </svg>

      {/* 全局背景纹理：通过叠加多层图片实现纸张和皮革的触感 */}
      <motion.div 
        animate={{ opacity: isNarrativeMode ? 0 : 0.2 }}
        className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] pointer-events-none" 
      />
      
      {/* 桌面底层：深色木质感 - 增强木纹可见度 */}
      <motion.div 
        animate={{ backgroundColor: isNarrativeMode ? '#000000' : '#0f0c08' }}
        transition={{ duration: 1.5 }}
        className="fixed inset-0 pointer-events-none" 
      />
      <motion.div 
        animate={{ opacity: isNarrativeMode ? 0 : 0.08 }}
        className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none" 
      />
      
      {/* 氛围灯光：由于烛火在不同位置，这里使用大面积径向渐变模拟环境光 */}
      <motion.div 
        animate={{ opacity: isNarrativeMode ? 0.3 : 1 }}
        className="fixed inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(45,28,12,0.1)_0%,rgba(0,0,0,0.95)_80%)] pointer-events-none mix-blend-multiply" 
      />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(217,119,6,0.05)_0%,rgba(0,0,0,0)_60%)] pointer-events-none mix-blend-screen" />
      
      {/* 纸张质感叠加（局部，仅限中央区域，通过遮罩或渐变） */}
      <motion.div 
        animate={{ opacity: isNarrativeMode ? 0 : 0.05 }}
        className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] pointer-events-none mix-blend-overlay" 
      />
      
      {/* 动态粒子背景：渲染尘埃、雪花或萤火虫，增强环境氛围 */}
      <ParticleBackground type={particleType} />
    </>
  );
};
