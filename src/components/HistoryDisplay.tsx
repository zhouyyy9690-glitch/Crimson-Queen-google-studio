import React, { useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as ReactWindow from 'react-window';
import * as AutoSizerModule from 'react-virtualized-auto-sizer';

const ListComponent = (ReactWindow as any).VariableSizeList || (ReactWindow as any).default?.VariableSizeList || (ReactWindow as any).default;
const AutoSizer = (AutoSizerModule as any).AutoSizer || (AutoSizerModule as any).default?.AutoSizer || (AutoSizerModule as any).default;

/**
 * 单行渲染组件
 */
const Row = ({ index, style, data }: { index: number, style: React.CSSProperties, data: { processedTexts: any[] } }) => {
  const item = data.processedTexts[index];
  
  return (
    <div style={style} className="px-4 md:px-8">
      <div className="max-w-2xl lg:max-w-4xl mx-auto">
        {item.isTitle ? (
          <div className="text-center py-4 text-amber-900/40 font-display text-xs md:text-sm tracking-[0.3em] md:tracking-[0.5em] uppercase">
            {item.displayText}
          </div>
        ) : (
          <div className="text-base md:text-lg text-neutral-400 leading-relaxed font-serif italic border-l-2 border-amber-900/10 pl-4 md:pl-6">
            {item.displayText}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 剧情历史记录组件属性定义
 */
interface HistoryDisplayProps {
  showHistory: boolean; // 是否显示历史记录界面
  setShowHistory: (show: boolean) => void; // 设置显示状态的回调
  visitedTexts: string[]; // 已读文本数组（包含段落内容和章节标题）
}

/**
 * 剧情历史记录组件：展示玩家在本次冒险中经历的所有文本记录
 * 使用 react-window 虚拟化技术，支持数千条记录的流畅展示
 */
export const HistoryDisplay = ({
  showHistory,
  setShowHistory,
  visitedTexts
}: HistoryDisplayProps) => {
  const listRef = useRef<any>(null);

  // 预处理文本：清理标记及判断是否为标题，提升虚拟列表渲染性能
  const processedTexts = useMemo(() => {
    return visitedTexts.map(item => {
      let text = typeof item === 'string' ? item : (item as any)?.text || '';
      // 清理标记：移除 [C:名字] 和 [L:地点] 标记
      if (text.includes('[C') || text.includes('[L')) {
        text = text.replace(/\[C[:：]([^\]]+)\]/g, '$1');
        text = text.replace(/\[L[:：]([^\]]+)\]/g, '$1');
      }
      const isTitle = text.startsWith('---');
      return {
        originalText: text,
        displayHeight: 0, // 稍后估算
        isTitle,
        displayText: isTitle ? text.replace(/---/g, '') : text
      };
    });
  }, [visitedTexts]);

  // 当记录更新且当前正显示时，滚动到底部
  useEffect(() => {
    if (showHistory && listRef.current && processedTexts.length > 0) {
      listRef.current.scrollToItem(processedTexts.length - 1, 'end');
    }
  }, [showHistory, processedTexts.length]);

  /**
   * 动态估算每一行的高度
   * @param index 索引
   * @param width 容器宽度
   */
  const getItemSize = (index: number, width: number) => {
    const item = processedTexts[index];
    if (item.isTitle) return width > 768 ? 100 : 80;

    // 根据字数和当前容器宽度估算行数
    // 桌面端约 45-50 字一行，移动端约 20-25 字一行
    const charsPerLine = width > 768 ? 50 : 22;
    const padding = width > 768 ? 48 : 32;
    const lineHeight = width > 768 ? 32 : 28;
    const lines = Math.ceil(item.displayText.length / charsPerLine) || 1;
    
    return lines * lineHeight + padding;
  };

  return (
    <AnimatePresence>
      {showHistory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-[#0a0a0a]"
        >
          {/* 头部固定栏 */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-amber-900/10 px-4 md:px-8 py-4">
            <div className="max-w-2xl lg:max-w-4xl mx-auto flex justify-between items-center">
              <h3 className="font-display text-lg md:text-xl text-amber-600 tracking-widest uppercase">Chronicle History</h3>
              <button 
                onClick={() => setShowHistory(false)}
                className="text-neutral-500 hover:text-neutral-100 transition-colors uppercase tracking-widest text-[10px] md:text-xs cursor-pointer p-2"
              >
                Close
              </button>
            </div>
          </div>

          {/* 虚拟化列表容器 */}
          <div className="h-full pt-16">
            <AutoSizer>
              {({ height, width }: { height: number, width: number }) => {
                // Resize trigger
                useEffect(() => {
                  if (listRef.current) {
                    listRef.current.resetAfterIndex(0);
                  }
                }, [width]);

                return (
                  <ListComponent
                    ref={listRef}
                    height={height}
                    itemCount={processedTexts.length}
                    itemSize={(index: number) => getItemSize(index, width)}
                    width={width}
                    itemData={{ processedTexts }}
                    className="scrollbar-hide"
                    initialScrollOffset={processedTexts.length > 0 ? 999999 : 0}
                  >
                    {Row}
                  </ListComponent>
                );
              }}
            </AutoSizer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
