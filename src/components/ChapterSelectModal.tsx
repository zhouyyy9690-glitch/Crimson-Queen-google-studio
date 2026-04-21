import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Play, RotateCcw, ChevronLeft, ChevronRight, MapPin, BookOpen, ScrollText } from 'lucide-react';
import { OrnateCorner } from './OrnateCorner';
import { CHAPTERS_CONFIG, ROADS_CONFIG } from '../constants';
import { locations } from '../locations';

interface ChapterSelectModalProps {
  unlockedChapters: string[];
  unlockedLocations: string[];
  history: string[];
  onSelect: (chapterId: string) => void;
  onClose: () => void;
  onReset: () => void;
}

// --------------------------------------------------------------------------------
// 章节星座图组件 (Chapter Constellation)
// --------------------------------------------------------------------------------
const ChapterConstellation = ({ chapter, history }: { chapter: any, history: string[] }) => {
  if (!chapter.constellation) return null;

  // 星座连线逻辑
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]
  ];

  // 节点坐标 (百分比) - 模拟一种天体轨迹
  const coords = [
    { x: 20, y: 30 },
    { x: 35, y: 25 },
    { x: 50, y: 40 },
    { x: 65, y: 20 }, // 4th star (Night)
    { x: 80, y: 35 },
    { x: 70, y: 60 },
    { x: 85, y: 75 }
  ];

  return (
    <div className="absolute top-1/2 -right-4 md:right-4 -translate-y-1/2 w-32 md:w-48 h-64 md:h-80 pointer-events-none opacity-80 z-20">
      <svg className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Lines */}
        {connections.map(([from, to], i) => {
          const isFromLit = history.some(id => 
            chapter.constellation[from].matchScenes.some((m: string) => id.includes(m))
          );
          const isToLit = history.some(id => 
            chapter.constellation[to].matchScenes.some((m: string) => id.includes(m))
          );
          
          return (
            <motion.line
              key={`line-${i}`}
              x1={`${coords[from].x}%`}
              y1={`${coords[from].y}%`}
              x2={`${coords[to].x}%`}
              y2={`${coords[to].y}%`}
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="4,4"
              initial={{ opacity: 0.05 }}
              animate={{ opacity: (isFromLit && isToLit) ? 0.25 : 0.05 }}
              className="transition-opacity duration-1000"
            />
          );
        })}

        {/* Nodes */}
        {chapter.constellation.map((node: any, i: number) => {
          const isLit = history.some(id => 
            node.matchScenes.some((match: string) => id.includes(match))
          );
          const pos = coords[i];
          const isMoon = node.id === 'night' || node.icon === 'moon';

          return (
            <g key={node.id} className="cursor-default">
              {/* Glow background */}
              {isLit && (
                <motion.circle
                  cx={`${pos.x}%`}
                  cy={`${pos.y}%`}
                  r="8"
                  fill="url(#starGlow)"
                  animate={{ opacity: [0.1, 0.3, 0.1], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              )}
              
              <motion.circle
                cx={`${pos.x}%`}
                cy={`${pos.y}%`}
                r={isLit ? (isMoon ? "0" : "3.5") : "1.5"}
                fill={isLit ? "#fbbf24" : "#2a1b10"}
                stroke={isLit ? "transparent" : "#4a3b30"}
                strokeWidth="0.5"
                initial={{ opacity: 0.3 }}
                animate={isLit ? {
                  opacity: 1,
                  scale: [1, 1.1, 1],
                } : { opacity: 0.3 }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {isMoon && isLit ? (
                <motion.text 
                  x={`${pos.x}%`} 
                  y={`${pos.y}%`} 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  className="fill-amber-300 text-[16px]"
                  style={{ fontFamily: 'serif', transform: 'translate(0, -2px)' }}
                  animate={{ opacity: [0.6, 1, 0.6], filter: ["blur(0px)", "blur(1px)", "blur(0px)"] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  ☾
                </motion.text>
              ) : null}

              <text
                x={`${pos.x}%`}
                y={`${pos.y + 10}%`}
                textAnchor="middle"
                className={`fill-amber-100/40 text-[5px] md:text-[7px] tracking-[0.2em] font-chinese font-light pointer-events-none transition-opacity duration-500 ${isLit ? 'opacity-100' : 'opacity-0'}`}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// --------------------------------------------------------------------------------
// 章节地图预览组件
// --------------------------------------------------------------------------------
const ChapterMapPreview = ({ chapter, isUnlocked, unlockedLocations }: { chapter: any, isUnlocked: boolean, unlockedLocations: string[] }) => {
  const { x, y, scale } = chapter.mapFocus;
  
  const activeLocations = useMemo(() => 
    locations.filter(loc => chapter.highlightLocations?.includes(loc.id)),
    [chapter.highlightLocations]
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0c0c0c] shadow-2xl">
      <motion.div 
        animate={{ 
          scale: [scale, scale * 1.05, scale],
          x: [x * 0.9, x * 1.1, x * 0.9],
          y: [y * 0.9, y * 1.1, y * 0.9]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 select-none will-change-transform"
      >
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80')`,
            backgroundSize: '200% 200%',
            filter: isUnlocked ? 'sepia(0.6) brightness(0.7) contrast(1.2)' : 'grayscale(1) brightness(0.3)',
          }}
        />

        {chapter.regionLabels?.map((label: string, i: number) => (
          <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-typewriter text-4xl md:text-8xl text-amber-950/20 uppercase tracking-[0.8em] select-none -rotate-12 translate-y-20 blur-[1px]">
              {label}
            </span>
          </div>
        ))}

        <div className="absolute inset-0 pointer-events-none">
          {activeLocations.map((loc) => {
            const isMarkerLit = unlockedLocations.includes(loc.id);
            const left = loc.x;
            const top = loc.y;
            const chapterLocIndex = chapter.highlightLocations.indexOf(loc.id);

            return (
              <div key={loc.id} style={{ left: `${left}%`, top: `${top}%` }} className="absolute">
                <div className="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  {isMarkerLit && isUnlocked && (
                    <motion.div
                      animate={{ scale: [1, 2.5, 1], opacity: [0, 0.3, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute w-20 h-20 bg-amber-500 rounded-full blur-2xl"
                    />
                  )}
                  
                  <div className={`w-2 h-2 rounded-full border transition-all duration-700 ${isMarkerLit && isUnlocked ? 'bg-amber-500 shadow-[0_0_15px_#f59e0b] border-amber-400' : 'bg-neutral-900 border-amber-950/40 opacity-40'}`} />
                  
                  <div className={`mt-3 px-3 py-1 border transition-all duration-700 ${isMarkerLit && isUnlocked ? 'bg-black/70 border-amber-900/10' : 'bg-black/20 border-white/5 opacity-20'}`}>
                    <span className={`font-typewriter text-[9px] uppercase tracking-[0.3em] whitespace-nowrap flex items-center gap-2 ${isMarkerLit && isUnlocked ? 'text-amber-500' : 'text-neutral-800'}`}>
                      {isMarkerLit && isUnlocked ? (
                        <>
                          <span className="text-[7px] opacity-40">0{chapterLocIndex + 1}</span>
                          {loc.name}
                        </>
                      ) : (
                        <>
                          <Lock className="w-2 h-2" />
                          <span className="blur-[1px]">UNDISCOVERED</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Lock className="w-16 h-16 text-white/10" />
          </motion.div>
        </div>
      )}
      <div className="absolute inset-0 border-[16px] border-amber-950/10 pointer-events-none z-40" />
    </div>
  );
};

// --------------------------------------------------------------------------------
// 七星圣核组件 (Holy Core of Seven Stars)
// --------------------------------------------------------------------------------
const HolyCore = ({ color, isActive, onClick, emblem }: { color: string, isActive: boolean, onClick: () => void, emblem: string }) => {
  const glowColors: Record<string, string> = {
    emerald: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]',
    blue: 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]',
    cyan: 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]',
    amber: 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
  };

  const ringColors: Record<string, string> = {
    emerald: 'border-emerald-900/40',
    blue: 'border-blue-900/40',
    cyan: 'border-cyan-900/40',
    amber: 'border-amber-900/40'
  };

  return (
    <div className="relative flex flex-col items-center scale-90 md:scale-100 transition-transform">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center group cursor-pointer"
      >
        {/* Orbit Rings */}
        <div className={`absolute inset-0 rounded-full border border-2 ${ringColors[color]} opacity-20 group-hover:scale-110 transition-transform duration-700`} />
        <div className={`absolute inset-3 rounded-full border border-dashed ${ringColors[color]} opacity-10 group-hover:rotate-180 transition-transform duration-1000`} />
        
        {/* The 7 Stars Orbit */}
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 pointer-events-none"
          >
            <div 
              className={`w-1 h-1 rounded-full ${glowColors[color].split(' ')[0]} absolute left-1/2 -top-0.5 -translate-x-1/2 opacity-40`}
              style={{ filter: 'blur(0.5px)' }}
            />
          </motion.div>
        ))}

        {/* Central Core */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className={`absolute inset-0 rotate-45 border border-2 ${ringColors[color]} opacity-40 group-hover:rotate-[135deg] transition-transform duration-700`} />
          <motion.div 
            animate={isActive ? {
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
              filter: ["blur(1px)", "blur(4px)", "blur(1px)"]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${glowColors[color]} flex items-center justify-center`}
          >
            <span className="text-xl filter brightness-0 invert opacity-40 group-hover:opacity-80 transition-opacity">
              {emblem}
            </span>
          </motion.div>
        </div>
        
        {/* Glow Halo */}
        <div className={`absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity ${glowColors[color].split(' ')[0]}`} />
      </motion.button>
      
      <div className="mt-4 flex flex-col items-center">
        <div className={`w-8 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20 ${ringColors[color].replace('border-', 'text-')}`} />
        <span className="text-[8px] tracking-[0.4em] uppercase font-typewriter mt-2 opacity-30">Engrave Path</span>
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------------
// 路线选择视图 (Road Selection)
// --------------------------------------------------------------------------------
const RoadSelectionView = ({ onSelectRoad }: { onSelectRoad: (roadId: string) => void }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col pt-6 md:pt-10 pb-4 relative z-20 overflow-hidden">
      {/* Ornate Corner Elements in the VIEW */}
      <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-amber-900/10 pointer-events-none opacity-40" />
      <div className="absolute top-4 right-4 w-10 h-10 border-t border-r border-amber-900/10 pointer-events-none opacity-40" />

      <div className="text-center mb-4 md:mb-5 flex flex-col items-center shrink-0">
        <span className="font-typewriter text-amber-900/40 text-[8px] md:text-[9px] tracking-[0.8em] uppercase block mb-1">— Liber Fatorvm —</span>
        <h2 className="font-chinese text-2xl md:text-4xl text-amber-100/90 tracking-widest font-medium">
          命 运 之 径
        </h2>
        <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-900/30 to-transparent mt-2 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45 border border-amber-900/50 bg-[#0c0c0c]" />
        </div>
      </div>

      <div className="relative flex-grow flex items-center min-h-0">
        {/* Navigation Buttons */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-2 md:left-4 z-50 p-2.5 rounded-full bg-black/40 border border-amber-900/10 text-amber-600/60 hover:text-amber-500 hover:bg-black/60 transition-all backdrop-blur-sm"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        
        <button 
          onClick={() => scroll('right')}
          className="absolute right-2 md:right-4 z-50 p-2.5 rounded-full bg-black/40 border border-amber-900/10 text-amber-600/60 hover:text-amber-500 hover:bg-black/60 transition-all backdrop-blur-sm"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <div 
          ref={scrollRef}
          className="w-full h-full overflow-x-auto no-scrollbar snap-x snap-mandatory flex items-center px-12 md:px-[20%] lg:px-[30%] gap-6 pb-2 scroll-smooth"
        >
          {ROADS_CONFIG.map((road) => (
            <motion.div
              key={road.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0 w-full md:w-[380px] lg:w-[400px] h-[90%] max-h-[550px] snap-center relative group flex flex-col"
            >
              {/* Manuscript Page Background */}
              <div className="absolute inset-0 bg-[#0f0f0f] border border-amber-900/10 shadow-2xl overflow-hidden ring-1 ring-amber-900/5 transition-all group-hover:ring-amber-600/20">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] opacity-[0.03] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-amber-900/[0.04] to-transparent pointer-events-none" />
                
                {/* Ornate Corner Elements for the page */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-amber-900/20" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-amber-900/20" />
              </div>

              <div className="relative flex-grow flex flex-col items-center justify-between p-8 md:p-10 text-center overflow-hidden">
                <div className="w-full shrink-0">
                  <h3 className="font-chinese text-xl md:text-2xl text-amber-600/80 mb-1 font-medium italic tracking-wide">
                    {road.title}
                  </h3>
                  <p className="font-mono text-[8px] text-amber-900/50 uppercase tracking-[0.4em] mb-4">
                    {road.subtitle}
                  </p>
                  <div className="h-px w-12 bg-amber-900/15 mx-auto mb-4" />
                </div>

                {/* The Holy Core Button - Moved to be more central */}
                <div className="flex-grow flex items-center justify-center py-2 shrink-0">
                  <HolyCore 
                    color={road.color} 
                    isActive={false} 
                    emblem={road.emblem}
                    onClick={() => onSelectRoad(road.id)} 
                  />
                </div>

                <div className="w-full mt-4 shrink-0">
                  <p className="text-[13px] md:text-sm text-neutral-400 font-serif leading-relaxed italic opacity-70 px-4 line-clamp-3">
                    “ {road.description} ”
                  </p>
                  
                  <div className="flex flex-col items-center mt-6">
                    <div className="w-10 h-px bg-amber-900/20 mb-2" />
                    <span className="text-[8px] font-display uppercase tracking-[0.4em] text-amber-900/35">Entry of Chronicle</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="shrink-0 flex justify-center gap-3 mt-2 mb-2">
        {ROADS_CONFIG.map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-900/10" />
        ))}
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------------
// 章节选择模态框主体
// --------------------------------------------------------------------------------
export const ChapterSelectModal: React.FC<ChapterSelectModalProps> = ({
  unlockedChapters,
  unlockedLocations,
  history,
  onSelect,
  onClose,
  onReset
}) => {
  const [viewMode, setViewMode] = useState<'roads' | 'chapters'>('roads');
  const [selectedRoad, setSelectedRoad] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // 根据选中的路线筛选章节
  const filteredChapters = useMemo(() => {
    if (!selectedRoad) return [];
    return CHAPTERS_CONFIG.filter(ch => ch.roadId === selectedRoad);
  }, [selectedRoad]);

  const currentChapter = filteredChapters[currentPage];
  const isUnlocked = currentChapter ? unlockedChapters.includes(currentChapter.id) : false;

  const handleSelectRoad = (roadId: string) => {
    setSelectedRoad(roadId);
    setCurrentPage(0);
    setViewMode('chapters');
  };

  const handleBackToRoads = () => {
    setViewMode('roads');
  };

  const nextPage = () => setCurrentPage(prev => (prev + 1) % filteredChapters.length);
  const prevPage = () => setCurrentPage(prev => (prev - 1 + filteredChapters.length) % filteredChapters.length);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[600] bg-[#050505] flex items-center justify-center overflow-hidden p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,20,10,0.4)_0%,transparent_100%)] pointer-events-none" />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full h-full lg:w-[1400px] lg:max-h-[90vh] lg:h-[800px] shadow-[0_60px_120px_-20px_rgba(0,0,0,1)] flex flex-col md:flex-row bg-[#0c0c0c] border border-amber-900/10 overflow-hidden will-change-transform"
      >
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-48 bg-gradient-to-r from-transparent via-black/40 to-transparent z-40 pointer-events-none hidden md:block" />

        <div className="z-[70] pointer-events-none">
          <OrnateCorner position="tl" />
          <OrnateCorner position="tr" />
          <OrnateCorner position="bl" />
          <OrnateCorner position="br" />
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'roads' ? (
            <motion.div
              key="road-selection"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col flex-grow order-1 md:order-1"
            >
               <RoadSelectionView onSelectRoad={handleSelectRoad} />
            </motion.div>
          ) : (
            <motion.div
              key="chapter-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col md:flex-row flex-grow order-1 md:order-1 h-full"
            >
              {/* Left Column: Text Content */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col p-8 md:p-16 lg:p-20 relative bg-[#0e0e0e] border-b md:border-b-0 md:border-r border-amber-900/10 z-10">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-[0.03] pointer-events-none" />
                
                <AnimatePresence mode="wait">
                  {currentChapter && (
                    <motion.div
                      key={currentChapter.id}
                      initial={{ x: -30, opacity: 0, filter: 'blur(10px)' }}
                      animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                      exit={{ x: 30, opacity: 0, filter: 'blur(10px)' }}
                      transition={{ duration: 0.4 }}
                      className="h-full flex flex-col"
                    >
                      <button 
                        onClick={handleBackToRoads}
                        className="flex items-center gap-2 text-amber-900/40 hover:text-amber-600 transition-colors text-[9px] uppercase tracking-[0.4em] mb-8 group"
                      >
                        <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        返回分册 · Path Index
                      </button>

                      <div className="flex flex-col mb-6 md:mb-10">
                        <span className="font-chinese italic text-amber-900/40 text-sm md:text-lg lg:text-xl tracking-[0.3em] font-medium mb-4 italic">
                          {currentChapter.number}
                        </span>
                        <h1 className={`font-chinese text-3xl md:text-5xl lg:text-7xl tracking-tighter leading-tight font-medium ${isUnlocked ? 'text-amber-100/90' : 'text-neutral-800'}`}>
                          {currentChapter.title}
                        </h1>

                        <ChapterConstellation chapter={currentChapter} history={history} />
                        <p className="font-typewriter text-[8px] md:text-[10px] lg:text-xs text-amber-900/60 uppercase tracking-[0.5em] mt-3 md:mt-4 mb-8">
                          {currentChapter.subtitle}
                        </p>

                        {isUnlocked && (
                          <div className="flex items-center gap-5">
                             <ScrollText className="w-8 h-8 text-amber-600/40" />
                             <div className="flex flex-col">
                               <span className="text-[7px] text-amber-900/40 uppercase tracking-[0.3em] mb-1">Exploration Progress</span>
                               <span className="font-typewriter text-[14px] md:text-[18px] text-amber-600/80 tracking-[0.2em] leading-none">
                                {currentChapter.highlightLocations?.filter(id => unlockedLocations.includes(id)).length || 0}
                                <span className="mx-1 text-amber-900/40 text-[10px] md:text-[12px]">/</span>
                                {currentChapter.highlightLocations?.length || 0}
                              </span>
                             </div>
                          </div>
                        )}
                      </div>

                      <div className="flex-grow space-y-6 md:space-y-10 overflow-y-auto no-scrollbar mobile-no-scrollbar">
                        <p className={`text-sm md:text-base lg:text-xl font-serif italic leading-[1.8] max-w-lg border-l border-amber-900/10 pl-6 ${isUnlocked ? 'text-neutral-400' : 'text-neutral-800'}`}>
                          {currentChapter.description}
                        </p>

                        {isUnlocked ? (
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(217, 119, 6, 0.05)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelect(currentChapter.id)}
                            className="flex items-center gap-4 md:gap-5 px-8 md:px-10 py-3 md:py-5 bg-amber-900/10 border border-amber-900/20 hover:border-amber-600/60 text-amber-600 uppercase tracking-[0.4em] text-[8px] md:text-xs font-chinese font-medium transition-all group mt-6 md:mt-16 shadow-lg"
                          >
                            <Play className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                            揭开记忆 · Recall the Path
                          </motion.button>
                        ) : (
                          <div className="flex items-center gap-4 px-8 md:px-10 py-3 md:py-5 bg-white/[0.01] border border-white/5 text-neutral-800 uppercase tracking-[0.4em] text-[8px] md:text-xs mt-6 md:mt-16 cursor-not-allowed">
                            <Lock className="w-3 h-3 md:w-4 md:h-4 opacity-50" />
                            尚未解锁 · Bound by Fate
                          </div>
                        )}
                      </div>

                      <div className="mt-auto flex items-center justify-between font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.6em] text-amber-900/20 pt-4 md:pt-8 border-t border-amber-900/5">
                        <span>Folio {currentPage + 1}</span>
                        <span>{ROADS_CONFIG.find(r => r.id === selectedRoad)?.title}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Column: Visual Content */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-[#050505] overflow-hidden">
                <AnimatePresence mode="wait">
                  {currentChapter && (
                    <motion.div
                      key={currentChapter.id}
                      initial={{ scale: 1.05, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.98, opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="w-full h-full"
                    >
                      <ChapterMapPreview 
                        chapter={currentChapter} 
                        isUnlocked={isUnlocked} 
                        unlockedLocations={unlockedLocations}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute top-6 md:top-12 right-6 md:right-12 z-30 text-right">
                  <h3 className="font-typewriter text-[8px] md:text-[10px] text-amber-600/60 tracking-[0.8em] uppercase mb-1">Topography</h3>
                  <div className="h-px w-20 md:w-32 bg-amber-900/20 ml-auto" />
                </div>

                {filteredChapters.length > 1 && (
                  <div className="absolute bottom-8 right-8 flex gap-4 z-50">
                    <button onClick={prevPage} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/80 border border-amber-900/20 text-amber-900/50 hover:text-amber-500 hover:scale-110 transition-all pointer-events-auto">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextPage} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/80 border border-amber-900/20 text-amber-900/50 hover:text-amber-500 hover:scale-110 transition-all pointer-events-auto">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer Interface */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-4 z-[110]">
        <button onClick={onReset} className="group flex items-center gap-2 text-rose-900/30 hover:text-rose-600 transition-colors uppercase tracking-[0.2em] text-[8px] md:text-[10px] cursor-pointer">
          <RotateCcw className="w-3 h-3 group-hover:rotate-[-45deg] transition-transform" />
          Reset Chronicles
        </button>
        
        <button onClick={onClose} className="flex items-center gap-3 text-white/20 hover:text-white/60 transition-all uppercase tracking-[0.6em] text-[8px] md:text-[10px] cursor-pointer group">
          <div className="w-6 md:w-8 h-px bg-white/10 group-hover:w-12 transition-all" />
          Close Tome
          <div className="w-6 md:w-8 h-px bg-white/10 group-hover:w-12 transition-all" />
        </button>
      </div>
    </motion.div>
  );
};
