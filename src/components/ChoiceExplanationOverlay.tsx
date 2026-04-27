/**
 * 选项解释覆盖层
 * 当玩家做出重要选择（路径选择）时，显示该选择的深层含义和艺术化图案
 */
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimalPattern } from './AnimalPattern';
import { Button } from './Button';
import { Choice } from '../types';

interface ChoiceExplanationOverlayProps {
  show: boolean;
  choice: Choice | null;
  onProceed: (choice: Choice) => void;
}

/**
 * ChoiceExplanationOverlay 组件用于特定路径选择后的即时反馈
 * 它提供了剧情沉浸感，并在正式进入路径前给予心理提示
 */
export const ChoiceExplanationOverlay: React.FC<ChoiceExplanationOverlayProps> = ({
  show,
  choice,
  onProceed
}) => {
  return (
    <AnimatePresence>
      {show && choice && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-[#0a0a0a]/90 backdrop-blur-md"
        >
          {/* 主容器：包含边框和内部背景 */}
          <div className="relative max-w-lg w-full p-8 md:p-12 border-2 border-amber-900/40 bg-[#0a0a0a] text-center overflow-hidden">
            {/* 这里的动物图案背景根据选择的类型动态变化 */}
            <AnimalPattern type={choice.animalType} />
            
            <div className="relative z-10 space-y-6 md:space-y-8">
              {/* 选项标题 */}
              <h3 className="font-display text-2xl md:text-3xl text-amber-600 tracking-[0.3em] uppercase">
                {choice.text}
              </h3>
              
              <div className="w-16 h-px bg-amber-900/40 mx-auto" />
              
              {/* 解释性文本：由剧情策划编写的深层隐喻 */}
              <p className="text-lg md:text-xl text-neutral-300 italic leading-relaxed">
                {choice.explanation}
              </p>
              
              {/* 确认按钮：正式进入后续剧情 */}
              <Button
                onClick={() => onProceed(choice)}
                className="mt-8 px-8 py-3 border border-amber-900/40 text-amber-700 hover:text-amber-500 hover:border-amber-700 uppercase tracking-widest text-xs"
              >
                Enter the Path
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
