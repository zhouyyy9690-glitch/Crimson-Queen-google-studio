import { Scene } from '../types';

export const commonScenes: Record<string, Scene> = {
  start: {
    id: 'start',
    title: '绛红女王',
    description: '赫西王室的起源与凯瑟琳公主的诞生。',
    paragraphs: [
      { text: '自古以来，狐狸奔跑在大地，黑鹰飞翔在天空，红鹿踱步于林间。\n直到劳顿·赫西与伊莎贝拉·赫西的女儿——征服王国的凯瑟琳·赫西公主诞生。' }
    ],
    choices: [
      { 
        text: '狐狸之路 ', 
        nextSceneId: 'F1-fox', 
        animalType: 'fox' 
      },
      { 
        text: '红鹿之路', 
        nextSceneId: 'd1-deer', 
        animalType: 'deer' 
      },
      { 
        text: '黑鹰之路', 
        nextSceneId: 'eagle', 
        animalType: 'eagle' 
      },
      { 
        text: '纺锤之路', 
        nextSceneId: 'Destiny', 
        animalType: 'destiny'
      }
    ]
  },
  
  
};
