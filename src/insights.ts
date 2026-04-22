import { Insight } from './types';

export const insights: Insight[] = [
  // --- Location Rumors ---
  {
    id: 'rumor_creek_1',
    title: '溪木堡的贵客',
    description: '听说溪木堡深处居住着一位由南方而来的小姐，但在战乱年代，谁也不知道她的真实来历。',
    matchPatterns: ['高贵的小姐', '溪木堡的秘密', '公主殿下'],
    locationId: 'creekwood_castle'
  },
  {
    id: 'rumor_valles_1',
    title: '频繁的渡鸦',
    description: '瓦列堡的渡鸦最近往返凯斯的次数异常频繁，似乎在传递某种紧急的指令。',
    matchPatterns: ['往返凯斯', '渡鸦', '密信传递'],
    locationId: 'valles_keep'
  },
  {
    id: 'rumor_kase_1',
    title: '王城的权力裂缝',
    description: '在中央河间地的凯斯城，首相与教会的摩擦已经到了不得不爆发的边缘。',
    matchPatterns: ['权力裂缝', '首相与教会', '暗流'],
    locationId: 'kase_city'
  },
  {
    id: 'insight_hammond',
    title: '哈蒙德的传闻',
    description: '西境大公乔治·哈蒙德以严厉著称，他那年轻的继承人迪恩正面临着哈蒙德挑剔的择偶要求。',
    matchPatterns: ['哈蒙德', '乔治', '迪恩', '西境大公'],
    locationId: 'velis_capital'
  },
  {
    id: 'insight_mireis',
    title: '银与石的米瑞斯',
    description: '米瑞斯出产珍贵的灰蓝色银矿，也是马雷家族的领地。据说罗莎莉·瓦列小姐对那里的海风情有独钟。',
    matchPatterns: ['米瑞斯', '银矿', '马雷家族', '灰岩隘口'],
    locationId: 'mireis'
  },
  {
    id: 'insight_almorn',
    title: '南下的阿尔摩恩',
    description: '随着老熊贝奥恩的离世，年轻的杜林·阿尔摩恩接掌了北境。他带来的改变正让这头沉睡的北境之熊缓缓南下。',
    matchPatterns: ['北境大公', '阿尔摩恩', '杜林', '老熊'],
    locationId: 'reg_north'
  },
  {
    id: 'insight_karim',
    title: '卡里姆的寡妇',
    description: '伊瑟尔迪丝公主曾远嫁东境，却在丈夫意外离世后独自归来并隐入修道院，这段往事至今仍是王室的秘密。',
    matchPatterns: ['伊瑟尔迪丝', '卡里姆', '联姻', '赫西公主'],
    locationId: 'mercy_monastery'
  },
  {
    id: 'insight_percy',
    title: '黄金骑士',
    description: '传说中无比英俊且才华横溢的珀西瓦尔·莱昂爵士，在拒绝了与公主的婚约后消失于远方，成为了吟游诗人口中的传奇。',
    matchPatterns: ['珀西瓦尔', '黄金骑士', '莱昂'],
    locationId: 'holy_spring'
  }
];
