import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronDown,
  Crown,
  Sword
} from 'lucide-react';
import { Paragraph, Choice, TextSegment, ParticleType } from '../types';
import { TypewriterText } from './TypewriterText';
import { ChoiceList } from './ChoiceList';
import { SFX_ASSETS } from '../audio';

/**
 * 场景展示组件属性接口
 */
interface SceneDisplayProps {
  sceneTitle: string; // 场景标题
  stageId: string | null; // 阶段ID
  paraObj: Paragraph | undefined; // 当前段落对象
  onNext: () => void; // “继续”的回调
  onSkip: () => void; // “跳过”的回调
  showChoices: boolean; // 是否显示选项列表
  showEnding: boolean; // 是否显示结局
  showStartTrigger: boolean; // 是否显示“开始书写”触发器
  onStart: () => void; // 开始游戏的回调
  choices: Choice[]; // 选项数组
  selectedChoice: Choice | null; // 已选中的选项
  onChoiceClick: (choice: Choice) => void; // 选项点击回调
  playSFX: (url: string, isMuted: boolean, volume?: number) => void; // 播放音效
  isMuted: boolean; // 是否静音
  sfxVolume: number; // 音效音量
  renderTextWithDialogue: (text: string, isThought?: boolean) => TextSegment[]; // 文本处理工具
  isMenuExpanded: boolean; // 菜单是否展开
  setIsMenuExpanded: (v: boolean) => void;
  setShowGallery: (v: boolean) => void;
  setShowProgress: (v: boolean) => void;
  setShowMap: (v: boolean) => void;
  sceneId: string; // 场景ID
  skipTypewriter?: boolean; // 是否跳过打字机效果
  particleType?: ParticleType; // 粒子背景类型
}

