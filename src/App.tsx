/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef, WheelEvent, type ReactNode, type MutableRefObject } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { CHAPTERS_CONFIG, STORAGE_KEYS } from './constants';
import { ChapterSelectModal } from './components/ChapterSelectModal';
import { ChapterSplash } from './components/ChapterSplash';
import { OrnateCorner } from './components/OrnateCorner';
import { 
  Book, 
  ChevronRight, 
  RotateCcw, 
  Scroll,
  ChevronDown,
  History,
  Download,
  X,
  User,
  Shield,
  Crown,
  Sword,
  Bird,
  PawPrint,
  Heart,
  Volume2,
  VolumeX,
  Flower,
  Flower2,
  MapPin,
  Map,
  MessageSquare,
  Zap,
  Music
} from 'lucide-react';
import { gameData } from './gameData';
import { commonScenes } from './data/sceneManifest';
import { Scene, Stage, Choice, Character, Location as GameLocation, Paragraph, TextSegment, ParticleType, Insight } from './types';
import { characters } from './characters';
import { locations } from './locations';
import { insights } from './insights';
import { fadeAudio, playSFX, SCENE_BGM_CONFIG, SFX_ASSETS, BGM_ASSETS, getChapterTheme } from './audio';
import { TypewriterText } from './components/TypewriterText';
import { SceneDisplay } from './components/SceneDisplay';
import { EndingDisplay } from './components/EndingDisplay';
import { ChoiceList } from './components/ChoiceList';
import { Button } from './components/Button';
import { EmbossedInitial } from './components/EmbossedInitial';
import { Compendium } from './components/Compendium';
import { VolumeMixer } from './components/VolumeMixer';
import { HistoryDisplay } from './components/HistoryDisplay';
import { ProgressSave } from './components/ProgressSave';
import { WorldMap } from './components/WorldMap';
import { Notification } from './components/Notification';
import { EndingGallery } from './components/EndingGallery';
import { AnimalPattern } from './components/AnimalPattern';
import { ChroniclerTransition } from './components/ChroniclerTransition';
import { GameHeader } from './components/GameHeader';
import { GameFooter } from './components/GameFooter';
import { IntroScreen } from './components/IntroScreen';
import { ICPFooter } from './components/ICPFooter';
import { DebugPanel } from './components/DebugPanel';
import { BackgroundLayers } from './components/BackgroundLayers';
import { ChoiceExplanationOverlay } from './components/ChoiceExplanationOverlay';
import { SystemOverlays } from './components/SystemOverlays';
import { parseTextWithDialogue, determineParticleType } from './lib/narrative-utils';
import { audioManager } from './lib/audio-manager';
import { assetLoader } from './lib/asset-loader';
import { DEBUG_CONFIG } from './config/debug';
import ParticleBackground from './components/ParticleBackground';
import CustomCursor from './components/CustomCursor';

// --- 基础 UI 组件与工具函数 ---


