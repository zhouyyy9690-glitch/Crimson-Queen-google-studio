import { GameData } from './types';
import { allScenes } from './data/sceneManifest';

export const gameData: GameData = {
  initialScene: 'start',
  scenes: allScenes
};