export const SceneDisplay = ({ 
  sceneTitle, 
  stageId, 
  paraObj, 
  onNext, 
  onSkip,
  showChoices, 
  showEnding, 
  showStartTrigger, 
  onStart,
  choices,
  selectedChoice,
  onChoiceClick,
  playSFX,
  isMuted,
  sfxVolume,
  renderTextWithDialogue,
  isMenuExpanded,
  setIsMenuExpanded,
  setShowGallery,
  setShowProgress,
  setShowMap,
  sceneId,
  skipTypewriter,
  particleType
}: SceneDisplayProps) => {
  const textSegments = useMemo(() => paraObj ? renderTextWithDialogue(paraObj.text, paraObj.isThought) : [], [paraObj, renderTextWithDialogue]);
  
  const timeInfo = useMemo(() => {
    // Hide for ending scenes
    const isEnding = sceneId.toLowerCase().includes('ending');
    if (isEnding) return null;

    switch (particleType) {
      case 'dust': return { latin: 'Aurea Mane', colorClass: 'text-amber-500', glowClass: 'bg-amber-400' };
      case 'evening': return { latin: 'Vesperis', colorClass: 'text-orange-600', glowClass: 'bg-orange-500' };
      case 'nature': return { latin: 'Silen Nocte', colorClass: 'text-blue-500', glowClass: 'bg-blue-400' };
      default: return null;
    }
  }, [particleType, sceneId]);

  const isKillScene = sceneId.toLowerCase().includes('kill') || sceneId === 'F41_TrapDeath-1';
  
  // 内部状态：记录当前段落是否正在打字
  const [isTypingComplete, setIsTypingComplete] = React.useState(skipTypewriter);

  // 当段落改变时，重置打字状态
  React.useEffect(() => {
    setIsTypingComplete(!!skipTypewriter);
  }, [paraObj, skipTypewriter]);

  // Override colors for kill scenes
  const themeColorClass = isKillScene ? 'text-rose-600' : (timeInfo?.colorClass || 'text-amber-900/40');
  const themeGlowClass = isKillScene ? 'bg-rose-500' : (timeInfo?.glowClass || 'bg-amber-400');

  return (
    <div className="space-y-8 lg:space-y-6 relative">
      <div className="text-left relative z-10">
        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ 
             opacity: 1, 
             y: 0,
           }}
           transition={{ duration: 0.8 }}
           className="flex flex-col items-center"
        >
          {/* 1. Scene Title */}
          <motion.h2 
            className="font-display text-4xl md:text-5xl lg:text-6xl text-amber-600 tracking-wider leading-tight mb-4 text-center"
          >
            {sceneTitle}
          </motion.h2>

          {/* 2. Ornate Divider (directly below title) */}
          <div className="w-32 md:w-56 h-px bg-gradient-to-r from-transparent via-amber-900/30 to-transparent mx-auto relative mb-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-amber-900/50 bg-[#0a0a0a]" />
          </div>

          {/* 3. Latin Time Prompt (below divider) */}
          {timeInfo && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col items-center transition-colors duration-1000 ${themeColorClass}`}
            >
              <span className="font-mono text-[10px] md:text-xs tracking-[0.8em] uppercase opacity-60">
                {timeInfo.latin}
              </span>
            </motion.div>
          )}

          <div className="h-2" />
        </motion.div>

        <div className="min-h-[160px] lg:min-h-[200px] flex items-center justify-center mt-6 mb-10">
          {paraObj && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={paraObj.text}
              className="text-lg md:text-2xl lg:text-2xl leading-relaxed font-serif text-justify whitespace-pre-wrap max-w-xl lg:max-w-3xl mx-auto px-4 md:px-0 text-[#d4d4d8] drop-shadow-sm"
            >
              {isTypingComplete ? (
                textSegments.map((seg, i) => (
                  <span key={i} className={seg.className}>
                    {seg.text}
                  </span>
                ))
              ) : (
                <TypewriterText 
                  segments={textSegments} 
                  onComplete={() => setIsTypingComplete(true)}
                />
              )}
            </motion.p>
          )}
        </div>
      </div>

      {!showChoices && !showEnding && !showStartTrigger && (
        <div className="flex flex-col items-center gap-4 mt-2 pb-10">
          {/* Continue 按钮：始终保持显示 */}
          <button
            onClick={onNext}
            className="flex items-center gap-2 text-amber-600/90 hover:text-amber-400 transition-colors uppercase tracking-[0.3em] text-[11px] cursor-pointer group py-2 opacity-100"
          >
            Continue
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>

          {/* Skip 按钮：跳过不断浮现的文本，直接跳到有选项的位置 */}
          <button
            onClick={() => {
              if (!isTypingComplete) {
                setIsTypingComplete(true);
              }
              onSkip();
            }}
            className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors uppercase tracking-[0.4em] text-[9px] py-1 cursor-pointer"
          >
            Skip
          </button>
        </div>
      )}

      {showStartTrigger && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          className="flex flex-col items-center gap-12 mt-16"
        >
          <button
            onClick={onStart}
            className="group relative py-2 px-8 text-amber-900/40 hover:text-amber-600 transition-all duration-1000 cursor-pointer"
          >
            <span className="font-display text-lg tracking-[0.8em] uppercase">Start Writing</span>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-amber-600 group-hover:w-full transition-all duration-1000" />
          </button>

          {/* Crown & Sword Menu */}
          <div className="relative h-32 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!isMenuExpanded ? (
                <motion.button
                  key="collapsed"
                  layoutId="menu-icon"
                  onClick={() => setIsMenuExpanded(true)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2, rotate: 90 }}
                  whileHover={{ scale: 1.1 }}
                  className="relative w-20 h-20 flex items-center justify-center cursor-pointer group"
                >
                  <div className="absolute inset-0 border-2 border-amber-900/20 rounded-full group-hover:border-amber-600/40 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
                  <div className="absolute inset-1 border border-amber-900/10 rounded-full" />
                  <div className="absolute inset-[2px] border border-amber-900/5 rounded-full" />
                  
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Crown className="w-10 h-10 text-amber-700/80 absolute -translate-y-2 -translate-x-1 rotate-[-15deg] group-hover:text-amber-600 transition-colors drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]" />
                    <Sword className="w-10 h-10 text-amber-800/60 absolute translate-y-2 translate-x-1 rotate-[165deg] group-hover:text-amber-700 transition-colors drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]" />
                  </div>
                  
                  {/* Decorative Glow */}
                  <div className="absolute inset-0 bg-amber-600/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ) : (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-16 items-center relative"
                >
                  {/* Invisible backdrop to close menu */}
                  <div 
                    className="fixed inset-0 z-[-1] cursor-pointer" 
                    onClick={() => setIsMenuExpanded(false)}
                  />
                  
                  {/* Crown Button (Gallery) */}
                  <motion.button
                    layoutId="menu-crown"
                    onClick={() => {
                      setShowGallery(true);
                      setIsMenuExpanded(false);
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      filter: "brightness(1.3) drop-shadow(0 0 12px rgba(217, 119, 6, 0.6))"
                    }}
                    whileTap={{ 
                      scale: 0.9,
                      filter: "brightness(1.5) drop-shadow(0 0 20px rgba(217, 119, 6, 0.8))"
                    }}
                    className="flex flex-col items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-full border-2 border-amber-900/40 flex items-center justify-center bg-neutral-900/60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] group-hover:border-amber-600 transition-all">
                      <Crown className="w-10 h-10 text-amber-600 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <span className="text-[10px] font-display uppercase tracking-[0.5em] text-amber-900/60 group-hover:text-amber-600 transition-colors">Gallery</span>
                  </motion.button>

                  {/* Sword Button (Progress) */}
                  <motion.button
                    layoutId="menu-sword"
                    onClick={() => {
                      setShowProgress(true);
                      setIsMenuExpanded(false);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ 
                      rotate: [-20, 20, -20, 20, 0],
                      transition: { duration: 0.4 }
                    }}
                    className="flex flex-col items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-full border-2 border-amber-900/40 flex items-center justify-center bg-neutral-900/60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] group-hover:border-amber-600 transition-all">
                      <motion.div
                        whileHover={{ 
                          rotate: [45, 35, 55, 45],
                          transition: { repeat: Infinity, duration: 1 }
                        }}
                      >
                        <Sword className="w-10 h-10 text-amber-700 group-hover:text-amber-500 transition-colors rotate-[45deg]" />
                      </motion.div>
                    </div>
                    <span className="text-[10px] font-display uppercase tracking-[0.5em] text-amber-900/60 group-hover:text-amber-600 transition-colors">Progress</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* 选项列表区域：当文本播放完毕且该阶段存在选项时显示 */}
      <ChoiceList 
        choices={choices}
        showChoices={showChoices}
        selectedChoice={selectedChoice}
        onChoiceClick={onChoiceClick}
        playSFX={playSFX}
        isMuted={isMuted}
        sfxVolume={sfxVolume}
        sceneId={sceneId}
        SFX_ASSETS={SFX_ASSETS}
      />
    </div>
  );
};
