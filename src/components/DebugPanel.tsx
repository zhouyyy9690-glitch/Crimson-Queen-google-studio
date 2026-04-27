import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Terminal, 
  Search, 
  Flag, 
  ChevronRight, 
  Zap, 
  History,
  RotateCcw,
  Save
} from 'lucide-react';
import { gameData } from '../gameData';
import { DEBUG_CONFIG } from '../config/debug';

interface DebugPanelProps {
  currentSceneId: string;
  setCurrentSceneId: (id: string) => void;
  flags: Record<string, any>;
  setFlags: (flags: Record<string, any>) => void;
  sessionFlags: Record<string, any>;
  setSessionFlags: (flags: Record<string, any>) => void;
  currentParaIndex: number;
  setCurrentParaIndex: (index: number) => void;
  onClose: () => void;
}

/**
 * 调试面板组件
 * 通过 Ctrl+D 唤起，用于实时监控和修改游戏状态
 */
export const DebugPanel: React.FC<DebugPanelProps> = ({
  currentSceneId,
  setCurrentSceneId,
  flags,
  setFlags,
  sessionFlags,
  setSessionFlags,
  currentParaIndex,
  setCurrentParaIndex,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'flags' | 'jump'>('status');
  const [jumpId, setJumpId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 获取所有缓存的场景 ID 用于搜索
  const allSceneIds = Object.keys(gameData.scenes);
  const filteredSceneIds = allSceneIds.filter(id => 
    id.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 20); // 限制显示数量防止 UI 爆炸

  const handleJump = (id: string) => {
    if (gameData.scenes[id]) {
      setCurrentSceneId(id);
      setCurrentParaIndex(0);
    }
  };

  const updateFlag = (key: string, value: any) => {
    setFlags({ ...flags, [key]: value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6 pointer-events-none"
    >
      {/* 背景遮罩 - 可选，这里选择半透明以保持一定的游戏感知 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      {/* 主面板 */}
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto max-h-[80vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100 tracking-tight uppercase">Development Debugger</h2>
              <p className="text-[10px] text-zinc-500 font-mono">STABLE_MODE_ACTIVE // PROJECT_HERSEY</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-zinc-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex px-2 pt-2 bg-zinc-950 border-b border-zinc-800">
          {[
            { id: 'status', label: 'Status', icon: Zap },
            { id: 'flags', label: 'Variables', icon: Flag },
            { id: 'jump', label: 'Jump', icon: Search }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 text-xs font-medium transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs">
          
          {activeTab === 'status' && (
            <div className="space-y-6">
              <section>
                <h3 className="text-zinc-500 uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                  <ChevronRight size={10} /> Current Scene
                </h3>
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50 flex items-center justify-between">
                  <div>
                    <span className="text-zinc-500 mr-2">ID:</span>
                    <span className="text-indigo-400 font-bold">{currentSceneId}</span>
                  </div>
                  <div className="text-zinc-500">
                    <span className="mr-2">Para:</span>
                    <span className="text-emerald-400">{currentParaIndex}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-zinc-500 uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                  <History size={10} /> State Info
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-800/30 rounded p-3 border border-zinc-800">
                    <div className="text-[10px] text-zinc-600 mb-1">FLAGS_COUNT</div>
                    <div className="text-zinc-300">{Object.keys(flags).length}</div>
                  </div>
                  <div className="bg-zinc-800/30 rounded p-3 border border-zinc-800">
                    <div className="text-[10px] text-zinc-600 mb-1">SESSION_FLAGS</div>
                    <div className="text-zinc-300">{Object.keys(sessionFlags).length}</div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'flags' && (
            <div className="space-y-6">
              <section>
                <h3 className="text-zinc-500 uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                  <Flag size={10} /> Persistence Flags (Story State)
                </h3>
                <div className="space-y-2">
                  {Object.keys(flags).length === 0 ? (
                    <div className="text-zinc-600 italic py-4 text-center border border-dashed border-zinc-800 rounded">No flags recorded yet</div>
                  ) : (
                    Object.entries(flags).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between bg-zinc-800/30 p-2 rounded group">
                        <span className="text-zinc-400">{key}</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={JSON.stringify(value)}
                            onChange={(e) => {
                              try {
                                updateFlag(key, JSON.parse(e.target.value));
                              } catch(err) {
                                // 忽略非法解析
                              }
                            }}
                            className="bg-zinc-700/50 border border-zinc-600 text-[10px] px-2 py-1 rounded w-32 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'jump' && (
            <div className="space-y-6">
              <section>
                <h3 className="text-zinc-500 uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                  <Search size={10} /> Fast Jump
                </h3>
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    placeholder="Search Scene ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 text-zinc-300"
                  />
                </div>
                <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredSceneIds.map(id => (
                    <button
                      key={id}
                      onClick={() => handleJump(id)}
                      className="text-left py-2 px-3 hover:bg-indigo-500/10 hover:text-indigo-400 rounded transition-colors border border-transparent hover:border-indigo-500/30 group flex items-center justify-between"
                    >
                      <span>{id}</span>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                  {filteredSceneIds.length === 0 && (
                    <div className="text-zinc-600 text-center py-8">No scenes matching your query</div>
                  )}
                </div>
              </section>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if(window.confirm('Reset Game State? (Clears flags and history)')) {
                  setFlags({});
                  setSessionFlags({});
                  setCurrentSceneId(gameData.initialScene);
                  setCurrentParaIndex(0);
                  onClose();
                }
              }}
              className="flex items-center gap-2 text-rose-500 hover:text-rose-400 transition-colors"
            >
              <RotateCcw size={14} />
              <span className="text-[10px]">RESET ALL</span>
            </button>
          </div>
          <div className="text-[10px] text-zinc-600">
            HERSEY_CORE_v1.0.4 // STABLE
          </div>
        </div>
      </div>
    </motion.div>
  );
};
