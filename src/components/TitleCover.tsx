import React from 'react';
import { motion } from 'motion/react';

interface TitleCoverProps {
  onOpen: () => void;
}

export const TitleCover: React.FC<TitleCoverProps> = ({ onOpen }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.1, rotateY: -90, x: -100 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-50 flex items-center justify-center pointer-events-auto"
    >
      <div 
        className="book-container relative w-[58vmin] max-w-[700px] aspect-[3/4] max-h-[90vh]"
        style={{ perspective: '1500px' } as any}
      >
        {/* 新增：专门处理厚度下部投影的图层（替代伪元素实现） */}
        <div 
          className="absolute top-[calc(100%-10px)] left-[-10px] right-[-10px] h-[20px] bg-black/70 rounded-[50%] blur-[10px] z-[-1] shadow-[0_4px_4px_rgba(0,0,0,0.9)] pointer-events-none"
        />

        {/* 书本厚度层 - 侧边阴影，统一为深黑 */}
        <div 
          className="absolute -right-[4px] top-[4px] bottom-[4px] w-[8px] rounded-r-[3px] z-[1] shadow-2xl"
          style={{ backgroundColor: '#050505' }}
        />

        {/* 书本封面层 - 优雅深黑色皮革 */}
        <div 
          className="book-cover relative w-full h-full rounded-[3px] z-[2] flex flex-col items-center justify-center p-[40px_25px] overflow-hidden"
          style={{
            background: '#080808',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #0d0d0d 0%, #050505 100%)',
            fontFamily: "'Caudex', serif"
          }}
        >
          {/* 原始藤蔓边框 - 更新为金红交织配色 */}
          <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
            <svg viewBox="0 0 200 260" className="w-full h-full opacity-60" preserveAspectRatio="none">
              <defs>
                <style>{`
                  .v-gold { fill:none; stroke:#b8963e; stroke-width:1.2; }
                  .v-red { fill:none; stroke:#630000; stroke-width:0.8; opacity:0.7; }
                  .v-fill { fill:#b8963e; opacity:0.3; }
                `}</style>
              </defs>
              {/* 利用原始路径结构，实现交织感 */}
              {/* 左侧 */}
              <path className="v-gold" d="M6,20 Q3,50 6,80 Q3,110 6,140 Q3,170 6,200 Q3,230 6,250" />
              <path className="v-red" d="M8,20 Q5,50 8,80 Q5,110 8,140 Q5,170 8,200 Q5,230 8,250" />
              {/* 右侧 */}
              <path className="v-gold" d="M194,20 Q197,50 194,80 Q197,110 194,140 Q197,170 194,200 Q197,230 194,250" />
              <path className="v-red" d="M192,20 Q195,50 192,80 Q195,110 192,140 Q195,170 192,200 Q195,230 192,250" />
              {/* 上侧 */}
              <path className="v-gold" d="M20,6 Q50,3 80,6 Q110,3 140,6 Q170,3 194,6" />
              <path className="v-red" d="M20,8 Q50,5 80,8 Q110,5 140,8 Q170,5 194,8" />
              {/* 下侧 */}
              <path className="v-gold" d="M20,254 Q50,257 80,254 Q110,257 140,254 Q170,257 194,254" />
              <path className="v-red" d="M20,252 Q50,255 80,252 Q110,255 140,252 Q170,255 194,252" />
              
              {/* 顶部头冠 */}
              <path className="v-gold" d="M80,6 Q75,-2 90,-2 Q100,-8 110,-2 Q125,-2 120,6" />
              <circle cx="100" cy="-4" r="2.5" className="v-fill" />
              {/* 底部装饰 */}
              <path className="v-gold" d="M85,254 Q80,246 85,240 Q100,235 115,240 Q120,246 115,254" />
            </svg>
          </div>

          <style>{`
            .book-title {
                font-family: 'Cinzel', serif;
                font-weight: 400;
                letter-spacing: 12px;
                text-transform: uppercase;
                text-align: center;
                line-height: 1.4;
                margin: 0 0 30px;
                color: #b8963e;
                z-index: 5;
            }
            .subtitle {
                font-family: 'Caudex', serif;
                font-size: 0.85rem;
                letter-spacing: 2px;
                color: #7a6a58;
                font-style: italic;
                text-align: center;
                margin: 0 15px 50px;
                line-height: 2;
                max-width: 300px;
                z-index: 5;
            }
            .enter-button {
                background: transparent;
                border: none;
                color: #b8963e;
                font-family: 'Cinzel', serif;
                font-size: 1.4rem;
                letter-spacing: 6px;
                cursor: pointer;
                transition: all 0.5s ease;
                text-transform: uppercase;
                padding: 10px 30px;
                z-index: 10;
                opacity: 0.8;
            }
            .enter-button:hover {
                color: #dac090;
                letter-spacing: 9px;
                opacity: 1;
            }
            /* 极简暗色铜钉 */
            .binding-studs {
                position: absolute;
                left: 15px;
                top: 0;
                bottom: 0;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                padding: 20% 0;
                z-index: 5;
                opacity: 0.3;
            }
            .stud {
                width: 4px;
                height: 4px;
                background: #b8963e;
                border-radius: 50%;
            }
          `}</style>
          
          <div className="binding-studs">
            <div className="stud" />
            <div className="stud" />
            <div className="stud" />
          </div>

          <h1 className="book-title text-[2.8rem]">绛红女王</h1>
          
          <div className="subtitle">
            自古以来，狐狸奔跑在大地，黑鹰飞翔在天空，红鹿踱步于林间。<br />
            直到劳顿·赫西与伊莎贝拉·赫西的女儿——<br />
            征服王国的凯瑟琳·赫西公主诞生。
          </div>

          <button onClick={onOpen} className="enter-button">
            START WRITING
          </button>
        </div>
      </div>
    </motion.div>
  );
};
