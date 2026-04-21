import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * 华丽开场动画组件 Props 接口
 */
interface IntroScreenProps {
  onComplete: () => void; // 动画播放完成或跳过时的回调
}

/**
 * IntroScreen 组件 - 哥特风开场动画 (两段式)
 */
export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'title' | 'tips'>('title');

  useEffect(() => {
    if (stage === 'title') {
      // 第一阶段：标题展示 (浮现 -> 书写 -> 隐没)
      // 总时长约 6 秒
      const timer = setTimeout(() => {
        setStage('tips');
      }, 6500); 
      return () => clearTimeout(timer);
    } else {
      // 第二阶段：提示页面
      // 停留 5 秒后自动结束，或由用户点击结束
      const timer = setTimeout(() => {
        onComplete();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [stage, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-center text-center overflow-hidden cursor-none"
      onClick={() => {
        if (stage === 'title') setStage('tips');
        else onComplete();
      }}
    >
      <AnimatePresence mode="wait">
        {stage === 'title' ? (
          <motion.div
            key="title-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="flex flex-col items-center justify-center w-full h-full bg-black relative"
          >
            {/* 标题容器 */}
            <div className="relative mb-8 z-10">
              {/* 主标题 */}
              <div className="relative inline-block overflow-hidden">
                <motion.h1 
                  className="font-gothic text-5xl md:text-7xl lg:text-8xl font-black tracking-widest uppercase text-[#5a0a0a]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0.2, 0],
                    scale: [0.95, 1, 1.05, 1.05, 1.05],
                    filter: ["brightness(0) blur(10px)", "brightness(1) blur(0px)", "brightness(1.5)", "brightness(0.5) blur(5px)", "brightness(0) blur(20px)"]
                  }}
                  transition={{ 
                    duration: 6,
                    times: [0, 0.2, 0.7, 0.9, 1],
                    ease: "easeInOut"
                  }}
                >
                  The Crimson Queen
                </motion.h1>

                {/* 书写感光标 (Writing Cursor Effect) */}
                <motion.div 
                  className="absolute top-0 bottom-0 w-[4px] bg-amber-600/80 shadow-[0_0_15px_#fbbf24]"
                  initial={{ left: "0%" }}
                  animate={{ left: "100%", opacity: [0, 1, 1, 0, 0] }}
                  transition={{ 
                    duration: 3, 
                    delay: 1.2,
                    times: [0, 0.1, 0.8, 0.9, 1],
                    ease: "linear"
                  }}
                />
              </div>

              {/* 中文标题 */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  y: [10, 0, -5, -20]
                }}
                transition={{ 
                  duration: 5,
                  times: [0, 0.3, 0.8, 1],
                  delay: 1.5
                }}
                className="font-gothic text-base md:text-xl tracking-[0.6em] text-[#8a6e4b] mt-6"
              >
                ✦ 绛红女王 ✦
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="tips-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center justify-center w-full h-full"
          >
            {/* 渐变背景底层 */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0a0a0a_0%,#000000_100%)] opacity-60" />

            {/* 注意事项容器 */}
            <div className="z-10 px-8 py-4 max-w-lg">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5 }}
                className="bg-black/60 backdrop-blur-sm border-l-4 border-[#8b0000] px-8 py-6 rounded-r-lg text-[#bbb] text-sm md:text-base leading-loose font-serif text-left shadow-2xl"
              >
                <p className="mb-3 text-amber-700/80 font-display tracking-widest text-xs">ADVISORY</p>
                <p className="mb-2 text-white/90">※ 本故事纯属虚构 ※</p>
                <p>涉及政治、情感与成人内容，请斟酌体验。</p>
                <div className="mt-8 flex items-center gap-3 opacity-30">
                  <div className="h-px flex-grow bg-gradient-to-r from-transparent to-neutral-700" />
                  <span className="text-[10px] uppercase font-mono tracking-tighter">Initializing Chronicle</span>
                  <motion.span 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1.5 h-1.5 rounded-full bg-amber-600"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 跳过提示 */}
      <div className="absolute bottom-10 right-10 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#333] hover:text-[#aa6f6f] transition-colors cursor-none flex items-center gap-2 group"
        >
          <span className="group-hover:translate-x-1 transition-transform">⏵</span>
          跳过 · Skip
        </button>
      </div>
    </motion.div>
  );
};
