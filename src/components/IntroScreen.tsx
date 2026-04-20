import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * 华丽开场动画组件 Props 接口
 */
interface IntroScreenProps {
  onComplete: () => void; // 动画播放完成或跳过时的回调
}

/**
 * IntroScreen 组件 - 哥特风开场动画
 * 实现标题的书写笔触效果、暗红渐变以及注意事项的滚动。
 */
export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-center text-center overflow-hidden"
      onClick={onComplete}
    >
      {/* 渐变背景底层 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0a0a0a_0%,#000000_100%)]" />

      {/* 标题容器 */}
      <div className="relative mb-8 z-10 pointer-events-none">
        {/* 主标题 - 哥特花体字，应用 crimson-writing 动画 */}
        <h1 
          className="font-gothic text-5xl md:text-7xl lg:text-8xl font-black tracking-widest uppercase relative inline-block animate-[crimson-writing_4s_cubic-bezier(0.2,0.9,0.4,1.1)_forwards]"
          style={{ transformOrigin: 'center' }}
        >
          The Crimson Queen
          
          {/* 笔触扫过光效 (模拟书写痕迹) */}
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,transparent_30%,rgba(180,40,40,0.4)_50%,transparent_70%,transparent_100%)] bg-[length:200%_100%] bg-no-repeat animate-[brush-stroke_2s_ease-in-out_forwards]" />
        </h1>

        {/* 副标题：淡入上浮 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 2 }}
          className="font-gothic text-base md:text-xl tracking-[0.3em] text-[#8a6e4b] mt-4"
        >
          ✦ 绛红女王 ✦
        </motion.div>
      </div>

      {/* 注意事项容器：淡入停留后淡出 */}
      <div className="z-10 pointer-events-none px-8 py-4 max-w-lg">
        <div className="bg-black/60 backdrop-blur-sm border-l-4 border-[#8b0000] px-6 py-4 rounded-r-lg animate-[notice-fade_3s_3.5s_forwards] opacity-0 text-[#bbb] text-sm md:text-base leading-loose font-serif">
          <p className="mb-1">※ 本故事纯属虚构 ※</p>
          <p>涉及政治、情感与成人内容，请斟酌体验</p>
        </div>
      </div>

      {/* 跳过提示 */}
      <div className="absolute bottom-10 right-10 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#555] hover:text-[#aa6f6f] transition-colors cursor-pointer flex items-center gap-2 group"
        >
          <span className="group-hover:translate-x-1 transition-transform">⏵</span>
          跳过动画 · Skip Intro
        </button>
      </div>
    </motion.div>
  );
};
