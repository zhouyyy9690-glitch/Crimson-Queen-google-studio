/**
 * 叙事逻辑工具库
 * 包含解析文本片段、自动对话高亮、背景环境粒子判定逻辑
 */
import { commonScenes } from '../data/sceneManifest';
import { TextSegment, Scene, Paragraph, ParticleType } from '../types';

/**
 * 文本片段解析逻辑
 * 将一段包含 [C:Name] 或特定标记的文本拆分为带有样式的 React 段落
 * 支持角色对话自动检测与高亮
 * (同步自 App.tsx 原生逻辑，确保 UI 体验 100% 还原)
 */
export const parseTextWithDialogue = (text: string, isThought?: boolean): TextSegment[] => {
  // 1. 根据引号拆分对话
  const parts = text.split(/([“”""][^“”""]*[“”""])/g);
  const segments: TextSegment[] = [];
  
  parts.forEach((part) => {
    if (!part) return;

    const isDialoguePart = part.match(/^[“”""]/);
    
    // 2. 处理器手动高亮标签 [C:...] [L:...]
    const tagParts = part.split(/(\[C[:：][^\]]+\]|\[L[:：][^\]]+\])/g);
    
    tagParts.forEach(tagPart => {
      if (!tagPart) return;

      if (tagPart.startsWith('[C') && tagPart.endsWith(']')) {
        // 角色手动高亮
        const name = tagPart.substring(3, tagPart.length - 1);
        segments.push({
          text: name,
          className: "text-amber-600 font-bold",
          isDialogue: !!isDialoguePart
        });
      } else if (tagPart.startsWith('[L') && tagPart.endsWith(']')) {
        // 地点手动高亮
        const locName = tagPart.substring(3, tagPart.length - 1);
        segments.push({
          text: locName,
          className: "text-emerald-500 font-bold",
          isDialogue: !!isDialoguePart
        });
      } else {
        // 普通片段（对话或叙述）
        if (isDialoguePart) {
          segments.push({
            text: tagPart,
            className: "text-amber-100/90 font-dialogue drop-shadow-[0_0_5px_rgba(251,191,36,0.2)]",
            isDialogue: true
          });
        } else {
          segments.push({
            text: tagPart,
            className: isThought 
              ? "text-rose-400/90 font-serif italic font-medium tracking-wide" 
              : "text-neutral-400 font-serif",
            isDialogue: false
          });
        }
      }
    });
  });

  return segments;
};

/**
 * 动态环境粒子判定
 * 根据当前场景 ID、标题及文本内容，决定显示哪种背景氛围（粒子类型）
 */
export const determineParticleType = (
  sceneId: string, 
  currentScene: Scene
): ParticleType => {
  
  // 1. 结局场景：用户要求通常不显示粒子
  if (currentScene.isEnding) return 'none';

  // 2. 预定义的特定场景匹配 (狐狸路径相关演进)
  const scenesToNature = [
    'ForgottenPrincess-kill', 'ForgottenPrincess-kill1',
    'MoonlightEscape-kill', 'MoonlightEscape-kill1',
    'LegendoftheGreenValley-kill', 'LegendoftheGreenValley-kill2'
  ];
  if (scenesToNature.includes(sceneId)) return 'nature';

  // 3. 狐狸路径 (Fox Path) F 开头的场景编号判定
  if (sceneId.startsWith('F')) {
    const match = sceneId.match(/^F(\d+)/);
    if (match) {
      const num = parseInt(match[1]);
      if (num >= 2 && num <= 12) return 'dust';    // 白天
      if (num === 13) return 'evening';             // 黄昏
      if (num >= 14 && num <= 39) return 'nature';  // 深夜（萤火虫）
      if (num >= 41) return 'dust';                 // 白昼再次降临
    }
  }

  // 4. 显式指定的粒子类型（最高优先级）
  if (currentScene.particleType) return currentScene.particleType;
  
  // 5. 通用场景：通常保持整洁
  if (Object.keys(commonScenes).includes(sceneId)) return 'none';
  
  // 6. 语义分析启发式判定
  const allParagraphsText = currentScene.paragraphs?.map(p => p.text).join(' ') || '';
  const searchSpace = (sceneId + ' ' + (currentScene.title || '') + ' ' + (currentScene.description || '') + ' ' + allParagraphsText).toLowerCase();
  
  if (searchSpace.includes('北境') || searchSpace.includes('雪') || searchSpace.includes('高原')) return 'snow';
  if (searchSpace.includes('王城') || searchSpace.includes('凯斯') || searchSpace.includes('贤者堡') || searchSpace.includes('大教堂')) return 'dust';
  
  const isNight = searchSpace.includes('night') || searchSpace.includes('夜') || searchSpace.includes('今夜') || searchSpace.includes('深夜');
  if (isNight && (searchSpace.includes('溪木堡') || searchSpace.includes('森林') || searchSpace.includes('翠谷') || searchSpace.includes('绿野'))) return 'nature';
  
  return 'none';
};
