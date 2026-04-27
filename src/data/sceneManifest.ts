import { commonScenes } from './01-commonScenes';
import { foxScenes } from './02-foxPath/index';
import { deerScenes } from './03-deerPath/index';
import { eagleScenes } from './04-eaglePath/index';
import { spindleScenes } from './05-spindlePath/index';

/**
 * 场景清单 (SceneManifest)
 * 作用：统一汇集并整理所有分枝路径下的场景数据，
 * 方便全局引用（如 gameData 或特定的逻辑判定）。
 */

export const allScenes = {
  ...commonScenes,
  ...foxScenes,
  ...deerScenes,
  ...eagleScenes,
  ...spindleScenes,
};

// 导出各个路径的子集，方便按需使用（如 commonScenes 判定）
export {
  commonScenes,
  foxScenes,
  deerScenes,
  eagleScenes,
  spindleScenes,
};
