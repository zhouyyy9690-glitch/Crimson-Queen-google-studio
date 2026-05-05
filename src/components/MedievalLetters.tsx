import React from 'react';
import { motion } from 'motion/react';

/**
 * 中世纪信件组件 - 已锁死坐标
 * 作为桌面背景装饰，层级较低，散落在书堆周围。
 * 新增了烛光晃动滤镜。
 */
export const MedievalLetters: React.FC<{ 
  onReturn?: () => void, 
  isNarrativeMode?: boolean 
}> = ({ onReturn, isNarrativeMode = false }) => {
  const FIXED_LETTERS = [
    { id: 1, right: 22.9, top: 132, rotate: -5,  z: 0  },
    { id: 2, right: 86.3, top: 183, rotate: 5,   z: 10 },
    { id: 3, right: 1.5,  top: 343, rotate: -8,  z: 12, isButton: true },
    { id: 4, right: 29.0, top: -58, rotate: -20, z: 13 },
    { id: 5, right: 80.7, top: 27,  rotate: 24,  z: 14 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {FIXED_LETTERS.map((letter) => (
        <motion.div
          key={letter.id}
          // 局部烛光滤镜：让每一封信件都随火光微微闪烁，增强环境沉浸感
          animate={{
            filter: [
              "brightness(1) contrast(1)",
              "brightness(1.03) contrast(1.01)",
              "brightness(0.97) contrast(0.98)",
              "brightness(1.06) contrast(1.03)",
              "brightness(1.01) contrast(1)"
            ],
            scale: letter.isButton && isNarrativeMode ? [1, 1.02, 1] : 1
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: letter.id * 0.2 // 错开晃动频率，避免所有信件同步闪烁显得假
          }}
          className="absolute pointer-events-none select-none"
          style={{
            right: `${letter.right}%`,
            top: `${letter.top}px`,
            rotate: `${letter.rotate}deg`,
            zIndex: letter.z,
          }}
        >
          {/* 信件视觉表现：中世纪羊皮纸感 */}
          <div className={`relative w-40 h-56 bg-[#f4e4bc] shadow-lg border border-amber-900/10 transition-all duration-700 ${letter.isButton && isNarrativeMode ? 'shadow-amber-900/40 ring-1 ring-amber-900/20' : ''}`}>
            {/* 纸张纹理 */}
            <div className="absolute inset-0 opacity-20 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
            
            {/* 基础信件线条（始终保留，维持视觉一致性） */}
            <div className="p-4 space-y-2 mt-4 opacity-30">
              <div className="h-0.5 w-full bg-amber-950/20" />
              <div className="h-0.5 w-4/5 bg-amber-950/20" />
              <div className="h-0.5 w-full bg-amber-950/20" />
              <div className="h-0.5 w-3/4 bg-amber-950/20" />
              <div className="h-0.5 w-full bg-amber-950/20" />
            </div>

            {/* 如果是返回按钮，在信件内容上叠加文字 */}
            {letter.isButton && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div 
                  onClick={isNarrativeMode ? onReturn : undefined}
                  className={`text-center transition-all duration-1000 ${isNarrativeMode ? 'opacity-100 scale-100 translate-y-2 pointer-events-auto cursor-pointer' : 'opacity-30 scale-95 pointer-events-none'}`}
                >
                  <span 
                    className={`font-latin text-xl transition-colors duration-1000 ${isNarrativeMode ? 'text-rose-950 drop-shadow-[0_0_8px_rgba(159,18,57,0.3)]' : 'text-amber-900/40'}`}
                    style={{ fontFamily: "'Uncial Antiqua', serif" }}
                  >
                    Return <br /> to Study
                  </span>
                </div>
              </div>
            )}

            {/* 模拟蜡封（始终保留） */}
            <div className="absolute bottom-6 right-6 w-9 h-9 rounded-full bg-rose-950 shadow-inner flex items-center justify-center overflow-hidden rotate-12">
               <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/20 opacity-60" />
               <div className="w-5 h-5 border border-rose-200/20 rounded-full flex items-center justify-center">
                 {/* 移除了字母 H */}
               </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
