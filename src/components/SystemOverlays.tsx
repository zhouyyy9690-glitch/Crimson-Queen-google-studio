/**
 * 系统覆盖层合集
 * 整合了所有游戏内的 UI 弹出界面：存档、人物志、地图、历史记录、调试面板等
 */
import React from 'react';
import { AnimatePresence } from 'motion/react';
import { VolumeMixer } from './VolumeMixer';
import { HistoryDisplay } from './HistoryDisplay';
import { Compendium } from './Compendium';
import { WorldMap } from './WorldMap';
import { ProgressSave } from './ProgressSave';
import { Notification } from './Notification';
import { EndingGallery } from './EndingGallery';
import { ChapterSelectModal } from './ChapterSelectModal';
import { DebugPanel } from './DebugPanel';
import { characters } from '../characters';
import { locations } from '../locations';
import { insights } from '../insights';
import { ChangeEvent } from 'react';

interface SystemOverlaysProps {
  // 通知
  notifications: any[];
  
  // 画廊
  showGallery: boolean;
  setShowGallery: (s: boolean) => void;
  unlockedEndings: any[];
  
  // 存档
  showProgress: boolean;
  setShowProgress: (s: boolean) => void;
  loadGame: (type: 'auto' | 'manual') => void;
  manualSaveGame: () => void;
  
  // 音量
  showVolumeMixer: boolean;
  setShowVolumeMixer: (s: boolean) => void;
  bgmVolume: number;
  sfxVolume: number;
  setBgmVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
  
  // 历史
  showHistory: boolean;
  setShowHistory: (s: boolean) => void;
  visitedTexts: string[];
  
  // 人物志
  showCompendium: boolean;
  setShowCompendium: (s: boolean) => void;
  unlockedCharacters: Set<string>;
  filteredCharacters: any[];
  selectedCharacter: any;
  setSelectedCharacterId: (id: string | null) => void;
  history: string[];
  currentSceneId: string;
  flags: Record<string, any>;
  
  // 地图
  showMap: boolean;
  setShowMap: (s: boolean) => void;
  unlockedLocations: Set<string>;
  currentPath: 'fox' | 'deer' | 'eagle' | 'destiny' | null;
  mapRef: React.RefObject<HTMLDivElement>;
  handleMapZoom: (e: any) => void;
  mapX: any;
  mapY: any;
  mapScale: any;
  mapScaleSpring: any;
  mapTilt: any;
  mapPerspectiveOffset: any;
  cloudX: any;
  cloudY: any;
  labelX: any;
  labelY: any;
  mapObjectHeight: any;
  mapObjectOpacity: any;
  mapObjectScale: any;
  selectedLocationId: string | null;
  setSelectedLocationId: (id: string | null) => void;
  selectedLocation: any;
  unlockedInsights: Set<string>;
  
  // 章节选择
  showChapterSelect: boolean;
  setShowChapterSelect: (s: boolean) => void;
  unlockedChapters: string[];
  loadFromChapter: (chapter: any) => void;
  resetAllProgress: () => void;
  
  // 调试
  showDebug: boolean;
  setShowDebug: (s: boolean) => void;
  setCurrentSceneId: (id: string) => void;
  setFlags: (f: Record<string, any>) => void;
  sessionFlags: Record<string, any>;
  setSessionFlags: (f: Record<string, any>) => void;
  currentParaIndex: number;
  setCurrentParaIndex: (i: number) => void;
}

/**
 * SystemOverlays 组件将所有顶层 UI 交互逻辑隔离
 * 这样可以显著缩短主组件的 render 函数，并减少状态传递的视觉干扰
 */
