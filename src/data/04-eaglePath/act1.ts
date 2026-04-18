import { Scene } from '../../types';

export const eagleAct1Scenes: Record<string, Scene> = {
  eagle: {
    id: 'eagle',
    title: '黑鹰之路',
    bgm: 'https://cdn.pixabay.com/download/audio/2025/03/11/audio_a1392b2cbb.mp3?filename=montogoronto-ominousdark-medievalfantasy-song-309510.mp3',
    description: '黑鹰之路的开始',
    paragraphs: [
      { text: '你选择了黑鹰之路。' }
    ],
    choices: [
      { text: '返回', nextSceneId: 'start' }
    ]
  }
};
