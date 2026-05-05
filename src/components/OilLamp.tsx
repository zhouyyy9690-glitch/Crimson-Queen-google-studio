import React from 'react';

/**
 * 中世纪油灯组件
 * 作为一个独立的静物存在于场景中，具有呼吸灯效果和动态火焰
 */
export const OilLamp: React.FC = () => {
  return (
    <div className="oil-lamp">
      <style>{`
        .oil-lamp {
            position: fixed;
            top: -40px;
            left: -40px;
            width: 180px;
            height: 180px;
            z-index: 100;
            pointer-events: none;
        }

        .lamp-base {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 180px;
            height: 180px;
            background: radial-gradient(circle at 40% 30%, #6b5a3e, #2e2210 80%);
            border-radius: 50%;
            box-shadow: 
                inset 0 8px 12px rgba(0,0,0,0.8),
                inset 0 -8px 12px rgba(200,160,80,0.3),
                0 12px 24px rgba(0,0,0,0.7);
            z-index: 1;
        }

        .lamp-oil {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 130px;
            height: 130px;
            background: radial-gradient(circle at 50% 40%, #1a0f05, #0d0703);
            border-radius: 50%;
            z-index: 2;
            box-shadow: inset 0 0 25px rgba(0,0,0,0.9);
        }

        .lamp-wick {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -70%);
            width: 14px;
            height: 24px;
            background: #3a2a18;
            border-radius: 2px;
            z-index: 4;
        }

        .flame-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -60%);
            width: 70px;
            height: 100px;
            z-index: 5;
            animation: flicker 0.15s infinite alternate;
        }

        .flame-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(255, 200, 50, 0.25) 0%, transparent 70%);
            border-radius: 50%;
            z-index: 0;
            animation: pulse 2s infinite ease-in-out;
        }

        .flame-outer {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 35px;
            height: 60px;
            background: linear-gradient(to top, #f97316, #fb923c, #fde047);
            border-radius: 50% 50% 30% 30% / 60% 60% 40% 40%;
            z-index: 2;
            box-shadow: 0 0 20px #fb923c;
        }

        .flame-inner {
            position: absolute;
            top: 15px;
            left: 50%;
            transform: translateX(-50%);
            width: 22px;
            height: 45px;
            background: linear-gradient(to top, #fbbf24, #fef3c7);
            border-radius: 50% 50% 30% 30% / 60% 60% 40% 40%;
            z-index: 3;
            box-shadow: 0 0 15px #fde047;
        }

        .flame-core {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 10px;
            height: 25px;
            background: #fff;
            border-radius: 50%;
            z-index: 4;
            box-shadow: 0 0 15px white;
        }

        @keyframes flicker {
            0% { transform: translate(-50%, -60%) scale(1, 1); }
            25% { transform: translate(-48%, -58%) scale(0.95, 1.05); }
            50% { transform: translate(-50%, -60%) scale(1.02, 0.98); }
            75% { transform: translate(-52%, -62%) scale(0.98, 1.03); }
            100% { transform: translate(-50%, -60%) scale(1, 1); }
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
        }
      `}</style>
      <div className="lamp-base" />
      <div className="lamp-oil" />
      <div className="flame-container">
          <div className="flame-glow" />
          <div className="flame-outer" />
          <div className="flame-inner" />
          <div className="flame-core" />
          <div className="lamp-wick" />
      </div>
    </div>
  );
};