export const SystemOverlays: React.FC<SystemOverlaysProps> = (props) => {
  return (
    <>
      {/* 全局通知浮层：当解锁重要条目（人物、地点、见闻）时出现 */}
      <Notification notifications={props.notifications} />

      {/* 结局画廊：回顾已触发的所有结局及其描述 */}
      <EndingGallery 
        showGallery={props.showGallery}
        setShowGallery={props.setShowGallery}
        unlockedEndings={props.unlockedEndings}
      />

      {/* 进度管理：处理手动存档和云/本地加载 */}
      <ProgressSave 
        showProgress={props.showProgress}
        setShowProgress={props.setShowProgress}
        loadGame={props.loadGame}
        manualSaveGame={props.manualSaveGame}
      />

      {/* 音量混音器：支持背景音乐与音效的独立控制 */}
      <AnimatePresence>
        {props.showVolumeMixer && (
          <VolumeMixer 
            bgmVolume={props.bgmVolume}
            sfxVolume={props.sfxVolume}
            onBgmChange={props.setBgmVolume}
            onSfxChange={props.setSfxVolume}
            onClose={() => props.setShowVolumeMixer(false)}
          />
        )}
      </AnimatePresence>

      {/* 历史回溯：按顺序显示已经阅读过的所有文本片段 */}
      <HistoryDisplay 
        showHistory={props.showHistory}
        setShowHistory={props.setShowHistory}
        visitedTexts={props.visitedTexts}
      />

      {/* 人物志（法典）：核心静态资料库，包含已解锁人物的详细信息、立绘及关系网 */}
      <AnimatePresence>
        {props.showCompendium && (
          <Compendium 
            showCompendium={props.showCompendium}
            setShowCompendium={props.setShowCompendium}
            unlockedCharacters={props.unlockedCharacters}
            characters={characters}
            filteredCharacters={props.filteredCharacters}
            selectedCharacter={props.selectedCharacter}
            setSelectedCharacterId={props.setSelectedCharacterId}
            history={props.history}
            currentSceneId={props.currentSceneId}
            flags={props.flags}
          />
        )}
      </AnimatePresence>

      {/* 世界地图：艺术化的交互地图，允许缩放、平移并查看已解锁的地标 */}
      <WorldMap 
        showMap={props.showMap}
        setShowMap={props.setShowMap}
        unlockedLocations={props.unlockedLocations}
        locations={locations}
        currentPath={props.currentPath}
        mapRef={props.mapRef}
        handleMapZoom={props.handleMapZoom}
        mapX={props.mapX}
        mapY={props.mapY}
        mapScale={props.mapScale}
        mapScaleSpring={props.mapScaleSpring}
        mapTilt={props.mapTilt}
        mapPerspectiveOffset={props.mapPerspectiveOffset}
        cloudX={props.cloudX}
        cloudY={props.cloudY}
        labelX={props.labelX}
        labelY={props.labelY}
        mapObjectHeight={props.mapObjectHeight}
        mapObjectOpacity={props.mapObjectOpacity}
        mapObjectScale={props.mapObjectScale}
        setSelectedLocationId={props.setSelectedLocationId}
        selectedLocationId={props.selectedLocationId}
        selectedLocation={props.selectedLocation}
        insights={insights}
        unlockedInsights={props.unlockedInsights}
      />

      {/* 章节导航：用于后期章节解锁后的快速跳转和多周目探索 */}
      <AnimatePresence>
        {props.showChapterSelect && (
          <ChapterSelectModal
            unlockedChapters={props.unlockedChapters}
            unlockedLocations={Array.from(props.unlockedLocations)}
            unlockedInsights={props.unlockedInsights}
            history={props.history}
            onSelect={props.loadFromChapter}
            onClose={() => props.setShowChapterSelect(false)}
            onReset={props.resetAllProgress}
          />
        )}
      </AnimatePresence>

      {/* 调试面板：仅在开发或手动触发时可见（Ctrl+D） */}
      <AnimatePresence>
        {props.showDebug && (
          <DebugPanel 
            currentSceneId={props.currentSceneId}
            setCurrentSceneId={props.setCurrentSceneId}
            flags={props.flags}
            setFlags={props.setFlags}
            sessionFlags={props.sessionFlags}
            setSessionFlags={props.setSessionFlags}
            currentParaIndex={props.currentParaIndex}
            setCurrentParaIndex={props.setCurrentParaIndex}
            onClose={() => props.setShowDebug(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
