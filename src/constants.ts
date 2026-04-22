import { Leaf, Crown, Shield } from 'lucide-react';

export const STORAGE_KEYS = {
  SAVE_DATA: 'hersey_save_data',
  UNLOCKED_CHAPTERS: 'hersey_unlocked_chapters',
  CHAPTER_SNAPSHOTS: 'hersey_chapter_snapshots'
};

export const ROADS_CONFIG = [
  {
    id: 'fox',
    title: '赤狐之径',
    subtitle: 'PATH OF THE CRIMSON FOX',
    description: '即便是在最深的暗影中，也要寻找那一抹灵动的红。狐狸教我隐藏，也教我生存。',
    emblem: '🦊', // In a real app we'd use an SVG or Lucide icon
    color: 'emerald',
    chapterPrefix: '02-foxPath'
  },
  {
    id: 'deer',
    title: '霜鹿之林',
    subtitle: 'FOREST OF THE FROST DEER',
    description: '古老的森林在呼吸，霜雪覆盖了往昔的足迹。鹿群引路，寻找重归自然的神谕。',
    emblem: '🦌',
    color: 'blue',
    chapterPrefix: '03-deerPath'
  },
  {
    id: 'eagle',
    title: '苍鹰之巅',
    subtitle: 'PEAK OF THE AZURE EAGLE',
    description: '俯瞰众生，唯有高处的风可以带走迷惘。双翼之下，是守护山巅苍穹的誓约。',
    emblem: '🦅',
    color: 'cyan',
    chapterPrefix: '04-eaglePath'
  },
  {
    id: 'spindle',
    title: '纺锤之命',
    subtitle: 'FATE OF THE GOLDEN SPINDLE',
    description: '丝线交织成命运的网，每一圈旋转都在重写结局。这是终焉，亦是循环的始点。',
    emblem: '🧶',
    color: 'amber',
    chapterPrefix: '05-spindlePath'
  }
];

export const CHAPTERS_CONFIG = [
  {
    id: 'act1',
    roadId: 'fox',
    number: 'PROLOGVS',
    title: '绿野王女',
    subtitle: 'THE GREENFIELD PRINCESS',
    description: '赫西之女，漂泊乡野。在那段宁静而危险的日子里，命运的齿轮悄然转动。',
    icon: Leaf,
    color: 'emerald',
    startSceneId: 'start',
    constellation: [
      { id: 'bishop', label: '主教', matchScenes: ['F1-morning-intro', 'start'], icon: 'star' },
      { id: 'quarrel', label: '争吵', matchScenes: ['F2-morning-quarrel'], icon: 'star' },
      { id: 'door', label: '开门', matchScenes: ['F8-openthedoor'], icon: 'star' },
      { id: 'night', label: '夜晚', matchScenes: ['F30-NightScene', 'act1-p4-night'], icon: 'moon' },
      { id: 'knight', label: '册封', matchScenes: ['F18-Knighting'], icon: 'star' },
      { id: 'ending', label: '结局', matchScenes: ['Ending', 'F41-FinalDecision'], icon: 'star' },
      { id: 'day2', label: '第二天', matchScenes: ['act1-day2', 'F29-AutoKnight'], icon: 'star' }
    ],
    mapFocus: { x: -300, y: -200, scale: 1.8 }, // Emerald Valley focus
    regionLabels: ['翠谷 · Verdant Vale'],
    highlightLocations: ['creekwood_castle', 'grove_village', 'lancani_falls']
  },
  {
    id: 'act1-fox-cont',
    roadId: 'fox',
    number: 'CAPVT I',
    title: '红狐的低语',
    subtitle: 'WHISPERS OF THE CRIMSON FOX',
    description: '狐影摇曳在月光下的森林。当谎言被包裹在真相之中，谁才是真正的猎人？',
    icon: Leaf,
    color: 'emerald',
    startSceneId: 'start', // Placeholder
    mapFocus: { x: -300, y: -200, scale: 1.8 },
    highlightLocations: ['grove_village']
  },
  {
    id: 'act2',
    roadId: 'fox',
    number: 'CAPVT I',
    title: '新的女王',
    subtitle: 'REGINA NOVA',
    description: '阔别十四载，重回王城。冠冕之下，是权谋的暗流与注定孤寂的王座。',
    icon: Crown,
    color: 'amber',
    startSceneId: 'Act2ChapterSplash',
    constellation: [
      { id: 'suburb', label: '近郊', matchScenes: ['F48-suburb'], icon: 'star' },
      { id: 'ferry', label: '渡鸦', matchScenes: ['F49-ThreeRiddlesFerry'], icon: 'star' },
      { id: 'monastery', label: '姑母', matchScenes: ['F50-MonasteryView'], icon: 'star' },
      { id: 'welcome', label: '欢迎', matchScenes: ['F53-1-Welcome', 'F54-ArchbishopWords'], icon: 'star' },
      { id: 'farewell', label: '别离', matchScenes: ['F55-FarewellValley'], icon: 'star' }
    ],
    mapFocus: { x: 50, y: 150, scale: 2.2 }, // Capital focus
    regionLabels: ['中央河间地 · Riverlands'],
    highlightLocations: [
      'kase_city', 
      'kase_suburb', 
      'three_riddles_ferry', 
      'mercy_monastery', 
      'storra_sanctuary', 
      'velis_capital', 
      'mireis', 
      'reg_north', 
      'holy_spring'
    ]
  },
  {
    id: 'act1-deer',
    roadId: 'deer',
    number: 'PROLOGVS',
    title: '霜雪将至',
    subtitle: 'WINTER IS COMING',
    description: '白色的鹿穿过枯枝，它们在等待那场足以封印一切的暴风雪。',
    icon: Shield,
    color: 'blue',
    startSceneId: 'act1-start',
    mapFocus: { x: -100, y: -500, scale: 1.5 },
    regionLabels: ['北境 · The North'],
    highlightLocations: ['iron_peaks']
  }
];
