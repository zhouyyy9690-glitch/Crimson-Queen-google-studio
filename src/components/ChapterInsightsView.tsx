import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X } from 'lucide-react';
import { Insight, Location } from '../types';

interface ChapterInsightsViewProps {
  chapter: any;
  insights: Insight[];
  unlockedInsights: Set<string>;
  locations: Location[];
  pageDirection?: 'next' | 'prev'; // 新增：翻页方向
  pageTrigger?: number; // 新增：每次翻页变化一次，用于触发动画
}

/**
 * 19世纪版画风格渡鸦：纯黑、锐利、生物学结构准确
 */
const StandingRaven = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M78 85c-2 0-4-1-5-3c-4-6-6-15-2-22c3-5 8-8 12-11c2-1 3-3 2-5c-6-12-18-18-30-15s-20 12-21 24c0 4 1 8 3 11l-8 12l10-2l6 10c8 2 17 0 24-5c3-2 6-5 9-8c2 2 4 4 6 6c1 1 1 3 0 4l-6 10zM35 30c-2 0-4-2-4-4s2-4 4-4s4 2 4 4s-2 4-4 4z" />
    <path d="M42 88l-4 6h-2l2-6zM50 88l-2 6h-2l2-6z" />
  </svg>
);

const SpreadingRaven = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M50 40c-2-8-8-15-16-18c-3-1-5-1-7 0c0 4 2 8 5 11c-5 0-10 2-14 6s-6 12-4 18l-8 15l10-8l12 4c15 0 28-10 32-24c5-5 8-12 10-18zm-22-4c-2 0-4-2-4-4s2-4 4-4s4 2 4 4s-2 4-4 4z" />
    <path d="M55 42c8 1 16 4 24 10c14 10 21 25 21 25s-10-20-25-30s-30-10-30-10z" />
    <path d="M45 42c-8 1-16 4-24 10c-14 10-21 25-21 25s10-20 25-30s30-10 30-10z" />
    <path d="M42 80l8 12l8-12h-16z" />
  </svg>
);

const TakeoffRaven = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M30 50c5-5 12-8 20-8s15 3 20 8l30-20l-20 40l-10-5c0 10-5 18-12 24c-12 10-30 10-42 0c-7-6-12-14-12-24l-10 5l-20-40l30 20zM50 60c-2 0-4-2-4-4s2-4 4-4s4 2 4 4s-2 4-4 4z" />
    <path d="M50 42l-5-15l5-5l5 5l-5 15z" />
  </svg>
);

/**
 * 第一只：摇头点地（寻找痕迹感）
 */
const ForagingRaven = ({ x, y }: { x: number; y: number }) => (
  <motion.div
    className="absolute z-30 pointer-events-none origin-bottom"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      rotate: [0, 8, 0, -5, 0],
      scaleX: [1, 1, -1, -1, 1], // 偶尔回头
      y: [0, 2, 0, 1, 0]
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut'
    }}
  >
    <StandingRaven className="w-20 h-20 text-black drop-shadow-md" />
  </motion.div>
);

/**
 * 第二只：感知光标（展翅梳羽）
 */
