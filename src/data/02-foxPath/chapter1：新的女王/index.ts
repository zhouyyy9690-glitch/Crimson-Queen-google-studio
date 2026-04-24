import { act2Scenes as day1Scenes1 } from './Day1/01';
import { day1ScenesPart2 } from './Day1/02';
import { day1ScenesPart3 } from './Day1/03';
import { day1ScenesPart4 } from './Day1/04';
import { Day1LunchScenes } from './Day1/05';
import { Day1ScholarScenes } from './Day1/06';

export const act2Scenes = {
  ...day1Scenes1,
  ...day1ScenesPart2,
  ...day1ScenesPart3,
  ...day1ScenesPart4,
  ...Day1LunchScenes,
  ...Day1ScholarScenes,
};