export default function App() {
  // --- 测试模式探测 ---
  // 通过 URL 参数 ?testMode=true 激活。为了防止页面自动刷新导致后缀丢失，
  // 我们会将其记录在 localStorage 中。如果发现 localStorage 中有而在 URL 中没有，我们会尝试补回 URL。
  const isTestMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('testMode');
    
    if (urlParam === 'true') {
      localStorage.setItem('hersey_test_mode_active', 'true');
    } else if (urlParam === 'false') {
      localStorage.setItem('hersey_test_mode_active', 'false');
    }
    
    const active = localStorage.getItem('hersey_test_mode_active') === 'true';
    
    // 如果激活了测试模式但 URL 里没了（例如代码更新重启后），尝试补回 URL 方便查看
    if (active && urlParam !== 'true' && window.history.replaceState) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('testMode', 'true');
      window.history.replaceState({}, '', newUrl.toString());
    }
    
    return active;
  }, []);

  // --- 核心状态 (Core States) ---
  // 当前场景 ID，初始为 gameData 中定义的初始场景
  const [currentSceneId, setCurrentSceneId] = useState<string>(gameData.initialScene);
  // 当前舞台 ID（用于同一场景内的多级对话/事件）
  const [currentStageId, setCurrentStageId] = useState<string | null>(null);
  // 历史记录：存储玩家经历过的场景 ID
  const [history, setHistory] = useState<string[]>([]);
  // 加载状态，用于确保初始化完成
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 当前文本段落索引
  const [currentParaIndex, setCurrentParaIndex] = useState(0);
  // 当前选择的动物路径（狐狸、鹿、鹰）
  const [currentPath, setCurrentPath] = useState<'fox' | 'deer' | 'eagle' | 'destiny' | null>(null);
  // 剧情旗标（Flags）：存储玩家的选择和触发的事件，影响后续剧情
  const [flags, setFlags] = useState<Record<string, any>>({});
  // 会话旗标（Session Flags）：存储本次游戏运行时的临时状态，不一定持久化
  const [sessionFlags, setSessionFlags] = useState<Record<string, any>>({});
  
  // UI 显示控制状态
  const [showHistory, setShowHistory] = useState(false);
  const [showCompendium, setShowCompendium] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  
  // 解锁系统：角色、地点、传闻、已读文本
  const [unlockedCharacters, setUnlockedCharacters] = useState<Set<string>>(new Set());
  const [seenCharacterNames, setSeenCharacterNames] = useState<Set<string>>(new Set());
  const [unlockedLocations, setUnlockedLocations] = useState<Set<string>>(new Set());
  const [seenLocationNames, setSeenLocationNames] = useState<Set<string>>(new Set());
  const [unlockedInsights, setUnlockedInsights] = useState<Set<string>>(new Set());
  const [visitedTexts, setVisitedTexts] = useState<string[]>([]);
  
  // 通用 UI 状态：地图、音频、菜单
  const [showMap, setShowMap] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(0.4);
  const [sfxVolume, setSfxVolume] = useState(0.3);
  const [showVolumeMixer, setShowVolumeMixer] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showIntro, setShowIntro] = useState(!isTestMode); // 测试模式下默认跳过开场动画

  // 引用管理：通知计时器
  const [notifications, setNotifications] = useState<{id: string, title: string, type: 'ending' | 'character' | 'location' | 'insight'}[]>([]);
  const lastNotificationRef = useRef<{time: number, type: string, title: string}[]>([]);

  // --- 调试快捷键监听 ---
  useEffect(() => {
    if (!DEBUG_CONFIG.ALLOW_DEBUG) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === DEBUG_CONFIG.SHORTCUT.key && 
        (e.ctrlKey || e.metaKey) // 支持 Ctrl 或 Command
      ) {
        e.preventDefault();
        setShowDebug(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- 场景与阶段计算 (Derived States) ---
  const currentScene: Scene = useMemo(() => gameData.scenes[currentSceneId] || gameData.scenes[gameData.initialScene], [currentSceneId]);
  const currentStage: Stage | null = useMemo(() => (currentScene.event && currentStageId) 
    ? currentScene.event.stages[currentStageId] 
    : null, [currentScene, currentStageId]);

  // --- 音频管理器逻辑同步 ---
  // 同步音量设置
  useEffect(() => {
    audioManager.setBaseVolume(bgmVolume);
  }, [bgmVolume]);

  // 背景音乐平滑切换：当剧情要求的背景音乐 ID 或资源变化时触发
  useEffect(() => {
    if (!isLoaded) return;
    
    const finalUrl = currentScene.music || currentScene.ambience || (currentScene.bgm ? (BGM_ASSETS[currentScene.bgm as keyof typeof BGM_ASSETS] || currentScene.bgm) : null) || getChapterTheme(currentSceneId);

    if (finalUrl && hasInteracted && !isMuted) {
      audioManager.play(finalUrl, 2000); 
    } else {
      audioManager.stop(1500);
    }
  }, [currentSceneId, hasInteracted, isMuted, currentScene.bgm, currentScene.music, currentScene.ambience, isLoaded]);

  // 资源预加载逻辑：每当场景切换时，预测并加载后续可能的图片资源
  useEffect(() => {
    if (!isLoaded) return;
    assetLoader.preloadNextAssets(gameData.scenes, currentSceneId);
  }, [currentSceneId, isLoaded]);

  // 触发全局通知（解锁角色/地点等）
  const triggerNotification = (title: string, type: 'ending' | 'character' | 'location' | 'insight') => {
    // 限制同一高度的瞬间重复通知 (比如一页里解锁了三个角色，只弹一次“新的人物已记录”)
    const now = Date.now();
    const isGeneric = type === 'location' || type === 'character';
    
    if (isGeneric) {
      const recent = lastNotificationRef.current.find(n => n.type === type && (now - n.time < 1000));
      if (recent) return; // 1秒内不重复弹送同类型的通用提示
    }

    lastNotificationRef.current.push({ time: now, type, title });
    if (lastNotificationRef.current.length > 10) lastNotificationRef.current.shift();

    const id = Math.random().toString(36).substring(2, 9);
    
    // 根据用户要求修改地名和人名的提示文本
    let displayTitle = title;
    if (type === 'location') displayTitle = '新的地图已注释';
    if (type === 'character') displayTitle = '新的人物已记录';

    // 播放提示音：当地点或见闻解锁时
    if (type === 'location' || type === 'insight') {
      playSFX(SFX_ASSETS.UNLOCK, isMuted, sfxVolume);
    }

    setNotifications(prev => [...prev, { id, title: displayTitle, type }]);
    
    // 5秒后自动移除该通知
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // 监听全局交互以解锁音频
  useEffect(() => {
    const handleGlobalClick = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('touchstart', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('touchstart', handleGlobalClick);
    };
  }, [hasInteracted]);

  // 选择与解释状态
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // New States for Gallery and Progress
  const [unlockedEndings, setUnlockedEndings] = useState<{id: string, title: string, text: string}[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  // Optimized Performance Values
  const mapRef = useRef<HTMLDivElement>(null);
  const mapScale = useMotionValue(1);
  const mapScaleSpring = useSpring(mapScale, { stiffness: 100, damping: 20, bounce: 0 });
  const mapTilt = useTransform(mapScaleSpring, [1, 3.5], [0, 45]);
  const mapPerspectiveOffset = useTransform(mapScaleSpring, [1, 3.5], [1000, 1500]);
  const mapObjectHeight = useTransform(mapScaleSpring, [1, 2.5], [0, 80]); 
  
  // NEW: Symbolic Emergence Factors
  const mapObjectOpacity = useTransform(mapScaleSpring, [1.4, 2.2], [0, 1]);
  const mapObjectScale = useTransform(mapScaleSpring, [1.4, 2.5], [0.3, 1]);
  
  // Safe Drag Constraints based on zoom
  const dragLimit = useTransform(mapScaleSpring, s => Math.max(800, 800 * s));
  
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  // Chapter Progress States
  const [unlockedChapters, setUnlockedChapters] = useState<string[]>(['act1']);
  const [showChapterSelect, setShowChapterSelect] = useState(false);
  const [chapterSnapshots, setChapterSnapshots] = useState<Record<string, any>>({});

  // Separation Logic handled by CSS Variables to avoid React re-renders
  useEffect(() => {
    return mapScaleSpring.on("change", (latest) => {
      if (mapRef.current) {
        // High-performance separation factor update
        const spreadCurve = Math.pow(Math.max(0, latest - 0.5), 1.5) * 2.5;
        mapRef.current.style.setProperty('--map-scale-val', `${latest}`);
        mapRef.current.style.setProperty('--map-sep-factor', `${spreadCurve}`);
      }
    });
  }, [mapScaleSpring]);

  // Parallax Motion Values
  const mapX = useMotionValue(0);
  const mapY = useMotionValue(0);
  const bgX = useTransform(mapX, x => x * 0.4);
  const bgY = useTransform(mapY, y => y * 0.4);
  
  // PERFORMANCE FIX: Decouple expensive 3D transforms from generic motion values
  const labelX = useTransform(mapX, x => x * 0.05);
  const labelY = useTransform(mapY, y => y * 0.05);
  const cloudX = useTransform(mapX, x => x * 0.1);
  const cloudY = useTransform(mapY, y => y * 0.1);

  const handleMapZoom = (e: WheelEvent) => {
    const currentScale = mapScale.get();
    if (e.deltaY < 0) {
      mapScale.set(Math.min(currentScale + 0.3, 4));
    } else {
      mapScale.set(Math.max(currentScale - 0.3, 0.5));
    }
  };

  const selectedLocation = useMemo(() => 
    locations.find(l => l.id === selectedLocationId),
    [selectedLocationId]
  );

  const filteredCharacters = useMemo(() => 
    characters.filter(c => 
      unlockedCharacters.has(c.id) || 
      (!c.path || c.path === 'all' || c.path === 'common' || c.path === currentPath)
    ),
    [currentPath, unlockedCharacters]
  );

  const selectedCharacter = useMemo(() => {
    if (!selectedCharacterId) return null;
    return characters.find(c => c.id === selectedCharacterId) || null;
  }, [selectedCharacterId]);

  // --- 数据持久化与生命周期 (Persistence & Lifecycle) ---

  // 保存当前游戏状态到本地存储 (自动存档)
  const saveGame = () => {
    const gameState = {
      currentSceneId,
      currentStageId,
      history,
      currentParaIndex,
      currentPath,
      flags,
      unlockedCharacters: Array.from(unlockedCharacters),
      seenCharacterNames: Array.from(seenCharacterNames),
      unlockedLocations: Array.from(unlockedLocations),
      seenLocationNames: Array.from(seenLocationNames),
      unlockedInsights: Array.from(unlockedInsights),
      visitedTexts,
      unlockedChapters,
      chapterSnapshots,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('hersey_save_data', JSON.stringify(gameState));
  };

  // 1. 手动存档逻辑
  const manualSaveGame = () => {
    const gameState = {
      currentSceneId,
      currentStageId,
      history,
      currentParaIndex,
      currentPath,
      flags,
      unlockedCharacters: Array.from(unlockedCharacters),
      seenCharacterNames: Array.from(seenCharacterNames),
      unlockedLocations: Array.from(unlockedLocations),
      seenLocationNames: Array.from(seenLocationNames),
      unlockedInsights: Array.from(unlockedInsights),
      visitedTexts,
      unlockedChapters,
      chapterSnapshots,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('hersey_manual_save', JSON.stringify(gameState));
    triggerNotification('进度已记录至「编年史之剑」', 'insight');
  };

  // 2. 加载指定类型的存档
  const loadSaveData = (type: 'auto' | 'manual') => {
    const key = type === 'manual' ? 'hersey_manual_save' : 'hersey_save_data';
    const saved = localStorage.getItem(key);
    if (saved) {
      const data = JSON.parse(saved);
      setCurrentSceneId(data.currentSceneId);
      setCurrentStageId(data.currentStageId);
      setHistory(data.history || []);
      setCurrentParaIndex(data.currentParaIndex);
      setCurrentPath(data.currentPath);
      setFlags(data.flags || {});
      setUnlockedCharacters(new Set(data.unlockedCharacters || []));
      if (data.seenCharacterNames) setSeenCharacterNames(new Set(data.seenCharacterNames));
      if (data.unlockedLocations) setUnlockedLocations(new Set(data.unlockedLocations));
      if (data.seenLocationNames) setSeenLocationNames(new Set(data.seenLocationNames));
      if (data.unlockedInsights) setUnlockedInsights(new Set(data.unlockedInsights));
      if (data.unlockedChapters) setUnlockedChapters(data.unlockedChapters);
      if (data.chapterSnapshots) setChapterSnapshots(data.chapterSnapshots);
      setVisitedTexts(data.visitedTexts || []);
      setIsStarting(true);
      setShowProgress(false);
      setIsMenuExpanded(false);
      console.log(`🛠️ [测试模式] ${type === 'manual' ? '手动' : '自动'}进度已成功恢复`);
    }
  };

  // 从本地存储加载游戏状态
  const loadGame = () => loadSaveData('auto');

  // 返回标题画面并重置临时状态
  const returnToTitle = () => {
    saveGame();
    setIsStarting(false);
    resetGame();
    setSessionFlags({});
  };

  // --- 测试模式生命周期管理 ---
  useEffect(() => {
    if (isTestMode) {
      loadGame();
    } else {
      console.log("🎮 正常模式：游戏将从头开始");
    }
    setIsLoaded(true);
  }, [isTestMode]);

  // 测试模式下的自动保存：当核心进度更新时自动存盘
  useEffect(() => {
    if (isTestMode && isLoaded) {
      saveGame();
    }
  }, [
    currentSceneId, 
    currentStageId, 
    currentParaIndex, 
    currentPath, 
    flags, 
    unlockedChapters, 
    isLoaded
  ]);

  // 处理剧情自动转场：满足特定标志位时自动移动到新场景
  useEffect(() => {
    if (currentSceneId === 'F19-CheckWhoElse') {
      if (flags.talkedToNun && flags.talkedToKnight && flags.talkedToScholar && flags.toldFain) {
        setCurrentSceneId('F29-AutoKnight');
      }
    }
  }, [currentSceneId, flags]);

  // Handle Event Initialization
  useEffect(() => {
    const scene = gameData.scenes[currentSceneId];
    if (scene) {
      // 触发进入场景的回调逻辑
      if (scene.onEnter) {
        const stateProxy = {
          flags: { ...flags },
          sessionFlags: { ...sessionFlags },
          nextSceneId: currentSceneId
        };
        
        scene.onEnter(stateProxy);
        
        // 检查是否有逻辑重定向
        if (stateProxy.nextSceneId !== currentSceneId) {
          setCurrentSceneId(stateProxy.nextSceneId);
          return; // 递归调用会由 useEffect 重新触发
        }
        
        // 更新状态
        setFlags(stateProxy.flags);
        setSessionFlags(stateProxy.sessionFlags);
      }

      if (scene.event) {
        setCurrentStageId(scene.event.startStage);
      } else {
        setCurrentStageId(null);
      }
    }
  }, [currentSceneId]);

  // Add scene title to visited texts
  useEffect(() => {
    const scene = gameData.scenes[currentSceneId];
    setVisitedTexts(prev => [...prev, `--- ${scene.title} ---`]);
  }, [currentSceneId]);

  // --- 场景生命周期与音频管理已在上方统一处理 ---
  useEffect(() => {
    setCurrentParaIndex(0);
  }, [currentSceneId, currentStageId]);


  const checkCondition = (condition?: any): boolean => {
    if (!condition) return true;

    // 1. 处理函数式条件 (Legacy support)
    if (typeof condition === 'function') {
      return condition({ flags, sessionFlags });
    }

    // 2. 处理字符串条件 (Legacy support - 保持逻辑 100% 不变)
    if (typeof condition === 'string') {
      return condition.split('||').some(orPart => {
        return orPart.split('&&').every(andPart => {
          const trimmed = andPart.trim();
          if (trimmed.includes('===')) {
            const [key, value] = trimmed.split('===').map(s => s.trim());
            const flagValue = flags[key];
            if (value === 'true') return flagValue === true;
            if (value === 'false') return flagValue === false || flagValue === undefined;
            return String(flagValue) === value;
          }
          if (trimmed.startsWith('!')) {
            const key = trimmed.substring(1).trim();
            return !flags[key];
          }
          return !!flags[trimmed];
        });
      });
    }

    // 3. 处理结构化条件对象 (New DSL support)
    const evaluateObject = (cond: any): boolean => {
      if (!cond) return true;
      
      // 逻辑组合操作: and, or, not
      if (cond.and && Array.isArray(cond.and)) {
        return cond.and.every((c: any) => evaluateObject(c));
      }
      if (cond.or && Array.isArray(cond.or)) {
        return cond.or.some((c: any) => evaluateObject(c));
      }
      if (cond.not) {
        return !evaluateObject(cond.not);
      }
      
      // 原子条件判断: flag, op, value
      if (cond.flag) {
        const val = flags[cond.flag];
        const target = cond.value;
        switch (cond.op) {
          case 'eq': return val === target;
          case 'neq': return val !== target;
          case 'gt': return val > target;
          case 'lt': return val < target;
          case 'gte': return val >= target;
          case 'lte': return val <= target;
          default: return !!val; // 默认退化为存在性检查
        }
      }
      return true;
    };

    if (typeof condition === 'object') {
      return evaluateObject(condition);
    }

    return true;
  };

  const activeParagraphs: Paragraph[] = currentStage 
    ? currentStage.desc.map(t => ({ text: t })) 
    : (currentScene.paragraphs || []);
  const activeChoices = (currentStage ? currentStage.choices : (currentScene.choices || []))
    .filter(choice => checkCondition(choice.condition));

  // Ref to track current paragraph for highlighting lifecycle
  const lastProcessedParaKey = useRef<string>("");

  // Combined effect to handle unlocking
  useEffect(() => {
    const currentPara = activeParagraphs[currentParaIndex];
    if (!currentPara) return;

    // Unlocks still happen logically for the compendium
    const isCommonScene = Object.keys(commonScenes).includes(currentSceneId);
    if (isCommonScene) return;

    const currentText = currentPara.text;

    // Character unlocks via tags [C:Name]
    characters.forEach(char => {
      const searchNames = [char.name, ...(char.matchNames || [])];
      const isTagged = searchNames.some(name => 
        currentText.includes(`[C:${name}]`) || currentText.includes(`[C：${name}]`)
      );
      
      if (!unlockedCharacters.has(char.id) && isTagged) {
        setUnlockedCharacters(prev => {
          const next = new Set(prev);
          next.add(char.id);
          return next;
        });
        triggerNotification(char.name, 'character');
      }
    });

    // Location unlocks via tags [L:Name]
    locations.forEach(loc => {
      const searchNames = [loc.name, ...(loc.matchNames || [])];
      const isTagged = searchNames.some(name => 
        currentText.includes(`[L:${name}]`) || currentText.includes(`[L：${name}]`)
      );
      
      if (!unlockedLocations.has(loc.id) && isTagged) {
        setUnlockedLocations(prev => {
          const next = new Set(prev);
          next.add(loc.id);
          return next;
        });
        triggerNotification(loc.name, 'location');
      }
    });

    // 5. Insight unlocks
    insights.forEach(insight => {
      const isMatch = insight.matchPatterns.some(p => currentText.includes(p));
      if (!unlockedInsights.has(insight.id) && isMatch) {
        setUnlockedInsights(prev => {
          const next = new Set(prev);
          next.add(insight.id);
          return next;
        });
        triggerNotification(insight.title, 'insight');
      }
    });
  }, [currentParaIndex, currentSceneId, isStarting, activeParagraphs, unlockedCharacters, unlockedLocations]);

  // 保存结局至画廊并触发全局通知
  const saveEnding = (id: string, title: string, text: string) => {
    setUnlockedEndings(prev => {
      // 避免重复记录同一结局
      if (prev.find(e => e.id === id)) return prev;
      triggerNotification(`结局已达成: ${title}`, 'ending');
      return [...prev, { id, title, text }];
    });
  };

  const handleChoiceClick = (choice: Choice) => {
    setSelectedChoice(choice);
    
    if (choice.explanation) {
      setTimeout(() => setShowExplanation(true), 150); // Faster feedback
    } else {
      setTimeout(() => proceedWithChoice(choice), 800);
    }
  };

  const proceedWithChoice = (choice: Choice) => {
    // Reset paragraph index and other states synchronously with scene/stage changes
    // to prevent "flashing" old state on new content
    setSelectedChoice(null);
    setShowExplanation(false);
    setIsStarting(false);

    if (choice.animalType) {
      setCurrentPath(choice.animalType);
    }

    // 执行选项的回调逻辑
    if (choice.onSelect) {
      const stateProxy = {
        flags: { ...flags },
        sessionFlags: { ...sessionFlags }
      };
      choice.onSelect(stateProxy);
      setFlags(stateProxy.flags);
      setSessionFlags(stateProxy.sessionFlags);
    }

    if (choice.setFlags) {
      setFlags(prev => ({ ...prev, ...choice.setFlags }));
    }

    // --- 快速好感度处理 (affect) ---
    if (choice.affect) {
      setFlags(prev => {
        const nextFlags = { ...prev };
        Object.entries(choice.affect!).forEach(([charId, amount]) => {
          const flag = `relationship.${charId}`;
          const current = typeof nextFlags[flag] === 'number' ? nextFlags[flag] : 0;
          nextFlags[flag] = Math.max(0, Math.min(100, current + amount));
        });
        return nextFlags;
      });
    }

    // --- Action DSL Runner ---
    if (choice.actions && Array.isArray(choice.actions)) {
      setFlags(prev => {
        const nextFlags = { ...prev };
        choice.actions?.forEach((action: any) => {
          const { type, flag, value } = action;
          if (!flag) return;

          switch (type) {
            case 'set':
              nextFlags[flag] = value;
              break;
            case 'add': {
              const currentAdd = typeof nextFlags[flag] === 'number' ? nextFlags[flag] : 0;
              let newValue = currentAdd + (typeof value === 'number' ? value : 0);
              if (flag.startsWith('relationship.')) {
                newValue = Math.max(0, Math.min(100, newValue));
              }
              nextFlags[flag] = newValue;
              break;
            }
            case 'sub': {
              const currentSub = typeof nextFlags[flag] === 'number' ? nextFlags[flag] : 0;
              let newValue = currentSub - (typeof value === 'number' ? value : 0);
              if (flag.startsWith('relationship.')) {
                newValue = Math.max(0, Math.min(100, newValue));
              }
              nextFlags[flag] = newValue;
              break;
            }
          }
        });
        return nextFlags;
      });
    }

    if (choice.nextStageId) {
      setCurrentStageId(choice.nextStageId);
    } else if (choice.nextSceneId) {
      const nextId = choice.nextSceneId;
      setHistory([...history, currentSceneId]);
      setCurrentSceneId(nextId);

      // Chapter Unlock Logic
      if (nextId === 'Act2ChapterSplash' && !unlockedChapters.includes('act2')) {
        setUnlockedChapters(prev => [...prev, 'act2']);
        setChapterSnapshots(prev => ({
          ...prev,
          'act2': {
            currentSceneId: nextId,
            currentStageId: null,
            history: [...history, currentSceneId],
            currentPath: currentPath,
            flags: { ...flags, ...choice.setFlags },
            unlockedCharacters: Array.from(unlockedCharacters),
            unlockedLocations: Array.from(unlockedLocations),
            unlockedInsights: Array.from(unlockedInsights),
            visitedTexts: [...visitedTexts]
          }
        }));
      }
    } else if (currentScene.event?.onComplete) {
      setHistory([...history, currentSceneId]);
      setCurrentSceneId(currentScene.event.onComplete);
    }
  };

  const resetGame = () => {
    setHistory([]);
    setVisitedTexts([]);
    setUnlockedCharacters(new Set());
    setSeenCharacterNames(new Set());
    setUnlockedLocations(new Set());
    setSeenLocationNames(new Set());
    setCurrentPath(null);
    setFlags({});
    setSessionFlags({});
    setCurrentSceneId(gameData.initialScene);
    setCurrentStageId(null);
    setCurrentParaIndex(0);
  };

  const resetAllProgress = () => {
    localStorage.removeItem('hersey_save_data');
    setUnlockedChapters(['act1']);
    setChapterSnapshots({});
    resetGame();
    setIsStarting(false);
    setShowChapterSelect(false);
  };

  const loadFromChapter = (chapterId: string) => {
    const config = CHAPTERS_CONFIG.find(c => c.id === chapterId);
    if (!config) return;

    // Use snapshot if exists, otherwise default setup
    const snapshot = chapterSnapshots[chapterId];
    
    if (snapshot) {
      setCurrentSceneId(snapshot.currentSceneId);
      setCurrentStageId(snapshot.currentStageId);
      setHistory(snapshot.history || []);
      setCurrentParaIndex(0);
      setCurrentPath(snapshot.currentPath);
      setFlags(snapshot.flags || {});
      setUnlockedCharacters(new Set(snapshot.unlockedCharacters || []));
      setUnlockedLocations(new Set(snapshot.unlockedLocations || []));
      setUnlockedInsights(new Set(snapshot.unlockedInsights || []));
      setVisitedTexts(snapshot.visitedTexts || []);
    } else {
      // Default jump for specific chapters if no snapshot
      setCurrentSceneId(config.startSceneId);
      setCurrentStageId(null);
      setCurrentParaIndex(0);
      setHistory([]);
      setVisitedTexts([]);
      setFlags({});
      setCurrentPath(null);
    }

    setIsStarting(true);
    setShowChapterSelect(false);
    setShowMap(false);
    setShowCompendium(false);
  };

  const nextParagraph = () => {
    if (currentParaIndex < activeParagraphs.length - 1) {
      const currentPara = activeParagraphs[currentParaIndex];
      const currentText = currentPara.text;
      
      // Before moving to next, mark all names in current text as "seen"
      characters.forEach(char => {
        if (currentText.includes(char.name)) {
          setSeenCharacterNames(prev => {
            const next = new Set(prev);
            next.add(char.name);
            return next;
          });
        }
      });
      locations.forEach(loc => {
        if (currentText.includes(loc.name)) {
          setSeenLocationNames(prev => {
            const next = new Set(prev);
            next.add(loc.name);
            return next;
          });
        }
      });

      setVisitedTexts(prev => [...prev, currentText]);
      setCurrentParaIndex(prev => prev + 1);

      // If we just reached the last paragraph of an ending, save it
      if (currentParaIndex + 1 === activeParagraphs.length - 1 && currentScene.isEnding) {
        const lastText = activeParagraphs[activeParagraphs.length - 1].text;
        saveEnding(currentSceneId, currentScene.title, lastText);
      }
    }
  };

  // Clear newly unlocked highlights when moving to next paragraph or scene handled in main effect above

  // --- 叙事工具函数与环境判定 ---
  // 已移至 src/lib/narrative-utils.ts
  const renderTextWithDialogue = (text: string, isThought?: boolean) => parseTextWithDialogue(text, isThought);

  const currentParticleType = useMemo(() => 
    determineParticleType(currentSceneId, currentScene), 
    [currentScene, currentSceneId]
  );

  if (!isLoaded) return null;

  const isLastPara = currentParaIndex === activeParagraphs.length - 1;
  const isStartScene = currentSceneId === gameData.initialScene;
  const showChoices = isLastPara && !currentScene.isEnding && (!isStartScene || isStarting) && (currentScene.choices && currentScene.choices.length > 0);
  const showStartTrigger = isStartScene && isLastPara && !isStarting;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] font-serif selection:bg-amber-900/40 overflow-x-hidden no-scrollbar lg:cursor-none">
      {/* 视觉背景层：处理鼠标、开场、粒子与滤镜 */}
      <BackgroundLayers 
        showIntro={showIntro}
        setShowIntro={setShowIntro}
        particleType={currentParticleType}
      />
      
      <AnimatePresence>
        {currentScene.isEnding ? (
          /* 结局展示界面：当场景标记为 isEnding 时触发 */
          <EndingDisplay 
            scene={currentScene}
            paraIndex={currentParaIndex}
            onNext={nextParagraph}
            onReturn={returnToTitle}
            renderTextWithDialogue={renderTextWithDialogue}
          />
        ) : (
          /* 主游戏容器：处理剧情、地图、人物志等所有核心交互 */
          <main key="main-content" className="relative max-w-2xl lg:max-w-5xl xl:max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-12 lg:py-16 flex flex-col min-h-screen transition-all duration-700">
        {/* 装饰边框 */}
        <div className="absolute inset-2 md:inset-4 lg:inset-8 border-[1px] border-amber-900/20 pointer-events-none" />
        <div className="absolute inset-4 md:inset-6 lg:inset-12 border-[1px] border-amber-900/10 pointer-events-none" />
        
        {/* 四角的中世纪装饰纹样 */}
        <OrnateCorner position="tl" />
        <OrnateCorner position="tr" />
        <OrnateCorner position="bl" />
        <OrnateCorner position="br" />

        {/* 顶部页眉：显示标题、音量调节器、历史记录等 */}
        {!currentScene.isChapter && (
          <GameHeader 
            showVolumeMixer={showVolumeMixer}
            setShowVolumeMixer={setShowVolumeMixer}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            setShowHistory={setShowHistory}
            showHistory={showHistory}
            returnToTitle={returnToTitle}
          />
        )}

        {/* 核心剧情展示区域 */}
        <div className="flex-grow flex flex-col justify-center relative z-10 pointer-events-auto">
          <AnimatePresence>
            {currentScene.isChapter ? (
              /* 章节转场/标题页：显示“第一章”等大标题 */
              <ChapterSplash 
                key={currentSceneId}
                chapterNumber={currentScene.chapterNumber || "I"}
                chapterTitle={currentScene.title}
                chapterSubtitle={currentScene.chapterSubtitle}
                onContinue={() => {
                  if (activeChoices.length > 0) {
                    handleChoiceClick(activeChoices[0]);
                  }
                }}
              />
            ) : (
              /* 剧情场景页：显示对话、旁白和玩家选项 */
              <ChroniclerTransition keyStr={currentSceneId + '-' + (currentStageId || 'base') + '-' + currentParaIndex + '-' + isStarting}>
                <SceneDisplay 
                sceneTitle={currentScene.title}
                stageId={currentStageId}
                paraObj={activeParagraphs[currentParaIndex]}
                onNext={nextParagraph}
                showChoices={showChoices}
                showEnding={false}
                showStartTrigger={showStartTrigger}
                onStart={() => {
                  setHasInteracted(true);
                  resetGame();
                  setIsStarting(true);
                  console.log("✅ 玩家已交互，游戏启动");
                }}
                choices={activeChoices}
                selectedChoice={selectedChoice}
                onChoiceClick={handleChoiceClick}
                playSFX={playSFX}
                isMuted={isMuted}
                sfxVolume={sfxVolume}
                renderTextWithDialogue={renderTextWithDialogue}
                isMenuExpanded={isMenuExpanded}
                setIsMenuExpanded={setIsMenuExpanded}
                setShowGallery={setShowGallery}
                setShowProgress={setShowProgress}
                setShowMap={setShowMap}
                sceneId={currentSceneId}
                skipTypewriter={Object.keys(commonScenes).includes(currentSceneId)}
                particleType={currentParticleType}
              />
              
              {!showChoices && !showStartTrigger && activeParagraphs.length > 1 && currentParaIndex < activeParagraphs.length - 1 && (
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={() => {
                      const remaining = activeParagraphs.slice(currentParaIndex, activeParagraphs.length - 1).map(p => p.text);
                      setVisitedTexts(prev => [...prev, ...remaining]);
                      setCurrentParaIndex(activeParagraphs.length - 1);
                    }}
                    className="text-[10px] text-neutral-600 hover:text-amber-900/40 uppercase tracking-[0.2em]"
                  >
                    Skip to Choices
                  </Button>
                </div>
              )}
            </ChroniclerTransition>
          )}
          </AnimatePresence>
        </div>

        {/* 选项解释弹窗 */}
        <ChoiceExplanationOverlay 
          show={showExplanation}
          choice={selectedChoice}
          onProceed={proceedWithChoice}
        />

        {/* 系统各模块覆盖层（人物志、地图、设置等） */}
        <SystemOverlays 
          notifications={notifications}
          showGallery={showGallery}
          setShowGallery={setShowGallery}
          unlockedEndings={unlockedEndings}
          showProgress={showProgress}
          setShowProgress={setShowProgress}
          loadGame={loadSaveData}
          manualSaveGame={manualSaveGame}
          showVolumeMixer={showVolumeMixer}
          setShowVolumeMixer={setShowVolumeMixer}
          bgmVolume={bgmVolume}
          sfxVolume={sfxVolume}
          setBgmVolume={setBgmVolume}
          setSfxVolume={setSfxVolume}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          visitedTexts={visitedTexts}
          showCompendium={showCompendium}
          setShowCompendium={setShowCompendium}
          unlockedCharacters={unlockedCharacters}
          filteredCharacters={filteredCharacters}
          selectedCharacter={selectedCharacter}
          setSelectedCharacterId={setSelectedCharacterId}
          history={history}
          currentSceneId={currentSceneId}
          flags={flags}
          showMap={showMap}
          setShowMap={setShowMap}
          unlockedLocations={unlockedLocations}
          currentPath={currentPath}
          mapRef={mapRef}
          handleMapZoom={handleMapZoom}
          mapX={mapX}
          mapY={mapY}
          mapScale={mapScale}
          mapScaleSpring={mapScaleSpring}
          mapTilt={mapTilt}
          mapPerspectiveOffset={mapPerspectiveOffset}
          cloudX={cloudX}
          cloudY={cloudY}
          labelX={labelX}
          labelY={labelY}
          mapObjectHeight={mapObjectHeight}
          mapObjectOpacity={mapObjectOpacity}
          mapObjectScale={mapObjectScale}
          selectedLocationId={selectedLocationId}
          setSelectedLocationId={setSelectedLocationId}
          selectedLocation={selectedLocation}
          unlockedInsights={unlockedInsights}
          showChapterSelect={showChapterSelect}
          setShowChapterSelect={setShowChapterSelect}
          unlockedChapters={unlockedChapters}
          loadFromChapter={loadFromChapter}
          resetAllProgress={resetAllProgress}
          showDebug={showDebug}
          setShowDebug={setShowDebug}
          setCurrentSceneId={setCurrentSceneId}
          setFlags={setFlags}
          sessionFlags={sessionFlags}
          setSessionFlags={setSessionFlags}
          currentParaIndex={currentParaIndex}
          setCurrentParaIndex={setCurrentParaIndex}
        />

        {/* 底部页脚：包含全局导航（人物志、地图）和游戏标题 */}
        {!currentScene.isChapter && (
          <GameFooter 
            setShowChapterSelect={setShowChapterSelect}
            setShowCompendium={setShowCompendium}
            setShowMap={setShowMap}
            currentSceneId={currentSceneId}
          />
        )}

        <ICPFooter />
      </main>
    )}
  </AnimatePresence>
</div>
  );
}

