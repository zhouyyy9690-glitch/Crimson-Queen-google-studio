/**
 * 背景层组件
 * 包含自定义光标、开场动画、滤镜及各种背景层（粒子、纹理）
 */
import React from 'react';
import { AnimatePresence } from 'motion/react';
import CustomCursor from './CustomCursor';
import { IntroScreen } from './IntroScreen';
import ParticleBackground from './ParticleBackground';
import { ParticleType } from '../types';

interface BackgroundLayersProps {
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
  particleType: ParticleType;
}

/**
 * BackgroundLayers 组件封装了游戏所有的底层视觉元素
 * 这样可以显著减少 App.tsx 的 DOM 深度和代码行数
 */
export const BackgroundLayers: React.FC<BackgroundLayersProps> = ({
  showIntro,
  setShowIntro,
  particleType
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
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] opacity-15 pointer-events-none mix-blend-overlay" />
      {/* 径向渐变：产生舞台光或聚焦效果 */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      
      {/* 动态粒子背景：渲染尘埃、雪花或萤火虫，增强环境氛围 */}
      <ParticleBackground type={particleType} />
    </>
  );
};
