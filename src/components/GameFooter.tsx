import React from 'react';
import { Shield, Scroll } from 'lucide-react';

/**
 * 游戏页脚组件 Props 接口
 */
interface GameFooterProps {
  currentSceneId: string;
}

/**
 * GameFooter 组件 - 底部导航与状态栏
 * 包含游戏主标题（可点击进入章节选择）、全局交互按钮（人物志、地图）以及底部的场景 ID 标识。
 */
export const GameFooter: React.FC<GameFooterProps> = ({
  currentSceneId
}) => {
  return (
    <footer className="mt-4 pt-4 relative z-10 w-full group/footer flex flex-col items-center px-4">
      {/* 标题装饰线 */}
      <div className="flex items-center justify-center gap-4 w-full mb-6">
        <div className="flex-grow h-px bg-amber-900/10" />
        <div className="relative">
          <h1 className="font-display text-[9px] md:text-sm tracking-[0.4em] text-amber-800/30 uppercase transition-all duration-1000 group-hover/footer:tracking-[0.6em] group-hover/footer:text-amber-600/50 leading-none whitespace-nowrap select-none">
            The Crimson Queen
          </h1>
        </div>
        <div className="flex-grow h-px bg-amber-900/10" />
      </div>
      
      {/* 场景 ID 标识 */}
      <div className="opacity-5">
        <span className="text-[6px] uppercase tracking-[0.5em] font-mono">{currentSceneId}</span>
      </div>
    </footer>
  );
};