const ReactiveRaven = ({ x, y, isAroused }: { x: number; y: number; isAroused: boolean }) => (
  <motion.div
    className="absolute z-30 pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      scale: isAroused ? 1.2 : 1,
      y: isAroused ? -5 : 0
    }}
  >
    <AnimatePresence mode="wait">
      {isAroused ? (
        <motion.div
          key="spreading"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <SpreadingRaven className="w-24 h-24 text-black" />
        </motion.div>
      ) : (
        <motion.div
          key="standing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <StandingRaven className="w-20 h-20 text-black/90" />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

/**
 * 第三只：栖息在标题支架上，翻页飞走
 */
const PerchedRaven = ({
  fly,
  direction
}: {
  fly: boolean;
  direction: 'next' | 'prev';
}) => {
  const shouldActuallyFly = fly && direction === 'next';

  return (
    <motion.div
      className="absolute z-40 pointer-events-none"
      initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
      animate={
        shouldActuallyFly
          ? {
              x: 800,
              y: -400,
              rotate: 15,
              opacity: 0,
              scale: 0.5
            }
          : {
              y: [0, -1, 0]
            }
      }
      transition={{
        duration: shouldActuallyFly ? 1.8 : 4,
        ease: shouldActuallyFly ? "easeIn" : "easeInOut"
      }}
      style={{ top: '8%', right: '15%' }}
    >
      {shouldActuallyFly ? (
        <TakeoffRaven className="w-28 h-28 text-black" />
      ) : (
        <StandingRaven className="w-24 h-24 text-black" />
      )}
    </motion.div>
  );
};

/**
 * 章节见闻展示组件：静态羊皮纸地图风格，展示手写风格的见闻名称
 */
export const ChapterInsightsView: React.FC<ChapterInsightsViewProps> = ({
  chapter,
  insights,
  unlockedInsights,
  locations,
  pageDirection = 'next',
  pageTrigger = 0
}) => {
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [hoveredInsight, setHoveredInsight] = useState<string | null>(null);

  // 翻页时触发飞走动画
  const [isFlying, setIsFlying] = useState(false);

  React.useEffect(() => {
    if (pageTrigger > 0) {
      setIsFlying(true);

      const timer = setTimeout(() => {
        setIsFlying(false);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [pageTrigger]);

  // 筛选出属于当前章节高亮地点的见闻
  const chapterInsights = insights.filter(ins =>
    chapter.highlightLocations?.includes(ins.locationId || '')
  );

  return (
    <div className="w-full h-full relative bg-[#d4a85a] overflow-hidden select-none">
      {/* 羊皮纸底层纹理 */}
      <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
      
      {/* 静态装饰背景：手绘风格地图轮廓简化版 */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <path 
          d="M 50 100 Q 150 50 300 100 T 500 150 T 700 100" 
          fill="none" 
          stroke="#8b4513" 
          strokeWidth="1.5" 
          strokeDasharray="10 15" 
        />
        <path 
          d="M 200 400 Q 400 300 600 500" 
          fill="none" 
          stroke="#8b4513" 
          strokeWidth="1" 
          strokeDasharray="5 10" 
        />
      </svg>

      {/* 三只渡鸦 */}
      <ForagingRaven x={12} y={22} />
      <ReactiveRaven x={82} y={58} isAroused={!!hoveredInsight} />
      <PerchedRaven fly={isFlying} direction={pageDirection as 'next' | 'prev'} />

      {/* 见闻词条列表：模拟嵌在纸上的手写字迹 */}
      <div className="absolute inset-0 p-12 md:p-20">
        <div className="flex flex-col items-center mb-12 text-center relative max-w-2xl mx-auto">
            <h3 className="font-chinese text-neutral-800/40 text-[9px] tracking-[0.8em] uppercase mb-4">
              — 秘 辛 拾 遗 · Observations —
            </h3>

            <div className="relative inline-block group">
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-neutral-950/80 tracking-[0.1em] font-bold italic mb-2 relative z-10">
                {chapter.id.split('-').join(' ').toUpperCase()}
              </h2>
              
              {/* 装饰性底线：渡鸦的支架 */}
              <div className="absolute -bottom-1 left-[-20%] right-[-20%] h-0.5 bg-gradient-to-r from-transparent via-neutral-950/20 to-transparent" />
              <div className="absolute -bottom-2.5 left-[10%] right-[10%] h-px bg-neutral-950/10" />
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="w-8 h-px bg-neutral-950/10" />
              <span className="font-chinese text-sm md:text-base text-neutral-800/50 tracking-[0.4em]">
                {chapter.title}
              </span>
              <div className="w-8 h-px bg-neutral-950/10" />
            </div>
        </div>

        <div className="relative w-full h-[60%] flex flex-wrap justify-center items-center gap-x-12 gap-y-16 md:gap-x-24 md:gap-y-24 px-8 md:px-20">
          {chapterInsights.length > 0 ? (
            chapterInsights.map((insight, idx) => {
              const isUnlocked = unlockedInsights.has(insight.id);
              const isSelected = selectedInsight?.id === insight.id;
              
              const rotation = (idx * 17) % 6 - 3;
              const offsetX = (idx * 31) % 15 - 7;
              const offsetY = (idx * 23) % 15 - 7;

              return (
                <motion.button
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  onClick={() => isUnlocked && setSelectedInsight(insight)}
                  onMouseEnter={() => isUnlocked && setHoveredInsight(insight.id)}
                  onMouseLeave={() => setHoveredInsight(null)}
                  disabled={!isUnlocked}
                  style={{ 
                    rotate: `${rotation}deg`,
                    x: offsetX,
                    y: offsetY
                  }}
                  className={`relative group transition-all duration-700 ${isUnlocked ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <span className={`handwritten-ink text-lg md:text-xl lg:text-2xl tracking-widest whitespace-nowrap ${
                    !isUnlocked 
                      ? 'text-neutral-900/5 blur-[2px]' 
                      : isSelected 
                        ? 'text-rose-900 font-bold underline underline-offset-8 decoration-rose-900/40' 
                        : 'text-neutral-950/70 hover:text-rose-800'
                  }`}
                  style={{ 
                    textShadow: isSelected ? '1px 1px 2px rgba(0,0,0,0.1)' : 'none'
                  }}>
                    {isUnlocked ? insight.title : '？？？？'}
                  </span>

                  {isUnlocked && (
                    <motion.div 
                      initial={false}
                      animate={isSelected ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                      className="absolute -inset-4 bg-rose-900/5 rounded-[40%_60%_70%_30%] blur-md -z-10"
                    />
                  )}
                </motion.button>
              );
            })
          ) : (
            <div className="flex flex-col items-center text-neutral-900/20 italic font-chinese">
              <MessageSquare className="w-12 h-12 mb-4 opacity-5" />
              <p className="tracking-widest">此间尘埃漫布，暂无密辛可寻。</p>
            </div>
          )}
        </div>

        {/* 底部装饰 */}
        <div className="absolute bottom-12 left-0 right-0 text-center">
            <p className="font-typewriter text-[9px] text-neutral-950/20 uppercase tracking-[0.4em]">
              Collected Observations & Local Rumors
            </p>
        </div>
      </div>

      {/* 见闻详情弹窗 */}
      <AnimatePresence>
        {selectedInsight && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[85%] max-w-md z-50"
          >
            <div className="bg-[#f5e6c8] border border-neutral-900/10 shadow-[0_15px_40px_rgba(0,0,0,0.2)] p-6 md:p-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-neutral-900/20" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-neutral-900/20" />
              
              <button 
                onClick={() => setSelectedInsight(null)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-px bg-rose-900/30" />
                  <span className="font-chinese text-rose-900/60 text-[10px] tracking-widest uppercase">Secret Insight</span>
                </div>

                <h4 className="font-chinese text-xl text-neutral-900 tracking-wider">
                  {selectedInsight.title}
                </h4>

                <div className="h-px bg-neutral-900/5 w-full" />

                <p className="font-chinese text-neutral-700/90 italic leading-relaxed text-sm md:text-base">
                  {selectedInsight.description}
                </p>
                
                {selectedInsight.locationId && (
                  <div className="pt-4 flex items-center justify-end gap-2 text-neutral-400">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] uppercase font-display tracking-widest">
                      {locations.find(l => l.id === selectedInsight.locationId)?.name || 'Unknown Location'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MapPin = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);